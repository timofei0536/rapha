<?php
/**
 * NextWP — migrate services from defaults to WP (custom post type 'services').
 * Text only; no images.
 *
 * Include in theme functions.php (after cpt-services.php):
 *   require_once get_template_directory() . '/nextwp/services-migration.php';
 * Then run once: add_action( 'init', 'rapha_migrate_services_from_defaults', 20 );
 *
 * Or run manually: add ?rapha_migrate_services=1 to any URL when logged in as admin.
 */

if ( ! defined( 'ABSPATH' ) ) {
    return;
}

define( 'RAPHA_OPTION_SERVICES_MIGRATED', 'rapha_services_migrated_slugs' );

/**
 * Services data from defaults (Services/defaults.js + Service/defaults.js).
 * No images; slug, title, content only.
 *
 * @return array<int, array{slug: string, title: string, content: string}>
 */
function rapha_get_default_services() {
    $content_shared = 'Serving patients and the establishment\'s medical and care teams 24/7, the medical biology analysis laboratory is also open to any external patient for the performance of analyses prescribed by their attending physician.';

    return array(
        array(
            'slug'    => 'resuscitation',
            'title'   => 'Resuscitation',
            'content' => '',
        ),
        array(
            'slug'    => 'surgery-operating-room',
            'title'   => 'Surgery & Operating room',
            'content' => 'Serving patients and the establishment\'s medical and care teams 24/7, the medical biology analysis laboratory is also open to any external patient for the performance',
        ),
        array(
            'slug'    => 'emergencies',
            'title'   => 'Emergencies',
            'content' => $content_shared,
        ),
        array(
            'slug'    => 'internal-medicine-dialysis',
            'title'   => 'Internal Medicine Dialysis',
            'content' => '',
        ),
        array(
            'slug'    => 'analysis-laboratory',
            'title'   => 'Analysis Laboratory',
            'content' => $content_shared,
        ),
        array(
            'slug'    => 'other-specialties',
            'title'   => 'Other Specialties',
            'content' => '',
        ),
        array(
            'slug'    => 'hospitality-catering',
            'title'   => 'Hospitality & Catering',
            'content' => '',
        ),
        array(
            'slug'    => 'medical-imaging',
            'title'   => 'Medical Imaging',
            'content' => $content_shared,
        ),
        array(
            'slug'    => 'gynecology-obstetrics',
            'title'   => 'Gynecology-Obstetrics',
            'content' => $content_shared,
        ),
    );
}

/**
 * Migrate default services to WP posts (post type 'services'). Idempotent.
 */
function rapha_migrate_services_from_defaults() {
    if ( ! function_exists( 'rapha_register_cpt_services' ) ) {
        return;
    }

    $run_manual = isset( $_GET['rapha_migrate_services'] ) && current_user_can( 'manage_options' );
    if ( ! $run_manual ) {
        $migrated = get_option( RAPHA_OPTION_SERVICES_MIGRATED, array() );
        if ( ! is_array( $migrated ) ) {
            $migrated = array();
        }
        if ( count( $migrated ) > 0 ) {
            return;
        }
    }

    $services = rapha_get_default_services();
    $migrated = (array) get_option( RAPHA_OPTION_SERVICES_MIGRATED, array() );

    foreach ( $services as $item ) {
        $slug = is_string( $item['slug'] ) ? $item['slug'] : '';
        $title = isset( $item['title'] ) ? $item['title'] : $slug;
        $content = isset( $item['content'] ) ? $item['content'] : '';

        if ( $slug === '' ) {
            continue;
        }

        $existing = get_posts( array(
            'post_type'      => 'services',
            'post_status'    => 'any',
            'name'           => $slug,
            'posts_per_page' => 1,
            'fields'         => 'ids',
        ) );

        if ( ! empty( $existing ) ) {
            if ( defined( 'NEXTWP_DEBUG' ) && NEXTWP_DEBUG ) {
                nextwp_log( 'Services migration: skip (exists)', $slug );
            }
            $migrated[ $slug ] = 1;
            continue;
        }

        $post_id = wp_insert_post( array(
            'post_type'    => 'services',
            'post_title'   => $title,
            'post_name'    => $slug,
            'post_content' => $content,
            'post_status'  => 'publish',
        ), true );

        if ( is_wp_error( $post_id ) || ! $post_id ) {
            continue;
        }

        $migrated[ $slug ] = 1;
    }

    update_option( RAPHA_OPTION_SERVICES_MIGRATED, $migrated );

    if ( $run_manual && wp_redirect( remove_query_arg( 'rapha_migrate_services' ) ) ) {
        exit;
    }
}

add_action( 'init', 'rapha_migrate_services_from_defaults', 20 );
