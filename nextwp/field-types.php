<?php
/**
 * NextWP — field type constants, ACF mapping, and type inference.
 * Requires: value-parser.php, field-type-semantics.php.
 *
 * | type     | definition |
 * |----------|------------|
 * | text     | текст, с возможными тегами/символами переноса строк |
 * | content  | html с предком у которого есть .content |
 * | image    | объект: ключ src с путём, содержащим "image" (напр. /images/) + текст; без вложений |
 * | href     | обычная ссылка (строка URL или объект с полем href) |
 * | link     | объект: ключ href/url (или src не-картинка) с URL + текст |
 * | gallery  | массив, каждый элемент по значениям = image |
 * | repeater | массив повторяющихся объектов (одинаковые ключи) |
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

/**
 * Check if prop usage in file has an ancestor (or same tag) with class .content in JSX.
 */
function nextwp_prop_has_content_ancestor( $prop_name, $file_content ) {
    if ( $file_content === '' || $prop_name === '' ) {
        return false;
    }
    $esc = preg_quote( $prop_name, '/' );
    if ( ! preg_match( '/(?:__html:\s*|>\s*\{\s*)' . $esc . '\b/', $file_content, $m, PREG_OFFSET_CAPTURE ) ) {
        return false;
    }
    $prop_pos = $m[0][1];
    $pos = $prop_pos;
    while ( true ) {
        $before = substr( $file_content, 0, $pos );
        $tag_start = strrpos( $before, '<' );
        if ( $tag_start === false ) {
            return false;
        }
        if ( $tag_start + 1 < strlen( $file_content ) && $file_content[ $tag_start + 1 ] === '/' ) {
            $pos = $tag_start - 1;
            continue;
        }
        $after_lt = substr( $file_content, $tag_start + 1 );
        $rel_end = nextwp_find_tag_end( $after_lt, 0 );
        if ( $rel_end < 0 ) {
            return false;
        }
        $tag_str = substr( $file_content, $tag_start, $rel_end + 2 );
        if ( preg_match( '/(?:class|className)\s*=\s*["\'][^"\']*\bcontent\b/', $tag_str ) ) {
            return true;
        }
        $pos = $tag_start - 1;
        if ( $pos < 0 ) {
            return false;
        }
    }
    return false;
}

/**
 * Find end of opening tag (position of '>') skipping inside quoted strings.
 */
function nextwp_find_tag_end( $s, $start = 0 ) {
    $len = strlen( $s );
    $in_double = false;
    $in_single = false;
    for ( $j = $start; $j < $len; $j++ ) {
        $c = $s[ $j ];
        if ( $c === '"' && ! $in_single ) {
            $in_double = ! $in_double;
        } elseif ( $c === "'" && ! $in_double ) {
            $in_single = ! $in_single;
        } elseif ( ( $c === '>' || $c === '/' ) && ! $in_double && ! $in_single ) {
            if ( $c === '>' ) {
                return $j;
            }
        }
    }
    return -1;
}

/**
 * Infer field type from value string (and optional file_content + prop_name for content).
 *
 * @param string      $value_str   Raw default value from file.
 * @param string|null $file_content Optional, for content: check .content ancestor.
 * @param string|null $prop_name   Optional, for content: which prop to look up.
 * @return string content|image|gallery|href|link|repeater|group|text
 */
function nextwp_infer_field_type_from_value( $value_str, $file_content = null, $prop_name = null ) {
    if ( $value_str === null || $value_str === '' ) {
        return NEXTWP_FIELD_TEXT;
    }
    $v = trim( $value_str );

    if ( preg_match( '/^\s*\[\s*\{/s', $v ) ) {
        if ( nextwp_array_every_element_is_image_by_values( $v ) ) {
            return NEXTWP_FIELD_GALLERY;
        }
        return NEXTWP_FIELD_REPEATER;
    }

    if ( preg_match( '/^\s*\{/s', $v ) ) {
        if ( nextwp_object_value_is_image_by_values( $v ) ) {
            return NEXTWP_FIELD_IMAGE;
        }
        if ( nextwp_object_value_is_link_by_values( $v ) ) {
            return NEXTWP_FIELD_LINK;
        }
        if ( preg_match( '/\b(?:href|url|src)\s*:/s', $v ) ) {
            return NEXTWP_FIELD_HREF;
        }
        return NEXTWP_FIELD_GROUP;
    }

    if ( preg_match( '/^[\'"`]/', $v ) ) {
        if ( $file_content !== null && $prop_name !== null && nextwp_prop_has_content_ancestor( $prop_name, $file_content ) ) {
            return NEXTWP_FIELD_CONTENT;
        }
        if ( preg_match( '/<\s*(?:p|ul|ol|li|div|span|br|h[1-6]|b\b|strong|a\s)/s', $v ) ) {
            return NEXTWP_FIELD_TEXT;
        }
        if ( preg_match( NEXTWP_VALUE_URL_REGEX, trim( $v, '"\'`' ) ) ) {
            return NEXTWP_FIELD_HREF;
        }
    }

    return NEXTWP_FIELD_TEXT;
}
