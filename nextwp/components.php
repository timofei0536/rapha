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
 * Create one ACF group per component (placeholder field only). Idempotent.
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
        if ( function_exists( 'acf_get_field_group' ) && acf_get_field_group( $key ) ) {
            nextwp_log( 'Components: skip (group exists)', $name );
            continue;
        }
        if ( in_array( $key, $created, true ) ) {
            nextwp_log( 'Components: skip (tracked)', $name );
            continue;
        }

        nextwp_log( 'Components: create ACF group', array( 'name' => $name, 'key' => $key ) );
        $group = array(
            'key'        => $key,
            'title'      => $name,
            'fields'     => array(
                array(
                    'key'   => 'field_' . md5( $key . '_placeholder' ),
                    'label' => 'Data (edit later)',
                    'name'  => 'component_data',
                    'type'  => 'textarea',
                ),
            ),
            'location'   => array( array( array( 'param' => 'post_type', 'operator' => '==', 'value' => 'page' ) ) ),
            'menu_order' => 0,
            'active'     => true,
        );

        acf_import_field_group( $group );
        $created[] = $key;
    }

    update_option( NEXTWP_OPTION_ACF, $created );
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
