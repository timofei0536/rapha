<?php
/**
 * NextWP — field types. Type inferred only by regex on the field VALUE.
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
 * Extract quoted string content from value snippet; handles escape. Returns null if not a quoted string.
 */
function nextwp_get_quoted_string_content( $val ) {
    $val = trim( $val );
    if ( strlen( $val ) < 2 ) {
        return null;
    }
    $first = $val[0];
    if ( $first !== '"' && $first !== "'" && $first !== '`' ) {
        return null;
    }
    $len_val = strlen( $val );
    for ( $i = 1; $i < $len_val; $i++ ) {
        if ( $val[ $i ] === '\\' ) {
            $i++;
            continue;
        }
        if ( $val[ $i ] === $first ) {
            return trim( substr( $val, 1, $i - 1 ) );
        }
    }
    return null;
}

/**
 * Check if object has link semantics: key href or url (or src when value is not image path) with URL + at least one text.
 *
 * @param string $value_str Object value string.
 * @return bool
 */
function nextwp_object_value_is_link_by_values( $value_str ) {
    if ( ! function_exists( 'nextwp_parse_first_object_key_values' ) ) {
        return false;
    }
    $pairs    = nextwp_parse_first_object_key_values( $value_str );
    $has_url  = false;
    $has_text = false;
    $url_re   = '/^(?:https?:\/\/|tel:|mailto:)/';
    foreach ( $pairs as $p ) {
        $key     = isset( $p['name'] ) ? $p['name'] : '';
        $content = nextwp_get_quoted_string_content( $p['value'] );
        if ( $content === null ) {
            continue;
        }
        if ( $content === '' ) {
            continue;
        }
        if ( ( $key === 'href' || $key === 'url' ) && preg_match( $url_re, $content ) ) {
            $has_url = true;
        } elseif ( $key === 'src' && preg_match( $url_re, $content ) && stripos( $content, 'image' ) === false ) {
            $has_url = true;
        } else {
            $has_text = true;
        }
    }
    return $has_url && $has_text;
}

/**
 * Collect all quoted string contents from object (recursively into nested objects).
 *
 * @param string $value_str Object value string.
 * @return array List of string contents (unquoted).
 */
function nextwp_collect_string_values_from_object( $value_str ) {
    if ( ! function_exists( 'nextwp_parse_first_object_key_values' ) ) {
        return array();
    }
    $pairs = nextwp_parse_first_object_key_values( $value_str );
    $out   = array();
    $url_re = '/^(?:https?:\/\/|tel:|mailto:|\/)/';
    foreach ( $pairs as $p ) {
        $val = trim( $p['value'] );
        if ( strlen( $val ) < 2 ) {
            continue;
        }
        if ( $val[0] === '{' ) {
            $merged = nextwp_collect_string_values_from_object( $val );
            $out = array_merge( $out, $merged );
            continue;
        }
        $first = $val[0];
        if ( $first === '"' || $first === "'" || $first === '`' ) {
            $len_val = strlen( $val );
            $end     = false;
            for ( $i = 1; $i < $len_val; $i++ ) {
                if ( $val[ $i ] === '\\' ) {
                    $i++;
                    continue;
                }
                if ( $val[ $i ] === $first ) {
                    $end = $i;
                    break;
                }
            }
            if ( $end !== false ) {
                $out[] = trim( substr( $val, 1, $end - 1 ) );
            }
        }
    }
    return $out;
}

/**
 * Check if object has "single image" semantics: exactly one URL/path that contains "image" (src semantics) and one text; nesting allowed.
 *
 * @param string $value_str Object value string.
 * @return bool
 */
function nextwp_object_has_single_image_values_only( $value_str ) {
    $values = nextwp_collect_string_values_from_object( $value_str );
    $url_re = '/^(?:https?:\/\/|tel:|mailto:|\/)/';
    $urls   = 0;
    $texts  = 0;
    foreach ( $values as $content ) {
        if ( $content === '' ) {
            continue;
        }
        if ( preg_match( $url_re, $content ) && stripos( $content, 'image' ) !== false ) {
            $urls++;
        } else {
            $texts++;
        }
    }
    return $urls === 1 && $texts === 1;
}

/**
 * Check if a single object has image semantics: key src with URL/path that contains "image" (e.g. /images/) + text; no nested objects.
 * Image uses src only; link uses href/url.
 *
 * @param string $value_str Object value string (e.g. { src: "/images/img.png", alt: "..." }).
 * @return bool
 */
