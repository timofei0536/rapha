<?php
/**
 * NextWP — ACF fields from component props. key = prop name, type from regex (field-types.php).
 * Supports repeater and gallery. Requires: value-parser.php, field-types.php.
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
 * @param string      $file_path   Full path to component file.
 * @param string      $prop_name   Prop name (e.g. items, image).
 * @param string|null $file_content Optional. If provided, search in this string instead of reading file.
 * @return string|null Value string or null.
 */
function nextwp_get_prop_default_value_from_file( $file_path, $prop_name, $file_content = null ) {
    if ( $file_content === null ) {
        if ( ! $file_path || ! is_readable( $file_path ) ) {
            return null;
        }
        $file_content = file_get_contents( $file_path );
    }
    if ( $file_content === false || $file_content === '' ) {
        return null;
    }
    $upper = strtoupper( preg_replace( '/[^a-z0-9]/i', '_', $prop_name ) );
    $const = 'DEFAULT_' . $upper;
    if ( ! preg_match( '/\b' . preg_quote( $const, '/' ) . '\s*=\s*/', $file_content, $m, PREG_OFFSET_CAPTURE ) ) {
        return null;
    }
    $rest = substr( $file_content, $m[0][1] + strlen( $m[0][0] ) );
    return nextwp_extract_one_value( $rest );
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
    $defs         = array();
    foreach ( $prop_names as $name ) {
        $value_str = nextwp_get_prop_default_value_from_file( $file_path, $name, $file_content );
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

        $field = array_merge(
            array(
                'key'   => $key,
                'label' => $label,
                'name'  => $name,
                'type'  => $acf_type,
            ),
            nextwp_acf_field_options_for_type( $type )
        );

        if ( in_array( $acf_type, array( 'repeater', 'group' ), true ) && ! empty( $def['sub_fields'] ) ) {
            $field['sub_fields'] = nextwp_build_acf_fields_recursive( $def['sub_fields'], $key, $depth + 1 );
        }

        $fields[] = $field;
    }

    return $fields;
}
