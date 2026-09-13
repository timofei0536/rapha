<?php
add_action('admin_menu', 'remove_menus');
function remove_menus() {
    //remove_menu_page('index.php');                # Dashboard 
    // remove_menu_page('edit.php');                 # Posts 
    remove_menu_page('edit-comments.php');        # Comments 
    // remove_menu_page('edit.php?post_type=page');  # Pages 
    //remove_menu_page('upload.php');               # Media 
    //remove_menu_page('themes.php');               # Appearance 
    //remove_menu_page('plugins.php');              # Plugins 
    //remove_menu_page('users.php');                # Users 
    //remove_menu_page('tools.php');                # Tools 
    //remove_menu_page('options-general.php');      # Settings 
    // remove_menu_page('edit.php?post_type=acf-field-group'); # ACF 

}

// remove editor
add_action( 'admin_init', 'hide_editor' );
function hide_editor() {
    remove_post_type_support('page', 'editor');
    remove_post_type_support('post', 'editor');
}

function disable_cptui_menu_items() {
    // Try to remove the CPT UI menu item
    remove_menu_page('cptui_manage_post_types'); // CPT UI top-level menu
    remove_submenu_page('cptui_manage_post_types', 'cptui_manage_post_types'); // CPT UI submenu
}

function disable_admin_menu_items() {
    remove_menu_page('index.php');
    // remove_menu_page('plugins.php'); // Plugins
    remove_menu_page('tools.php'); // Tools
    // remove_menu_page('edit.php?post_type=acf-field-group'); // ACF field groups
    remove_menu_page('edit.php?post_type=cptui_post_type');
     remove_menu_page('cptui_manage_post_types'); 
    remove_menu_page('themes.php'); // Appearance

    // Disable a submenu (if you need a specific one)
    // remove_submenu_page('tools.php', 'import.php'); // e.g. "Import"
}



// Hide available-update notices
remove_action( 'admin_notices', 'update_nag', 3 );



// Disable all updates (core, plugins, themes)
add_filter( 'auto_update_core', '__return_false' ); // Disable core updates
add_filter( 'auto_update_plugin', '__return_false' ); // Disable plugin updates
add_filter( 'auto_update_theme', '__return_false' ); // Disable theme updates

// Hide available-update notices in the admin bar
add_action( 'wp_admin_bar_init', 'remove_wp_admin_bar_updates' );

function remove_wp_admin_bar_updates() {
    global $wp_admin_bar;
    
    // Check that the 'updates' node exists before removing it
    if ( $wp_admin_bar->get_node('updates') ) {
        $wp_admin_bar->remove_node('updates');
    }
}

// Hide available-update notices for plugins and themes
add_filter( 'site_transient_update_plugins', '__return_null' );
add_filter( 'site_transient_update_themes', '__return_null' );

// Hide core updates
add_filter( 'pre_site_transient_update_core', '__return_null' );




// Remove the comments icon from the admin bar for all users
add_action( 'wp_before_admin_bar_render', 'remove_wp_admin_bar_comments', 999 );

function remove_wp_admin_bar_comments() {
    global $wp_admin_bar;

    // Remove the "Comments" node from the admin bar
    $wp_admin_bar->remove_node('comments');
}


function hide_polylang_menu() {
    if (is_admin()) {
        remove_menu_page('mlang'); // 'mlang' is the Polylang page id
    }
}
add_action('admin_menu', 'hide_polylang_menu', 100);



// hide after dev mode:

add_action('admin_menu', 'disable_admin_menu_items', 999);
add_action('admin_menu', 'disable_cptui_menu_items', 9999);