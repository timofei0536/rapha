<?php
/**
 * NextWP — semantics: link/image/gallery by values only (no key names).
 * Requires value-parser.php.
 *
 * src = path or image resource (path starting with /, or image extension, or URL to image).
 * url = link (http/tel/mailto) that is not an image resource.
 */

if ( ! defined( 'ABSPATH' ) ) {
    return;
}

/** Regex: value looks like URL (http, https, tel, mailto). */
define( 'NEXTWP_VALUE_URL_REGEX', '/^(?:https?:\/\/|tel:|mailto:)/' );

/** Regex: value looks like URL or path (includes leading /). */
define( 'NEXTWP_VALUE_URL_OR_PATH_REGEX', '/^(?:https?:\/\/|tel:|mailto:|\/)/' );

/** Regex: path/URL has image file extension. */
define( 'NEXTWP_VALUE_IMAGE_EXT_REGEX', '/\.(png|jpe?g|gif|webp|svg|ico)(\?|$)/i' );

/**
 * Value is image src: path (starts with /), or has image extension, or full URL pointing to image.
 *
 * @param string $content Single string value (unquoted).
 * @return bool
 */
function nextwp_value_is_image_src( $content ) {
    if ( $content === '' ) {
        return false;
    }
    $c = trim( $content );
    if ( preg_match( '/^\//', $c ) ) {
        return true;
    }
    if ( preg_match( NEXTWP_VALUE_IMAGE_EXT_REGEX, $c ) ) {
        return true;
    }
    if ( preg_match( NEXTWP_VALUE_URL_REGEX, $c ) && ( preg_match( NEXTWP_VALUE_IMAGE_EXT_REGEX, $c ) || strpos( $c, '/images/' ) !== false ) ) {
        return true;
    }
    return false;
}

/**
 * Value is link url: http/tel/mailto and not an image resource.
 *
 * @param string $content Single string value (unquoted).
 * @return bool
 */
function nextwp_value_is_link_url( $content ) {
    if ( $content === '' ) {
        return false;
    }
    $c = trim( $content );
    if ( ! preg_match( NEXTWP_VALUE_URL_REGEX, $c ) ) {
        return false;
    }
    return ! nextwp_value_is_image_src( $c );
}

/**
 * Object has link semantics by values only: at least one link URL + at least one text.
 *
 * @param string $value_str Object value string.
 * @return bool
 */
function nextwp_object_value_is_link_by_values( $value_str ) {
    $values = nextwp_collect_string_values_from_object( $value_str );
    $has_link_url = false;
    $has_text     = false;
    foreach ( $values as $content ) {
        if ( $content === '' ) {
            continue;
        }
        if ( nextwp_value_is_link_url( $content ) ) {
            $has_link_url = true;
        } elseif ( ! nextwp_value_is_image_src( $content ) && ! preg_match( NEXTWP_VALUE_URL_REGEX, $content ) ) {
            $has_text = true;
        }
    }
    return $has_link_url && $has_text;
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
 * Object has "single image" semantics by values only: exactly one image src + one text; nesting allowed.
 *
 * @param string $value_str Object value string.
 * @return bool
 */
function nextwp_object_has_single_image_values_only( $value_str ) {
    $values = nextwp_collect_string_values_from_object( $value_str );
    $src_count = 0;
    $text_count = 0;
    foreach ( $values as $content ) {
        if ( $content === '' ) {
            continue;
        }
        if ( nextwp_value_is_image_src( $content ) ) {
            $src_count++;
        } else {
            $text_count++;
        }
    }
    return $src_count === 1 && $text_count === 1;
}

/**
 * Object has image semantics by values only: exactly one image src + one text; nesting allowed.
 *
 * @param string $value_str Object value string.
 * @return bool
 */
function nextwp_object_value_is_image_by_values( $value_str ) {
    return nextwp_object_has_single_image_values_only( $value_str );
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
    $len = strlen( $inner );
    $out = array();
    $i   = 0;
    while ( $i < $len ) {
        if ( $inner[ $i ] === '{' ) {
            $close = nextwp_find_balanced_brace_close( $inner, $i, '{', '}' );
            if ( $close !== false ) {
                $out[] = trim( substr( $inner, $i, $close - $i + 1 ) );
                $i     = $close + 1;
                continue;
            }
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
