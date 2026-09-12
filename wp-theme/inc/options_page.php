<?php
if ( function_exists( 'acf_add_options_page' ) ) {

  
  // Main Theme Settings Page
  $parent = acf_add_options_page( array(
    'page_title' => 'Theme General Settings',
    'menu_title' => 'Theme Settings',
    'redirect'   => 'Theme Settings',
  ) );

  // 
  // Global Options
  // Same options on all languages. e.g., social profiles links
  // 

  acf_add_options_sub_page( array(
    'page_title' => 'Global Options',
    'menu_title' => __('Global Options', 'text-domain'),
    'menu_slug'  => "acf-options",
    'parent'     => $parent['menu_slug']
  ) );

  // 
  // Language Specific Options
  // Translatable options specific languages. e.g., social profiles links
  // 
  
  $languages = array( 'ru', 'en' );

  foreach ( $languages as $lang ) {
    acf_add_options_sub_page( array(
      'page_title' => 'Options (' . strtoupper( $lang ) . ')',
      'menu_title' => __('Options (' . strtoupper( $lang ) . ')', 'text-domain'),
      'menu_slug'  => "options-${lang}",
      'post_id'    => $lang,
      'parent'     => $parent['menu_slug']
    ) );
  }

}