function nextwp_object_value_is_image_by_values( $value_str ) {
    if ( ! function_exists( 'nextwp_parse_first_object_key_values' ) ) {
        return false;
    }
    $pairs = nextwp_parse_first_object_key_values( $value_str );
    if ( empty( $pairs ) ) {
        return false;
    }
    $has_src_image = false;
    $has_text      = false;
    $url_re        = '/^(?:https?:\/\/|tel:|mailto:|\/)/';
    foreach ( $pairs as $p ) {
        $val = trim( $p['value'] );
        if ( strlen( $val ) < 2 ) {
            continue;
        }
        if ( $val[0] === '{' ) {
            return false;
        }
        $key     = isset( $p['name'] ) ? $p['name'] : '';
        $content = nextwp_get_quoted_string_content( $p['value'] );
        if ( $content === null ) {
            continue;
        }
        if ( $key === 'src' && preg_match( $url_re, $content ) && stripos( $content, 'image' ) !== false ) {
            $has_src_image = true;
        } elseif ( $content !== '' ) {
            $has_text = true;
        }
    }
    return $has_src_image && $has_text;
}

/**
 * Extract all top-level object strings from array value (e.g. "[ { a }, { b } ]" -> ["{ a }", "{ b }"]).
 *
 * @param string $value_str Array value string.
 * @return array List of object strings.
 */
function nextwp_array_get_elements( $value_str ) {
    $v = trim( $value_str );
    if ( ! preg_match( '/^\s*\[\s*(.*)\s*\]\s*$/s', $v, $m ) ) {
        return array();
    }
    $inner = trim( $m[1] );
    if ( $inner === '' ) {
        return array();
    }
    $len    = strlen( $inner );
    $out    = array();
    $i      = 0;
    $depth  = 0;
    $in_str = false;
    $str_ch = '';
    $start  = null;
    while ( $i < $len ) {
        $c = $inner[ $i ];
        if ( $in_str ) {
            if ( $c === '\\' ) {
                $i += 2;
                continue;
            }
            if ( $c === $str_ch ) {
                $in_str = false;
            }
            $i++;
            continue;
        }
        if ( $c === '"' || $c === "'" || $c === '`' ) {
            $in_str = true;
            $str_ch = $c;
            $i++;
            continue;
        }
        if ( $c === '{' ) {
            if ( $depth === 0 ) {
                $start = $i;
            }
            $depth++;
            $i++;
            continue;
        }
        if ( $c === '}' ) {
            $depth--;
            if ( $depth === 0 && $start !== null ) {
                $out[] = trim( substr( $inner, $start, $i - $start + 1 ) );
                $start = null;
            }
            $i++;
            continue;
        }
        $i++;
    }
    return $out;
}

/**
 * Check if array is gallery by values: every element has single-image values only (one URL/path, one text; nesting allowed).
 *
 * @param string $value_str Array value string (e.g. [ { src: "...", alt: "..." } ] or [ { image: { src, alt } } ]).
 * @return bool
 */
function nextwp_array_every_element_is_image_by_values( $value_str ) {
    if ( ! function_exists( 'nextwp_object_has_single_image_values_only' ) ) {
        return false;
    }
    $elements = nextwp_array_get_elements( $value_str );
    if ( empty( $elements ) ) {
        return false;
    }
    foreach ( $elements as $el ) {
        if ( ! nextwp_object_has_single_image_values_only( $el ) ) {
            return false;
        }
    }
    return true;
}

/**
 * Infer field type only by regex on the value string.
 * Optional file_content + prop_name: for content type require ancestor with .content.
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
        if ( preg_match( '/<\s*(?:p|ul|ol|li|div|span|br|h[1-6]|b\b|strong|a\s)/s', $v ) ) {
            if ( $file_content !== null && $prop_name !== null && nextwp_prop_has_content_ancestor( $prop_name, $file_content ) ) {
                return NEXTWP_FIELD_CONTENT;
            }
            return NEXTWP_FIELD_TEXT;
        }
        if ( preg_match( '/^(?:https?:\/\/|tel:|mailto:)/', trim( $v, '"\'`' ) ) ) {
            return NEXTWP_FIELD_HREF;
        }
    }

    return NEXTWP_FIELD_TEXT;
}
