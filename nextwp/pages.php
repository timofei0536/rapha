<?php
/**
 * NextWP — create WP pages from Next app/ structure.
 */

if ( ! defined( 'ABSPATH' ) ) {
    return;
}

/**
 * Discover page slugs from app: any folder with page.js/jsx/ts/tsx. Skips dynamic [slug] routes.
 *
 * @param string $project_path Path to folder containing src/app or app.
 * @return array slug as key, title as value
 */
function nextwp_get_pages_from_app( $project_path ) {
    $app = rtrim( $project_path, '/' ) . '/src/app';
    if ( ! is_dir( $app ) ) {
        $app = rtrim( $project_path, '/' ) . '/app';
    }
    if ( ! is_dir( $app ) ) {
        nextwp_log( 'Pages: app dir not found', $app );
        return array();
    }

    nextwp_log( 'Pages: scanning app', $app );
    $pages = array();
    $it = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator( $app, RecursiveDirectoryIterator::SKIP_DOTS ),
        RecursiveIteratorIterator::SELF_FIRST
    );

    foreach ( $it as $file ) {
        if ( ! $file->isFile() ) {
            continue;
        }
        $name = $file->getFilename();
        if ( ! preg_match( '/^page\.(js|jsx|ts|tsx)$/', $name ) ) {
            continue;
        }
        $path = $file->getPathname();
        $rel  = str_replace( $app . DIRECTORY_SEPARATOR, '', $path );
        $rel  = str_replace( DIRECTORY_SEPARATOR, '/', $rel );
        $rel  = preg_replace( '#/page\.(js|jsx|ts|tsx)$#', '', $rel );
        $rel  = trim( $rel, '/' );

        if ( preg_match( '#\[[^\]]+\]#', $rel ) ) {
            continue;
        }

        $slug = ( $rel === '' || strtolower( $rel ) === 'page' ) ? '' : $rel;
        $title = $slug === '' ? 'Home' : ucfirst( str_replace( '-', ' ', $slug ) );
        $pages[ $slug ] = $title;
    }

    nextwp_log( 'Pages: found', array_keys( $pages ) );
    return $pages;
}

/**
 * Create WP pages. Idempotent: skips if page with slug already exists.
 *
 * @param string $project_path Path to Next project (contains src/app).
 */
function nextwp_create_pages_from_app( $project_path ) {
    $pages = nextwp_get_pages_from_app( $project_path );
    $created = (array) get_option( NEXTWP_OPTION_PAGES, array() );

    foreach ( $pages as $slug => $title ) {
        $check_slug = $slug ?: 'home';
        if ( get_page_by_path( $check_slug, OBJECT, 'page' ) ) {
            nextwp_log( 'Pages: skip (exists)', $check_slug );
            continue;
        }

        nextwp_log( 'Pages: create', array( 'slug' => $check_slug, 'title' => $title ) );
        $post_id = wp_insert_post( array(
            'post_title'   => $title,
            'post_name'    => $check_slug,
            'post_status'  => 'publish',
            'post_type'    => 'page',
            'post_author'  => 1,
        ), true );

        if ( ! is_wp_error( $post_id ) ) {
            update_post_meta( $post_id, NEXTWP_META, '1' );
            $created[] = $post_id;
        } else {
            nextwp_log( 'Pages: insert error', $post_id->get_error_message() );
        }
    }

    $remove_slugs = array( 'page', 'page_js', 'page-js', 'page.js' );
    foreach ( $remove_slugs as $bad_slug ) {
        $p = get_page_by_path( $bad_slug, OBJECT, 'page' );
        if ( $p && get_post_meta( $p->ID, NEXTWP_META, true ) ) {
            wp_delete_post( (int) $p->ID, true );
            $created = array_diff( $created, array( $p->ID ) );
            nextwp_log( 'Pages: removed unnecessary page', array( 'slug' => $bad_slug ) );
        }
    }
    $our_pages = get_posts( array(
        'post_type'      => 'page',
        'post_status'    => 'any',
        'meta_key'       => NEXTWP_META,
        'meta_value'     => '1',
        'posts_per_page' => -1,
    ) );
    foreach ( $our_pages as $p ) {
        $name = $p->post_name;
        $title = $p->post_title;
        if ( in_array( $name, $remove_slugs, true ) || $title === 'Page' || $title === 'Page.js' ) {
            wp_delete_post( (int) $p->ID, true );
            $created = array_diff( $created, array( $p->ID ) );
            nextwp_log( 'Pages: removed unnecessary page', array( 'slug' => $name, 'title' => $title ) );
        }
    }

    update_option( NEXTWP_OPTION_PAGES, array_unique( array_map( 'intval', $created ) ) );
    nextwp_log( 'Pages: total created (tracked)', count( $created ) );
}

/**
 * Delete all pages created by this script.
 */
function nextwp_rollback_pages() {
    $ids = (array) get_option( NEXTWP_OPTION_PAGES, array() );
    nextwp_log( 'Pages rollback: deleting', count( $ids ) );
    foreach ( $ids as $id ) {
        if ( get_post_meta( $id, NEXTWP_META, true ) ) {
            wp_delete_post( (int) $id, true );
        }
    }
    delete_option( NEXTWP_OPTION_PAGES );
}
