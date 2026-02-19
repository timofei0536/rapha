<?php
/**
 * NextWP — one ACF field group per page with comment "Page", components as tabs with comment "Component".
 */

if ( ! defined( 'ABSPATH' ) ) {
    return;
}

/**
 * Get component names: top-level dirs in components/ (except NEXTWP_IGNORE_COMPONENTS).
 *
 * @param string $project_path Path to folder containing src/components or components.
 * @return array List of component names
 */
function nextwp_get_components_from_dir( $project_path ) {
    $comp = rtrim( $project_path, '/' ) . '/src/components';
    if ( ! is_dir( $comp ) ) {
        $comp = rtrim( $project_path, '/' ) . '/components';
    }
    if ( ! is_dir( $comp ) ) {
        nextwp_log( 'Components: dir not found', $comp );
        return array();
    }

    $ignore = array_map( 'trim', explode( ',', strtolower( NEXTWP_IGNORE_COMPONENTS ) ) );
    $list   = array();
    foreach ( scandir( $comp ) as $name ) {
        if ( $name === '.' || $name === '..' ) {
            continue;
        }
        $path = $comp . DIRECTORY_SEPARATOR . $name;
        if ( ! is_dir( $path ) || in_array( strtolower( $name ), $ignore, true ) ) {
            continue;
        }
        $list[] = $name;
    }
    nextwp_log( 'Components: found', $list );
    return $list;
}

/**
 * Get page file path for a slug (finds page.js, page.jsx, page.ts, page.tsx).
 *
 * @param string $project_path Path to Next project.
 * @param string $slug Page slug (empty for home).
 * @return string|null Full path or null if not found.
 */
function nextwp_get_page_file_path( $project_path, $slug ) {
    $app = rtrim( $project_path, '/' ) . '/src/app';
    if ( ! is_dir( $app ) ) {
        $app = rtrim( $project_path, '/' ) . '/app';
    }
    $base = $slug ? $app . '/' . $slug : $app;
    $extensions = array( 'jsx', 'js', 'tsx', 'ts' );
    foreach ( $extensions as $ext ) {
        $path = $base . '/page.' . $ext;
        if ( file_exists( $path ) ) {
            return $path;
        }
    }
    return null;
}

/**
 * Extract component names from a page file (imports from @/components/Name or ../components/Name).
 *
 * @param string $file_path Full path to page file.
 * @return array Component names (e.g. array( 'About', 'Hero' )).
 */
function nextwp_parse_components_from_page_file( $file_path ) {
    if ( ! $file_path || ! is_readable( $file_path ) ) {
        return array();
    }
    $content = file_get_contents( $file_path );
    $names   = array();
    if ( preg_match_all( '#from\s+[\'"](?:@/components|\.\./components|\.\./\.\./components)/([^/\'"]+)/#', $content, $m ) ) {
        $names = array_unique( array_map( 'trim', $m[1] ) );
    }
    return $names;
}

/**
 * Get component names used on a page (from Next.js file), filtered by ignore list.
 *
 * @param string $project_path Path to Next project.
 * @param string $slug Page slug.
 * @return array Component names.
 */
function nextwp_get_components_for_page_slug( $project_path, $slug ) {
    $path = nextwp_get_page_file_path( $project_path, $slug );
    $names = nextwp_parse_components_from_page_file( $path );
    $ignore = array_map( 'trim', explode( ',', strtolower( NEXTWP_IGNORE_COMPONENTS ) ) );
    $out = array();
    foreach ( $names as $name ) {
        if ( ! in_array( strtolower( $name ), $ignore, true ) ) {
            $out[] = $name;
        }
    }
    return $out;
}

/**
 * Create one ACF group per page: title "Page", description "Page", components as tabs; each tab has message "Component".
 *
 * @param string $project_path Path to Next project.
 */
