<?php
/**
 * Custom Post Type: Services
 *
 * Include in theme functions.php:
 *   require_once get_template_directory() . '/nextwp/cpt-services.php';
 */

if ( ! defined( 'ABSPATH' ) ) {
    return;
}

function rapha_register_cpt_services() {
    $labels = array(
        'name'                  => _x( 'Services', 'Post type general name', 'rapha' ),
        'singular_name'         => _x( 'Service', 'Post type singular name', 'rapha' ),
        'menu_name'             => _x( 'Services', 'Admin Menu text', 'rapha' ),
        'name_admin_bar'        => _x( 'Service', 'Add New on Toolbar', 'rapha' ),
        'add_new'               => __( 'Add New', 'rapha' ),
        'add_new_item'          => __( 'Add New Service', 'rapha' ),
        'new_item'              => __( 'New Service', 'rapha' ),
        'edit_item'             => __( 'Edit Service', 'rapha' ),
        'view_item'             => __( 'View Service', 'rapha' ),
        'all_items'             => __( 'All Services', 'rapha' ),
        'search_items'          => __( 'Search Services', 'rapha' ),
        'not_found'             => __( 'No services found.', 'rapha' ),
        'not_found_in_trash'    => __( 'No services found in Trash.', 'rapha' ),
    );

    $args = array(
        'labels'             => $labels,
        'public'             => true,
        'publicly_queryable'  => true,
        'show_ui'             => true,
        'show_in_menu'        => true,
        'query_var'           => true,
        'rewrite'             => array( 'slug' => 'services' ),
        'capability_type'     => 'post',
        'has_archive'         => true,
        'hierarchical'        => false,
        'menu_position'       => 20,
        'menu_icon'           => 'dashicons-admin-generic',
        'supports'            => array( 'title', 'editor', 'thumbnail', 'excerpt' ),
        'show_in_rest'        => true,
    );

    register_post_type( 'services', $args );
}

add_action( 'init', 'rapha_register_cpt_services', 10 );
