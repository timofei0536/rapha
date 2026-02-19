<?php
/**
 * NextWP — create ACF field groups from Next components/ (no inner fields yet).
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
 * Build map: component_name => array of page slugs that use it (from Next.js page files).
 *
 * @param string $project_path Path to Next project.
 * @return array Associative array component => array of slugs.
 */
function nextwp_get_component_pages_map( $project_path ) {
    $pages = nextwp_get_pages_from_app( $project_path );
    $map  = array();
    foreach ( array_keys( $pages ) as $slug ) {
        $path = nextwp_get_page_file_path( $project_path, $slug );
        $components = nextwp_parse_components_from_page_file( $path );
        foreach ( $components as $name ) {
            if ( ! isset( $map[ $name ] ) ) {
                $map[ $name ] = array();
            }
            $map[ $name ][] = $slug;
        }
    }
    return $map;
}

/**
 * Get WP page IDs for pages where this component is used (from Next.js).
 *
 * @param string $component_name Component name.
 * @param string $project_path Path to Next project.
 * @return array Page IDs.
 */
function nextwp_get_page_ids_for_component( $component_name, $project_path ) {
    $map = nextwp_get_component_pages_map( $project_path );
    $slugs = isset( $map[ $component_name ] ) ? $map[ $component_name ] : array();
    $ids = array();
    foreach ( $slugs as $slug ) {
        $check_slug = $slug ? $slug : 'home';
        $page = get_page_by_path( $check_slug, OBJECT, 'page' );
        if ( $page && isset( $page->ID ) ) {
            $ids[] = (int) $page->ID;
        }
    }
    return $ids;
}

/**
 * ACF location rule: show only on these page IDs (one OR group per page).
 * Empty page_ids = show on no page (rule that does not match), so group does not appear everywhere.
 *
 * @param array $page_ids Page post IDs.
 * @return array ACF location array.
 */
function nextwp_build_acf_location_for_pages( $page_ids ) {
    if ( empty( $page_ids ) ) {
        return array( array( array( 'param' => 'page', 'operator' => '==', 'value' => '0' ) ) );
    }
    $rules = array();
    foreach ( $page_ids as $id ) {
        $rules[] = array( array( 'param' => 'page', 'operator' => '==', 'value' => (string) $id ) );
    }
    return $rules;
}

/**
 * Create one ACF group per component. Idempotent. Location = only pages that use it in Next.js.
 *
 * @param string $project_path Path to Next project.
 */
function nextwp_create_components_from_dir( $project_path ) {
    if ( ! function_exists( 'acf_import_field_group' ) ) {
        nextwp_log( 'Components: ACF not available, skip' );
        return;
    }

    $names = nextwp_get_components_from_dir( $project_path );
    $created = (array) get_option( NEXTWP_OPTION_ACF, array() );

    foreach ( $names as $name ) {
        $key = NEXTWP_ACF_PREFIX . strtolower( preg_replace( '/[^a-z0-9]/i', '_', $name ) );
        $page_ids = nextwp_get_page_ids_for_component( $name, $project_path );
        $location = nextwp_build_acf_location_for_pages( $page_ids );

        $existing = function_exists( 'acf_get_field_group' ) ? acf_get_field_group( $key ) : null;
        if ( $existing && isset( $existing['ID'] ) ) {
            $existing['location'] = $location;
            $existing['fields']   = array();
            acf_import_field_group( $existing );
            nextwp_log( 'Components: updated location + cleared fields', array( 'name' => $name, 'pages' => count( $page_ids ) ) );
            $created[] = $key;
            continue;
        }

        nextwp_log( 'Components: create ACF group', array( 'name' => $name, 'key' => $key, 'pages' => count( $page_ids ) ) );
        $group = array(
            'key'        => $key,
            'title'      => $name,
            'fields'     => array(),
            'location'   => $location,
            'menu_order' => 0,
            'active'     => true,
        );

        acf_import_field_group( $group );
        $created[] = $key;
    }

    update_option( NEXTWP_OPTION_ACF, array_values( array_unique( $created ) ) );
    nextwp_log( 'Components: total groups (tracked)', count( $created ) );
}

/**
 * Delete all ACF groups created by this script.
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
