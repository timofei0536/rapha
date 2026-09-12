<?php
/**
 * Enqueue scripts and styles.
 */
function eurobouquets_scripts() {
/* Мои стили */
//wp_enqueue_style( 'cdnjs_a_a', 'https://cdnjs.cloudflare.com/ajax/libs/Swiper/5.4.5/css/swiper.min.css', array() );
//wp_enqueue_style( 'assets_a_a', get_template_directory_uri() . '/dist/assets/css/app.css?v=1636992732409', array() );
/* Мои стили конеец */



/* Мои скрипты */
//wp_enqueue_script( 'ajax_a', 'https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js', array(),  null, true );
//wp_enqueue_script( 'app_a', get_template_directory_uri() . '/dist/js/app.js?v=1636992732356', array(),  null, true );


/* Мои скрипты конец */
    if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
        wp_enqueue_script( 'comment-reply' );
    }
}
add_action( 'wp_enqueue_scripts', 'eurobouquets_scripts' );