<?php
/**
 * NextWP — ACF fields from component props. key = prop name, type from regex (field-types.php).
 * Supports repeater and gallery. No component names, no predefined schema.
 */

if ( ! defined( 'ABSPATH' ) ) {
    return;
}

/**
 * Parse component file: extract prop names from default export function ({ prop1, prop2 = X }).
 *
 * @param string $file_path Full path to component file.
 * @return array List of prop names.
 */
function nextwp_parse_props_from_file( $file_path ) {
    if ( ! $file_path || ! is_readable( $file_path ) ) {
        return array();
    }
    $content = file_get_contents( $file_path );
    if ( preg_match( '/export\s+default\s+function\s+\w+\s*\(\s*\{\s*([^}]+)\s\}\s*\)/s', $content, $m ) ) {
        $inner = trim( $m[1] );
        $names = array();
        foreach ( preg_split( '/\s*,\s*/', $inner ) as $part ) {
            $part = trim( $part );
            if ( $part === '' || $part === '...' ) {
                continue;
            }
            if ( preg_match( '/^(\w+)(?:\s*[:=]|$)/', $part, $prop ) ) {
                $names[] = $prop[1];
            }
        }
        return $names;
    }
    return array();
}

/**
 * Extract default value string for a prop from file (DEFAULT_PROPNAME = value).
 *
 * @param string $file_path Full path to component file.
 * @param string $prop_name Prop name (e.g. items, image).
 * @return string|null Value string or null.
 */
