 <?php 

// error_reporting( E_ALL );
// ini_set( 'display_errors', 1 );

add_filter( 'show_admin_bar', '__return_false' );


require get_template_directory() . '/inc/scripts_and_styles.php'; // подключаем скрипты и стили
require get_template_directory() . '/inc/remove_unnecessary.php'; // remove unnecessary wp
require get_template_directory() . '/inc/remove_unnecessary_admin_panel.php'; // remove unnecessary from admin panel;

 // SVG Support

add_filter(
  'upload_mimes',
  fn($mimes) => array_merge($mimes, ['svg' => 'image/svg+xml'])
);


function get_page_id($key) {
    $pages = [
        'home'    => get_option('page_on_front'),
        'contact' => 15,
        'points'  => 17,
        'error'   => 378,
    ];

    if (!isset($pages[$key])) {
        return 0;
    }

    $id = $pages[$key];
    return function_exists('pll_get_post') ? pll_get_post($id) : $id;
}



    // $main_menu = get_field('main_menu',get_home_page_id());
    // $main_video = get_field('main_background',get_home_page_id());
    // $burger_small_menu = get_field('burger_small_menu',get_home_page_id());
    
    // $socials = get_field('socials', get_home_page_id() );

    // $phone = get_field('phone',get_contact_page_id());
    // $email = get_field('email',get_contact_page_id());
    // $address = get_field('address',get_contact_page_id());
    // $background = get_field('background',get_contact_page_id());

    // $coords = get_field('coords',get_home_page_id());

    // $contact = array(
    //     'phone' => $phone,
    //     'email' => $email,
    //     'address' => $address,
    //     'background' => $background,
    // );



function get_svg_content($file_path) {
    if (file_exists($file_path)) {
        return file_get_contents($file_path);
    }
    return '';
}



// CREATE PAGES;

// add_action('admin_init', function () {
//   $pages = [
//     ['title' => '404', 'slug' => 'error'],
//     ['title' => 'Contact', 'slug' => 'contact'],
//     ['title' => 'Policy', 'slug' => 'privacy-policy'],
//     ['title' => 'Profile', 'slug' => 'profile'],
//     ['title' => 'Projects', 'slug' => 'projects'],
//     ['title' => 'Home', 'slug' => 'home'],
//   ];

//   foreach ($pages as $p) {
//     if (get_page_by_path($p['slug'], OBJECT, 'page')) continue;
//     wp_insert_post([
//       'post_title'  => $p['title'],
//       'post_name'   => $p['slug'],
//       'post_type'   => 'page',
//       'post_status' => 'publish',
//       'post_author' => get_current_user_id() ?: 1,
//     ]);
//   }
// });


// require_once get_template_directory() . '/nextwp/nextwp.php';
// add_action( 'init', 'nextwp_run', 11 );



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
        'supports'            => array( 'title' ),
        'show_in_rest'        => true,
    );

    register_post_type( 'services', $args );
}

add_action( 'init', 'rapha_register_cpt_services', 10 );


add_action('rest_api_init', function () {

  register_rest_field('page', 'acf', [
    'get_callback' => function ($post) {
      return get_fields($post['id']);
    },
    'schema' => null,
  ]);
  
  register_rest_field('post', 'acf', [
    'get_callback' => function ($post) {
      return get_fields($post['id']);
    },
    'schema' => null,
  ]);
  
  register_rest_field('services', 'acf', [
    'get_callback' => function ($post) {
      return get_fields($post['id']);
    },
    'schema' => null,
  ]);
  

});



/**
 * Allow orderby=menu_order in REST API for services (list order = menu order in admin).
 */
function rapha_rest_services_orderby_menu_order( $params ) {
    if ( isset( $params['orderby']['enum'] ) && is_array( $params['orderby']['enum'] ) ) {
        if ( ! in_array( 'menu_order', $params['orderby']['enum'], true ) ) {
            $params['orderby']['enum'][] = 'menu_order';
        }
    }
    if ( isset( $params['orderby'] ) && is_array( $params['orderby'] ) ) {
        $params['orderby']['default'] = 'menu_order';
    }
    if ( isset( $params['order'] ) && is_array( $params['order'] ) ) {
        $params['order']['default'] = 'asc';
    }
    return $params;
}

add_filter( 'rest_services_collection_params', 'rapha_rest_services_orderby_menu_order', 10, 1 );

/**
 * Force menu_order for services REST API so list always matches admin order.
 */
function rapha_rest_services_query_menu_order( $args, $request ) {
    $args['orderby'] = 'menu_order';
    $args['order']   = 'ASC';
    return $args;
}

add_filter( 'rest_services_query', 'rapha_rest_services_query_menu_order', 10, 2 );


// add_action('admin_head', function () {
//     echo '<style>
//         [data-key="field_ff8fc2fd41692422097f2c9e58939d51"] {
//             display: none !important;
//         }
//     </style>';
// });



add_filter('post_link', function($url) {
    return str_replace('https://rapha.tim-work.com', 'http://rapha.artydevs.com', $url);
});

add_filter('page_link', function($url) {
    return str_replace('https://rapha.tim-work.com', 'http://rapha.artydevs.com', $url);
});


require_once get_template_directory() . '/preview-rest.php';
add_action( 'rest_api_init', 'el_rapha_register_preview_route' );
