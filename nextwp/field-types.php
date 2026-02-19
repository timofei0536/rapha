<?php
/**
 * NextWP — field type constants, ACF mapping, and type inference.
 * Requires: value-parser.php, field-type-semantics.php.
 *
 * Types by values only (key names do not affect type):
 *
 * | type     | definition |
 * |----------|------------|
 * | text     | текст, с возможными тегами/символами переноса строк |
 * | content  | text у которого предок с классом .content (до 3 предков) |
 * | image    | V1: одна строка — src (путь/расширение изображения). V2: obj — src + alt по значениям |
 * | href     | обычная ссылка — одна строка URL (http/tel/mailto, не изображение) |
 * | link     | объект по значениям: url + text, возможно target |
 * | gallery  | repeater, в котором каждый элемент по значениям — только изображение |
 * | repeater | массив повторяющихся ключей |
 *
 * src = путь (/) или ресурс с расширением изображения. url = ссылка, не изображение.
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

/** Max ancestor levels to look for .content (improves performance). */
define( 'NEXTWP_CONTENT_ANCESTOR_LIMIT', 3 );

/**
 * Check if prop usage in file has an ancestor (or same tag) with class .content in JSX.
 * Uses a tag stack so only real DOM ancestors are considered (not previous siblings).
 *
 * @param string $prop_name    Prop name to find in file.
 * @param string $file_content File content.
 * @return bool
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
    $len      = strlen( $file_content );
    $stack    = array();
    $offset   = 0;
    $limit    = defined( 'NEXTWP_CONTENT_ANCESTOR_LIMIT' ) ? NEXTWP_CONTENT_ANCESTOR_LIMIT : 10;

    while ( $offset < $prop_pos && $offset < $len ) {
        $tag_start = strpos( $file_content, '<', $offset );
        if ( $tag_start === false || $tag_start >= $prop_pos ) {
            break;
        }
        $next = $tag_start + 1;
        if ( $next >= $len ) {
            break;
        }
        if ( $file_content[ $next ] === '/' ) {
            array_pop( $stack );
            $close_angle = strpos( $file_content, '>', $next );
            $offset      = $close_angle !== false ? $close_angle + 1 : $len;
            continue;
        }
        $after_lt = substr( $file_content, $tag_start + 1 );
        $rel_end  = nextwp_find_tag_end( $after_lt, 0 );
        if ( $rel_end < 0 ) {
            $offset = $next;
            continue;
        }
        $tag_str   = substr( $file_content, $tag_start, $rel_end + 2 );
        $tag_end   = $tag_start + $rel_end + 2;
        if ( $tag_start < $prop_pos && $prop_pos < $tag_end ) {
            if ( preg_match( '/(?:class|className)\s*=\s*["\'][^"\']*\bcontent\b/', $tag_str ) ) {
                return true;
            }
        }
        $self_close = ( substr( rtrim( $tag_str ), -2 ) === '/>' );
        if ( ! $self_close ) {
            $has_content = (bool) preg_match( '/(?:class|className)\s*=\s*["\'][^"\']*\bcontent\b/', $tag_str );
            $stack[]    = $has_content;
        }
        $offset = $tag_end;
    }

    $to_check = array_slice( $stack, -$limit );
    foreach ( $to_check as $has_content ) {
        if ( $has_content ) {
            return true;
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
 * Single order: content → array → object → string → text. Types by values only.
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

    // 1) content: if prop has .content ancestor — always content (any value shape).
    if ( $file_content !== null && $prop_name !== null && nextwp_prop_has_content_ancestor( $prop_name, $file_content ) ) {
        return NEXTWP_FIELD_CONTENT;
    }

    // 2) array: gallery or repeater (by values only).
    if ( preg_match( '/^\s*\[\s*\{/s', $v ) ) {
        if ( nextwp_array_every_element_is_image_by_values( $v ) ) {
            return NEXTWP_FIELD_GALLERY;
        }
        return NEXTWP_FIELD_REPEATER;
    }

    // 3) object: image, link, or group (by values only).
    if ( preg_match( '/^\s*\{/s', $v ) ) {
        if ( nextwp_object_value_is_image_by_values( $v ) ) {
            return NEXTWP_FIELD_IMAGE;
        }
        if ( nextwp_object_value_is_link_by_values( $v ) ) {
            return NEXTWP_FIELD_LINK;
        }
        return NEXTWP_FIELD_GROUP;
    }

    // 4) string: url (link), image (single src), or text.
    if ( preg_match( '/^[\'"`]/', $v ) ) {
        $inner = trim( $v, '"\'`' );
        if ( nextwp_value_is_link_url( $inner ) ) {
            return NEXTWP_FIELD_HREF;
        }
        if ( nextwp_value_is_image_src( $inner ) ) {
            return NEXTWP_FIELD_IMAGE;
        }
        return NEXTWP_FIELD_TEXT;
    }

    return NEXTWP_FIELD_TEXT;
}