function nextwp_get_prop_default_value_from_file( $file_path, $prop_name ) {
    if ( ! $file_path || ! is_readable( $file_path ) ) {
        return null;
    }
    $content = file_get_contents( $file_path );
    $upper = strtoupper( preg_replace( '/[^a-z0-9]/i', '_', $prop_name ) );
    $const = 'DEFAULT_' . $upper;
    if ( ! preg_match( '/\b' . preg_quote( $const, '/' ) . '\s*=\s*/', $content, $m, PREG_OFFSET_CAPTURE ) ) {
        return null;
    }
    $start = $m[0][1] + strlen( $m[0][0] );
    $rest = substr( $content, $start );
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
    if ( $first === '[' ) {
        $depth = 0;
        $len = strlen( $rest );
        for ( $i = 0; $i < $len; $i++ ) {
            $c = $rest[ $i ];
            if ( ( $c === '"' || $c === "'" || $c === '`' ) && ( $i === 0 || $rest[ $i - 1 ] !== '\\' ) ) {
                $close = $c;
                $j = $i + 1;
                while ( $j < $len ) {
                    if ( $rest[ $j ] === '\\' ) { $j += 2; continue; }
                    if ( $rest[ $j ] === $close ) { $i = $j; break; }
                    $j++;
                }
                continue;
            }
            if ( $c === '[' ) { $depth++; continue; }
            if ( $c === ']' ) { $depth--; if ( $depth === 0 ) return substr( $rest, 0, $i + 1 ); }
        }
        return null;
    }
    if ( $first === '{' ) {
        $depth = 0;
        $len = strlen( $rest );
        for ( $i = 0; $i < $len; $i++ ) {
            $c = $rest[ $i ];
            if ( ( $c === '"' || $c === "'" || $c === '`' ) && ( $i === 0 || $rest[ $i - 1 ] !== '\\' ) ) {
                $close = $c;
                $j = $i + 1;
                while ( $j < $len ) {
                    if ( $rest[ $j ] === '\\' ) { $j += 2; continue; }
                    if ( $rest[ $j ] === $close ) { $i = $j; break; }
                    $j++;
                }
                continue;
            }
            if ( $c === '{' ) { $depth++; continue; }
            if ( $c === '}' ) { $depth--; if ( $depth === 0 ) return substr( $rest, 0, $i + 1 ); }
        }
        return null;
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
        $depth = 0;
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
 * Parse first object from value: get [ name => value_snippet ] for repeater/group sub_fields.
 * Key boundaries only at top level (commas inside quotes or nested {} are ignored).
 *
 * @param string $value_str Value from nextwp_get_prop_default_value_from_file.
 * @return array [ [ 'name' => key, 'value' => value_snippet ], ... ].
 */
function nextwp_parse_first_object_key_values( $value_str ) {
    $inner = nextwp_extract_first_object_inner( $value_str );
    if ( $inner === null ) {
        return array();
    }
    $len = strlen( $inner );
    $entries = array();
    $in_str = false;
    $str_char = '';
    $depth = 0;
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
        if ( $c === '{' ) { $depth++; $i++; continue; }
        if ( $c === '}' ) { $depth--; $i++; continue; }
        if ( $depth !== 0 ) { $i++; continue; }
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

/**
 * Build field definitions from component props. Type only from value (regex on default value), not from prop name.
 *
 * @param string $component_name Component name.
 * @param string $project_path  Project root path.
 * @return array List of [ 'name' => ..., 'type' => ..., 'sub_fields' => ... (optional) ].
 */
function nextwp_get_schema_for_component( $component_name, $project_path ) {
    if ( ! function_exists( 'nextwp_get_component_file_path' ) ) {
        return array();
    }
    $file_path = nextwp_get_component_file_path( $project_path, $component_name );
    if ( ! $file_path ) {
        return array();
    }
    $prop_names = nextwp_parse_props_from_file( $file_path );
    if ( empty( $prop_names ) ) {
        return array();
    }
    $file_content = file_get_contents( $file_path );
    $file_content = $file_content !== false ? $file_content : '';
    $defs = array();
    foreach ( $prop_names as $name ) {
        $value_str = nextwp_get_prop_default_value_from_file( $file_path, $name );
        $type = nextwp_infer_field_type_from_value( $value_str, $file_content, $name );
        $def = array( 'name' => $name, 'type' => $type );
        if ( in_array( $type, array( 'repeater', 'group' ), true ) ) {
            $key_vals = nextwp_parse_first_object_key_values( $value_str );
            if ( ! empty( $key_vals ) ) {
                $def['sub_fields'] = array();
                foreach ( $key_vals as $kv ) {
                    $sub_val = isset( $kv['value'] ) ? $kv['value'] : '';
                    $def['sub_fields'][] = array(
                        'name'  => $kv['name'],
                        'type'  => nextwp_infer_field_type_from_value( $sub_val ),
                    );
                }
            } else {
                $def['sub_fields'] = array(
                    array( 'name' => 'title', 'type' => 'text' ),
                    array( 'name' => 'content', 'type' => 'text' ),
                );
            }
        }
        $defs[] = $def;
    }
    return $defs;
}

/**
 * Build ACF fields from component props (key = prop name, type from regex).
 *
 * @param string $component_name Component name.
 * @param string $group_key      ACF group key.
 * @param string $project_path  Project root path.
 * @return array ACF fields for acf_import_field_group.
 */
function nextwp_build_acf_fields_from_schema( $component_name, $group_key, $project_path ) {
    $fields_def = nextwp_get_schema_for_component( $component_name, $project_path );
    if ( empty( $fields_def ) ) {
        return array();
    }
    return nextwp_build_acf_fields_recursive( $fields_def, $group_key, 0 );
}

/**
 * Recursive build of ACF field arrays (handles group + repeater).
 *
 * @param array  $defs       Array of [ name, type, sub_fields? ].
 * @param string $parent_key Parent field key or group key.
 * @param int    $depth      Depth for unique keys.
 * @return array ACF fields.
 */
function nextwp_build_acf_fields_recursive( $defs, $parent_key, $depth = 0 ) {
    $fields = array();
    foreach ( $defs as $i => $def ) {
        $name = isset( $def['name'] ) ? $def['name'] : 'field_' . $i;
        $type = isset( $def['type'] ) ? $def['type'] : nextwp_infer_field_type_from_value( '' );
        $acf_type = nextwp_field_type_to_acf( $type );
        $key = 'field_' . md5( $parent_key . '_' . $name . '_' . $depth );

        $label = preg_replace( '/([a-z])([A-Z])/', '$1 $2', $name );
        $label = str_replace( array( '_', '-' ), ' ', $label );
        $label = ucwords( strtolower( trim( $label ) ) );

        $field = array(
            'key'   => $key,
            'label' => $label,
            'name'  => $name,
            'type'  => $acf_type,
        );

        if ( $acf_type === 'link' ) {
            $field['return_format'] = 'array';
        }
        if ( $acf_type === 'image' ) {
            $field['return_format'] = 'array';
            $field['preview_size']  = 'medium';
        }
        if ( $acf_type === 'gallery' ) {
            $field['return_format'] = 'array';
            $field['preview_size']  = 'medium';
        }

        if ( in_array( $acf_type, array( 'repeater', 'group' ), true ) && ! empty( $def['sub_fields'] ) ) {
            $field['sub_fields'] = nextwp_build_acf_fields_recursive( $def['sub_fields'], $key, $depth + 1 );
        }

        $fields[] = $field;
    }

    return $fields;
}
