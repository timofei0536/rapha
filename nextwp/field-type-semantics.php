<?php
/**
 * NextWP — semantics: is value string link/image/gallery by values (used by field-types).
 * Requires value-parser.php.
 */

if ( ! defined( 'ABSPATH' ) ) {
    return;
}

/** Regex: value looks like URL (http, https, tel, mailto). */
define( 'NEXTWP_VALUE_URL_REGEX', '/^(?:https?:\/\/|tel:|mailto:)/' );

/** Regex: value looks like URL or path (includes leading /). */
define( 'NEXTWP_VALUE_URL_OR_PATH_REGEX', '/^(?:https?:\/\/|tel:|mailto:|\/)/' );

/**
 * Check if object has link semantics: key href or url (or src when value is not image path) with URL + at least one text.
 *
 * @param string $value_str Object value string.
 * @return bool
 */
function nextwp_object_value_is_link_by_values( $value_str ) {
    $pairs    = nextwp_parse_first_object_key_values( $value_str );
    $has_url  = false;
    $has_text = false;
    foreach ( $pairs as $p ) {
        $key     = isset( $p['name'] ) ? $p['name'] : '';
        $content = nextwp_get_quoted_string_content( $p['value'] );
        if ( $content === null || $content === '' ) {
            continue;
        }
        if ( ( $key === 'href' || $key === 'url' ) && preg_match( NEXTWP_VALUE_URL_REGEX, $content ) ) {
            $has_url = true;
        } elseif ( $key === 'src' && preg_match( NEXTWP_VALUE_URL_REGEX, $content ) && stripos( $content, 'image' ) === false ) {
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
    $pairs = nextwp_parse_first_object_key_values( $value_str );
    $out   = array();
    foreach ( $pairs as $p ) {
        $val = trim( $p['value'] );
        if ( strlen( $val ) < 2 ) {
            continue;
        }
        if ( $val[0] === '{' ) {
            $out = array_merge( $out, nextwp_collect_string_values_from_object( $val ) );
            continue;
        }
        $content = nextwp_get_quoted_string_content( $p['value'] );
        if ( $content !== null ) {
            $out[] = $content;
        }
    }
    return $out;
}

/**
 * Check if object has "single image" semantics: exactly one URL/path that contains "image" and one text; nesting allowed.
 *
 * @param string $value_str Object value string.
 * @return bool
 */
function nextwp_object_has_single_image_values_only( $value_str ) {
    $values = nextwp_collect_string_values_from_object( $value_str );
    $urls   = 0;
    $texts  = 0;
    foreach ( $values as $content ) {
        if ( $content === '' ) {
            continue;
        }
        if ( preg_match( NEXTWP_VALUE_URL_OR_PATH_REGEX, $content ) && stripos( $content, 'image' ) !== false ) {
            $urls++;
        } else {
            $texts++;
        }
    }
    return $urls === 1 && $texts === 1;
}

/**
 * Check if a single object has image semantics: key src with URL/path that contains "image" + text; no nested objects.
 *
 * @param string $value_str Object value string.
 * @return bool
 */
function nextwp_object_value_is_image_by_values( $value_str ) {
    $pairs = nextwp_parse_first_object_key_values( $value_str );
    if ( empty( $pairs ) ) {
        return false;
    }
    $has_src_image = false;
    $has_text      = false;
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
        if ( $key === 'src' && preg_match( NEXTWP_VALUE_URL_OR_PATH_REGEX, $content ) && stripos( $content, 'image' ) !== false ) {
            $has_src_image = true;
        } elseif ( $content !== '' ) {
            $has_text = true;
        }
    }
    return $has_src_image && $has_text;
}

/**
 * Extract all top-level object strings from array value.
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
 * Check if array is gallery by values: every element has single-image values only.
 *
 * @param string $value_str Array value string.
 * @return bool
 */
function nextwp_array_every_element_is_image_by_values( $value_str ) {
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
