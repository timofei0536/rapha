<?php
/**
 * NextWP — standard field types and inference from name (regex).
 */

if ( ! defined( 'ABSPATH' ) ) {
    return;
}

define( 'NEXTWP_FIELD_CONTENT', 'content' );
define( 'NEXTWP_FIELD_IMAGE', 'image' );
define( 'NEXTWP_FIELD_GALLERY', 'gallery' );
define( 'NEXTWP_FIELD_TEXT', 'text' );
define( 'NEXTWP_FIELD_LINK', 'link' );
define( 'NEXTWP_FIELD_REPEATER', 'repeater' );
define( 'NEXTWP_FIELD_GROUP', 'group' );

/**
 * Map our type to ACF field type.
 *
 * @param string $type One of content, image, gallery, text, link, repeater, group.
 * @return string ACF type (wysiwyg, image, gallery, text, link, repeater, group).
 */
function nextwp_field_type_to_acf( $type ) {
    $map = array(
        'content'  => 'wysiwyg',
        'image'    => 'image',
        'gallery'  => 'gallery',
        'text'     => 'text',
        'link'     => 'link',
        'repeater' => 'repeater',
        'group'    => 'group',
    );
    return isset( $map[ $type ] ) ? $map[ $type ] : 'text';
}

/**
 * Infer field type from field name (regex).
 * Order: content → link → gallery → repeater → group → image → text.
 *
 * @param string $name Field/prop name (e.g. title, image, content).
 * @return string One of content, image, gallery, link, repeater, group, text.
 */
function nextwp_infer_field_type( $name ) {
    $name = strtolower( trim( $name ) );
    if ( preg_match( '/^(content|html|body|wysiwyg|description|content_html|data)$/', $name ) ) {
        return NEXTWP_FIELD_CONTENT;
    }
    if ( preg_match( '/^(link|url|href|cta|button_link|link_|.*_link)$/', $name ) ) {
        return NEXTWP_FIELD_LINK;
    }
    if ( preg_match( '/^(gallery|images|photos|slides)$/', $name ) ) {
        return NEXTWP_FIELD_GALLERY;
    }
    if ( preg_match( '/^(items|services|tabs|list)$/', $name ) ) {
        return NEXTWP_FIELD_REPEATER;
    }
    if ( preg_match( '/^(gm|map|config)$/', $name ) ) {
        return NEXTWP_FIELD_GROUP;
    }
    if ( preg_match( '/^(image|img|photo|picture|icon|thumb|avatar|logo)$/', $name ) ) {
        return NEXTWP_FIELD_IMAGE;
    }
    return NEXTWP_FIELD_TEXT;
}
