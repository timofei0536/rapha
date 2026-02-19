<?php
/**
 * NextWP — parse JS/default value strings (quoted strings, objects, key-value pairs).
 * Used by field-types and component-schema.
 */

if ( ! defined( 'ABSPATH' ) ) {
    return;
}

/**
 * Extract quoted string content from value snippet; handles escape. Returns null if not a quoted string.
 *
 * @param string $val Value snippet (e.g. "\"foo\"", '"bar"').
 * @return string|null Unquoted content or null.
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
 * Extract first object from array value (balance braces) or return object content if single object.
 *
 * @param string $value_str Full value string.
 * @return string|null Inner content of first object (keys and values).
 */
function nextwp_extract_first_object_inner( $value_str ) {
    if ( $value_str === null || $value_str === '' ) {
        return null;
    }
    $v = trim( $value_str );
    if ( preg_match( '/^\s*\{\s*(.*)\s\}\s*$/s', $v, $m ) ) {
        return $m[1];
    }
    if ( preg_match( '/^\s*\[\s*/', $v ) ) {
        $start = strpos( $v, '{' );
        if ( $start === false ) {
            return null;
        }
        $depth  = 0;
        $in_str = false;
        $str_char = '';
        $len = strlen( $v );
        for ( $i = $start; $i < $len; $i++ ) {
            $c = $v[ $i ];
            if ( ! $in_str ) {
                if ( $c === '{' ) { $depth++; continue; }
                if ( $c === '}' ) { $depth--; if ( $depth === 0 ) return trim( substr( $v, $start + 1, $i - $start - 1 ) ); }
                if ( $c === '"' || $c === "'" || $c === '`' ) { $in_str = true; $str_char = $c; }
                continue;
            }
            if ( $c === '\\' ) { $i++; continue; }
            if ( $c === $str_char ) { $in_str = false; }
        }
    }
    return null;
}

/**
 * Find position of matching closing brace, respecting quoted strings and escape.
 *
 * @param string $str       Full string.
 * @param int    $open_pos  Position of opening brace (e.g. '{' or '[').
 * @param string $open_char Opening character.
 * @param string $close_char Closing character.
 * @return int|false Index of closing character or false.
 */
function nextwp_find_balanced_brace_close( $str, $open_pos, $open_char, $close_char ) {
    $len = strlen( $str );
    if ( $open_pos < 0 || $open_pos >= $len || $str[ $open_pos ] !== $open_char ) {
        return false;
    }
    $depth = 0;
    $i     = $open_pos;
    while ( $i < $len ) {
        $c = $str[ $i ];
        if ( ( $c === '"' || $c === "'" || $c === '`' ) && ( $i === 0 || $str[ $i - 1 ] !== '\\' ) ) {
            $q = $c;
            $j = $i + 1;
            while ( $j < $len ) {
                if ( $str[ $j ] === '\\' ) {
                    $j += 2;
                    continue;
                }
                if ( $str[ $j ] === $q ) {
                    $i = $j;
                    break;
                }
                $j++;
            }
            $i++;
            continue;
        }
        if ( $c === $open_char ) {
            $depth++;
            $i++;
            continue;
        }
        if ( $c === $close_char ) {
            $depth--;
            if ( $depth === 0 ) {
                return $i;
            }
            $i++;
            continue;
        }
        $i++;
    }
    return false;
}

/**
 * Extract one value from string: quoted string, or balanced [...] or {...]. Respects strings and escape.
 *
 * @param string $rest String starting with ", ', `, [ or {.
 * @return string|null Extracted value including delimiters, or null.
 */
function nextwp_extract_one_value( $rest ) {
    if ( $rest === '' ) {
        return null;
    }
    $rest = ltrim( $rest );
    if ( $rest === '' ) {
        return null;
    }
    $first = $rest[0];
    if ( $first === '"' || $first === "'" ) {
        $end = strpos( $rest, $first, 1 );
        while ( $end !== false && $end > 0 && $rest[ $end - 1 ] === '\\' ) {
            $end = strpos( $rest, $first, $end + 1 );
        }
        return $end !== false ? substr( $rest, 0, $end + 1 ) : null;
    }
    if ( $first === '`' ) {
        $end = strpos( $rest, '`', 1 );
        return $end !== false ? substr( $rest, 0, $end + 1 ) : null;
    }
    if ( $first === '[' || $first === '{' ) {
        $close_char = $first === '[' ? ']' : '}';
        $close_pos  = nextwp_find_balanced_brace_close( $rest, 0, $first, $close_char );
        return $close_pos !== false ? substr( $rest, 0, $close_pos + 1 ) : null;
    }
    return null;
}

/**
 * Parse first object from value: get [ name => value_snippet ] for repeater/group sub_fields.
 * Key boundaries only at top level (commas inside quotes or nested {} [] are ignored).
 *
 * @param string $value_str Value from nextwp_get_prop_default_value_from_file.
 * @return array [ [ 'name' => key, 'value' => value_snippet ], ... ].
 */
function nextwp_parse_first_object_key_values( $value_str ) {
    $inner = nextwp_extract_first_object_inner( $value_str );
    if ( $inner === null ) {
        return array();
    }
    $len    = strlen( $inner );
    $entries = array();
    $in_str = false;
    $str_char = '';
    $brace_depth   = 0;
    $bracket_depth = 0;
    $i = 0;
    while ( $i < $len ) {
        $c = $inner[ $i ];
        if ( $in_str ) {
            if ( $c === '\\' ) { $i += 2; continue; }
            if ( $c === $str_char ) { $in_str = false; $i++; continue; }
            $i++;
            continue;
        }
        if ( $c === '"' || $c === "'" || $c === '`' ) {
            $in_str = true;
            $str_char = $c;
            $i++;
            continue;
        }
        if ( $c === '{' ) {
            $brace_depth++;
            $i++;
            continue;
        }
        if ( $c === '}' ) {
            $brace_depth--;
            $i++;
            continue;
        }
        if ( $c === '[' ) {
            $bracket_depth++;
            $i++;
            continue;
        }
        if ( $c === ']' ) {
            $bracket_depth--;
            $i++;
            continue;
        }
        if ( $brace_depth !== 0 || $bracket_depth !== 0 ) { $i++; continue; }
        if ( $c === ',' || $i === 0 ) {
            $comma_pos = ( $c === ',' ) ? $i : -1;
            $start = $c === ',' ? $i + 1 : $i;
            $rest = ltrim( substr( $inner, $start ), " \t\n\r" );
            if ( preg_match( '/^(\w+)\s*:\s*/', $rest, $m ) ) {
                $val_start = $start + strlen( substr( $inner, $start ) ) - strlen( $rest ) + strlen( $m[0] );
                $entries[] = array( 'name' => $m[1], 'val_start' => $val_start, 'comma_next' => $comma_pos );
            }
            if ( $c === ',' ) {
                $i++;
                continue;
            }
        }
        $i++;
    }
    $out = array();
    for ( $j = 0; $j < count( $entries ); $j++ ) {
        $val_start = $entries[ $j ]['val_start'];
        $val_end = isset( $entries[ $j + 1 ] ) && $entries[ $j + 1 ]['comma_next'] >= 0
            ? $entries[ $j + 1 ]['comma_next']
            : $len;
        $val_snippet = trim( substr( $inner, $val_start, $val_end - $val_start ) );
        $out[] = array( 'name' => $entries[ $j ]['name'], 'value' => $val_snippet );
    }
    return $out;
}
