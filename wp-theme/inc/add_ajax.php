<?php
//ADD AJAX
function my_enqueue()
{

    wp_enqueue_script('ajax-script', get_template_directory_uri() . '/js/ajax-scripts.js');

    wp_localize_script('ajax-script', 'my_ajax_object',
        array('ajax_url' => admin_url('admin-ajax.php')));
}

add_action('wp_enqueue_scripts', 'my_enqueue');