function nextwp_create_components_from_dir( $project_path ) {
    if ( ! function_exists( 'acf_import_field_group' ) ) {
        nextwp_log( 'Components: ACF not available, skip' );
        return;
    }

    $pages = nextwp_get_pages_from_app( $project_path );
    $created = (array) get_option( NEXTWP_OPTION_ACF, array() );

    foreach ( array_keys( $pages ) as $slug ) {
        $check_slug = $slug ? $slug : 'home';
        $page = get_page_by_path( $check_slug, OBJECT, 'page' );
        if ( ! $page || ! isset( $page->ID ) ) {
            continue;
        }
        $page_id = (int) $page->ID;
        $components = nextwp_get_components_for_page_slug( $project_path, $slug );
        $group_key = NEXTWP_ACF_PREFIX . 'page_' . ( $slug ? strtolower( preg_replace( '/[^a-z0-9]/i', '_', $slug ) ) : 'home' );

        $fields = array();
        foreach ( $components as $name ) {
            $comp_key = NEXTWP_ACF_PREFIX . strtolower( preg_replace( '/[^a-z0-9]/i', '_', $name ) );
            $tab_key  = 'field_' . md5( $group_key . '_tab_' . $name );
            $clone_key = 'field_' . md5( $group_key . '_clone_' . $name );
            $fields[] = array(
                'key'   => $tab_key,
                'label' => $name,
                'name'  => '',
                'type'  => 'tab',
            );
            $fields[] = array(
                'key'     => $clone_key,
                'label'   => 'Component',
                'name'    => 'component_' . strtolower( preg_replace( '/[^a-z0-9]/i', '_', $name ) ),
                'type'    => 'clone',
                'clone'   => array( $comp_key ),
                'display' => 'seamless',
                'layout'  => 'block',
            );
        }

        $page_title = isset( $pages[ $slug ] ) ? $pages[ $slug ] : ucfirst( $check_slug );
        $location = array( array( array( 'param' => 'page', 'operator' => '==', 'value' => (string) $page_id ) ) );
        $group = array(
            'key'         => $group_key,
            'title'       => $page_title . ' Page',
            'description' => 'Page',
            'fields'      => $fields,
            'location'    => $location,
            'menu_order'  => 500,
            'active'      => true,
        );

        $existing = function_exists( 'acf_get_field_group' ) ? acf_get_field_group( $group_key ) : null;
        if ( $existing && isset( $existing['ID'] ) ) {
            $group['ID'] = $existing['ID'];
            acf_import_field_group( $group );
            nextwp_log( 'Components: updated page group', array( 'slug' => $check_slug, 'components' => count( $components ) ) );
        } else {
            acf_import_field_group( $group );
            nextwp_log( 'Components: created page group', array( 'slug' => $check_slug, 'components' => count( $components ) ) );
        }
        $created[] = $group_key;
    }

    update_option( NEXTWP_OPTION_ACF, array_values( array_unique( $created ) ) );
    nextwp_log( 'Components: page groups (tracked)', count( $created ) );

    nextwp_set_component_groups_description();
    nextwp_apply_component_fields_from_schema();
}

/**
 * Set description "Component" on all our legacy component groups (so "Component" shows in Field Groups list).
 */
function nextwp_set_component_groups_description() {
    if ( ! function_exists( 'acf_get_field_groups' ) || ! function_exists( 'acf_update_field_group' ) ) {
        return;
    }
    $all = acf_get_field_groups();
    $prefix = NEXTWP_ACF_PREFIX;
    $page_prefix = $prefix . 'page_';
    foreach ( $all as $g ) {
        $key = isset( $g['key'] ) ? $g['key'] : '';
        if ( strpos( $key, $prefix ) !== 0 || strpos( $key, $page_prefix ) === 0 ) {
            continue;
        }
        $g['description'] = 'Component';
        $g['location']    = array( array( array( 'param' => 'page', 'operator' => '==', 'value' => '0' ) ) );
        $g['menu_order']  = 0;
        acf_update_field_group( $g );
        nextwp_log( 'Components: set description Component + location none', $g['title'] );
    }
}

/**
 * Apply fields from component schema to each component group (content, image, gallery, text, link, repeater, group).
 */
function nextwp_apply_component_fields_from_schema() {
    if ( ! function_exists( 'acf_get_field_groups' ) || ! function_exists( 'acf_import_field_group' ) ) {
        return;
    }
    $all = acf_get_field_groups();
    $prefix = NEXTWP_ACF_PREFIX;
    $page_prefix = $prefix . 'page_';
    foreach ( $all as $g ) {
        $key = isset( $g['key'] ) ? $g['key'] : '';
        if ( strpos( $key, $prefix ) !== 0 || strpos( $key, $page_prefix ) === 0 ) {
            continue;
        }
        $component_name = isset( $g['title'] ) ? $g['title'] : '';
        if ( ! $component_name ) {
            continue;
        }
        $fields = nextwp_build_acf_fields_from_schema( $component_name, $key );
        if ( empty( $fields ) ) {
            continue;
        }
        $g['fields'] = $fields;
        acf_import_field_group( $g );
        nextwp_log( 'Components: applied schema fields', array( 'component' => $component_name, 'count' => count( $fields ) ) );
    }
}

/**
 * Delete all ACF groups created by this script (page groups).
 */
function nextwp_rollback_components() {
    if ( ! function_exists( 'acf_get_field_group' ) || ! function_exists( 'acf_delete_field_group' ) ) {
        delete_option( NEXTWP_OPTION_ACF );
        nextwp_log( 'Components rollback: ACF not available, cleared option' );
        return;
    }
    $keys = (array) get_option( NEXTWP_OPTION_ACF, array() );
    nextwp_log( 'Components rollback: deleting groups', count( $keys ) );
    foreach ( $keys as $key ) {
        $g = acf_get_field_group( $key );
        if ( $g && isset( $g['ID'] ) ) {
            acf_delete_field_group( (int) $g['ID'] );
        }
    }
    delete_option( NEXTWP_OPTION_ACF );
}
