<?php
/**
 * NextWP — migration Next.js → WordPress.
 *
 * 1) Put nextwp folder in theme root.
 * 2) Put src/ and public/ from your Next build inside nextwp/.
 * 3) In theme functions.php add (2 lines):
 *
 *    require_once get_template_directory() . '/nextwp/nextwp.php';
 *    add_action( 'init', 'nextwp_run', 11 );
 *
 * Rollback: open site as admin with ?nextwp_rollback=1
 *
 * Debug: define( 'NEXTWP_DEBUG', true ); before require to get echo + console.log.
 */

if ( ! defined( 'ABSPATH' ) ) {
    return;
}

define( 'NEXTWP_PATH', __DIR__ );
define( 'NEXTWP_META', '_next_wp_migrate' );
define( 'NEXTWP_OPTION_PAGES', 'next_wp_migrate_page_ids' );
define( 'NEXTWP_OPTION_ACF', 'next_wp_migrate_acf_keys' );
define( 'NEXTWP_ACF_PREFIX', 'group_next_' );

/** Component names to skip when creating ACF groups (case-insensitive). */
if ( ! defined( 'NEXTWP_IGNORE_COMPONENTS' ) ) {
    define( 'NEXTWP_IGNORE_COMPONENTS', 'ui,header,footer,form' );
}

/** Set to true to enable debug logs (echo + console.log in browser). */
if ( ! defined( 'NEXTWP_DEBUG' ) ) {
    define( 'NEXTWP_DEBUG', false );
}

/**
 * Debug log: echo + browser console when NEXTWP_DEBUG is true.
 *
 * @param string $message
 * @param mixed  $data Optional; will be json_encode'd.
 */
function nextwp_log( $message, $data = null ) {
    if ( ! NEXTWP_DEBUG ) {
        return;
    }
    $str = $message;
    if ( $data !== null ) {
        $str .= ' ' . ( is_string( $data ) ? $data : wp_json_encode( $data, JSON_UNESCAPED_UNICODE ) );
    }
    $prefixed = '[NextWP] ' . $str;
    echo $prefixed . "\n";
    if ( php_sapi_name() !== 'cli' && defined( 'ABSPATH' ) ) {
        echo '<script>console.log(' . wp_json_encode( $prefixed ) . ');</script>';
    }
}

require_once NEXTWP_PATH . '/field-types.php';
require_once NEXTWP_PATH . '/component-schema.php';
require_once NEXTWP_PATH . '/pages.php';
require_once NEXTWP_PATH . '/components.php';

/**
 * Run migration (idempotent). Call from init. Use ?nextwp_rollback=1 to undo.
 */
function nextwp_run() {
    if ( ! empty( $_GET['nextwp_rollback'] ) && current_user_can( 'manage_options' ) ) {
        nextwp_log( 'Rollback requested' );
        nextwp_rollback();
        nextwp_log( 'Rollback done' );
        if ( wp_redirect( remove_query_arg( 'nextwp_rollback' ) ) ) {
            exit;
        }
    }

    $project_path = defined( 'NEXTWP_PROJECT_PATH' ) ? NEXTWP_PROJECT_PATH : NEXTWP_PATH;
    nextwp_log( 'Run migration', array( 'project_path' => $project_path ) );
    nextwp_create_pages_from_app( $project_path );
    nextwp_create_components_from_dir( $project_path );
    nextwp_log( 'Migration run finished' );
}

/**
 * Remove all pages and ACF groups created by this script.
 */
function nextwp_rollback() {
    nextwp_log( 'Rollback pages' );
    nextwp_rollback_pages();
    nextwp_log( 'Rollback components' );
    nextwp_rollback_components();
}
