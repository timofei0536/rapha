<?php
/**
 * NextWP — resolve app/components paths and file extensions.
 */

if ( ! defined( 'ABSPATH' ) ) {
    return;
}

/** Allowed page/component file extensions (without dot). */
if ( ! defined( 'NEXTWP_FILE_EXTENSIONS' ) ) {
    define( 'NEXTWP_FILE_EXTENSIONS', array( 'jsx', 'js', 'tsx', 'ts' ) );
}

/**
 * Resolve app directory path (src/app or app).
 *
 * @param string $project_path Project root path.
 * @return string|null Full path to app dir or null if not found.
 */
function nextwp_resolve_app_path( $project_path ) {
    $base = rtrim( $project_path, '/' );
    $app  = $base . '/src/app';
    if ( ! is_dir( $app ) ) {
        $app = $base . '/app';
    }
    return is_dir( $app ) ? $app : null;
}

/**
 * Resolve components directory path (src/components or components).
 *
 * @param string $project_path Project root path.
 * @return string|null Full path to components dir or null if not found.
 */
function nextwp_resolve_components_path( $project_path ) {
    $base = rtrim( $project_path, '/' );
    $comp = $base . '/src/components';
    if ( ! is_dir( $comp ) ) {
        $comp = $base . '/components';
    }
    return is_dir( $comp ) ? $comp : null;
}
