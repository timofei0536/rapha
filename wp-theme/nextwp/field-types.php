<?php
/**
 * NextWP — field type constants and ACF mapping.
 * Types come from schema.json (built by Node script). This file only maps to ACF.
 */

if ( ! defined( 'ABSPATH' ) ) {
    return;
}

define( 'NEXTWP_FIELD_CONTENT', 'content' );
define( 'NEXTWP_FIELD_IMAGE', 'image' );
define( 'NEXTWP_FIELD_GALLERY', 'gallery' );
define( 'NEXTWP_FIELD_TEXT', 'text' );
define( 'NEXTWP_FIELD_LINK', 'link' );
define( 'NEXTWP_FIELD_HREF', 'href' );
define( 'NEXTWP_FIELD_REPEATER', 'repeater' );
define( 'NEXTWP_FIELD_GROUP', 'group' );

/**
 * Map our type to ACF field type.
 */
function nextwp_field_type_to_acf( $type ) {
    $map = array(
        'content'  => 'wysiwyg',
        'image'    => 'image',
        'gallery'  => 'gallery',
        'text'     => 'text',
        'link'     => 'link',
        'href'     => 'url',
        'repeater' => 'repeater',
        'group'    => 'group',
    );
    return isset( $map[ $type ] ) ? $map[ $type ] : 'text';
}

/**
 * Extra ACF field options for our type (return_format, preview_size, etc.).
 *
 * @param string $type Our internal type (link, image, gallery, …).
 * @return array Associative array to merge into ACF field.
 */
function nextwp_acf_field_options_for_type( $type ) {
    if ( $type === NEXTWP_FIELD_LINK ) {
        return array( 'return_format' => 'array' );
    }
    if ( $type === NEXTWP_FIELD_IMAGE || $type === NEXTWP_FIELD_GALLERY ) {
        return array( 'return_format' => 'array', 'preview_size' => 'medium' );
    }
    return array();
}
