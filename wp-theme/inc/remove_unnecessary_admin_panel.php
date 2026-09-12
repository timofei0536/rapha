<?php
add_action('admin_menu', 'remove_menus');
function remove_menus() {
    //remove_menu_page('index.php');                # Консоль 
    // remove_menu_page('edit.php');                 # Записи 
    remove_menu_page('edit-comments.php');        # Комментарии 
    // remove_menu_page('edit.php?post_type=page');  # Страницы 
    //remove_menu_page('upload.php');               # Медиафайлы 
    //remove_menu_page('themes.php');               # Внешний вид 
    //remove_menu_page('plugins.php');              # Плагины 
    //remove_menu_page('users.php');                # Пользователи 
    //remove_menu_page('tools.php');                # Инструменты 
    //remove_menu_page('options-general.php');      # Параметры 
    // remove_menu_page('edit.php?post_type=acf-field-group'); # ACF 

}

// remove editor
add_action( 'admin_init', 'hide_editor' );
function hide_editor() {
    remove_post_type_support('page', 'editor');
    remove_post_type_support('post', 'editor');
}

function disable_cptui_menu_items() {
    // Попытка удалить пункт меню CPT UI
    remove_menu_page('cptui_manage_post_types'); // Основной пункт меню для CPT UI
    remove_submenu_page('cptui_manage_post_types', 'cptui_manage_post_types'); // Подменю CPT UI
}

function disable_admin_menu_items() {
    remove_menu_page('index.php');
    // remove_menu_page('plugins.php'); // Плагины
    remove_menu_page('tools.php'); // Инструменты
    // remove_menu_page('edit.php?post_type=acf-field-group'); // Группы полей ACF
    remove_menu_page('edit.php?post_type=cptui_post_type');
     remove_menu_page('cptui_manage_post_types'); 
    remove_menu_page('themes.php'); // Внешний вид

    // Отключение подменю (если нужно что-то конкретное)
    // remove_submenu_page('tools.php', 'import.php'); // Например, "Импорт"
}



// Скрыть уведомления о доступных обновлениях
remove_action( 'admin_notices', 'update_nag', 3 );



// Отключаем все обновления (ядро, плагины, темы)
add_filter( 'auto_update_core', '__return_false' ); // Отключаем обновления ядра
add_filter( 'auto_update_plugin', '__return_false' ); // Отключаем обновления плагинов
add_filter( 'auto_update_theme', '__return_false' ); // Отключаем обновления тем

// Скрываем уведомления о доступных обновлениях в панели администратора
add_action( 'wp_admin_bar_init', 'remove_wp_admin_bar_updates' );

function remove_wp_admin_bar_updates() {
    global $wp_admin_bar;
    
    // Проверяем, существует ли узел 'updates' перед его удалением
    if ( $wp_admin_bar->get_node('updates') ) {
        $wp_admin_bar->remove_node('updates');
    }
}

// Скрыть уведомления о доступных обновлениях для плагинов и тем
add_filter( 'site_transient_update_plugins', '__return_null' );
add_filter( 'site_transient_update_themes', '__return_null' );

// Скрыть обновления ядра
add_filter( 'pre_site_transient_update_core', '__return_null' );




// Убираем значок комментариев в админ-баре для всех пользователей
add_action( 'wp_before_admin_bar_render', 'remove_wp_admin_bar_comments', 999 );

function remove_wp_admin_bar_comments() {
    global $wp_admin_bar;

    // Удаляем узел "Комментарии" из админ-бара
    $wp_admin_bar->remove_node('comments');
}


function hide_polylang_menu() {
    if (is_admin()) {
        remove_menu_page('mlang'); // 'mlang' — идентификатор страницы Polylang
    }
}
add_action('admin_menu', 'hide_polylang_menu', 100);



// hide after dev mode:

add_action('admin_menu', 'disable_admin_menu_items', 999);
add_action('admin_menu', 'disable_cptui_menu_items', 9999);