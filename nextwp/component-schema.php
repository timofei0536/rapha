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
 * Parse file for repeater/group default value: get keys from first object in array or from single object.
 *
 * @param string $file_path Full path to component file.
 * @param string $prop_name Prop name (e.g. items, gm).
 * @return array List of sub field names (keys).
 */
function nextwp_parse_sub_field_keys_from_file( $file_path, $prop_name ) {
    if ( ! $file_path || ! is_readable( $file_path ) ) {
        return array();
    }
    $content = file_get_contents( $file_path );
    $upper = strtoupper( $prop_name );
    $variants = array( 'DEFAULT_' . $upper, 'DEFAULT_' . strtoupper( preg_replace( '/[^a-z0-9]/i', '_', $prop_name ) ) );
    foreach ( $variants as $const ) {
        if ( preg_match( '/\b' . preg_quote( $const, '/' ) . '\s*=\s*\[\s*\{\s*([^}]+)\s\}\s*\]/s', $content, $m ) ) {
            $inner = $m[1];
        } elseif ( preg_match( '/\b' . preg_quote( $const, '/' ) . '\s*=\s*\{\s*([^}]+)\s\}\s*[;\s]/s', $content, $m ) ) {
            $inner = $m[1];
        } else {
            continue;
        }
        $keys = array();
        if ( preg_match_all( '/\b(\w+)\s*[:=]/', $inner, $key_m ) ) {
            $keys = $key_m[1];
        }
        return $keys;
    }
    return array();
}

/**
 * Build field definitions from component props (name = key, type from regex). Repeater/group get sub_fields from parsed default.
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
    $defs = array();
    foreach ( $prop_names as $name ) {
        $type = nextwp_infer_field_type( $name );
        $def = array( 'name' => $name, 'type' => $type );
        if ( in_array( $type, array( 'repeater', 'group' ), true ) ) {
            $sub_keys = nextwp_parse_sub_field_keys_from_file( $file_path, $name );
            if ( ! empty( $sub_keys ) ) {
                $def['sub_fields'] = array();
                foreach ( $sub_keys as $key ) {
                    $def['sub_fields'][] = array( 'name' => $key, 'type' => nextwp_infer_field_type( $key ) );
                }
            } else {
                $def['sub_fields'] = array(
                    array( 'name' => 'title', 'type' => 'text' ),
                    array( 'name' => 'content', 'type' => 'content' ),
                    array( 'name' => 'image', 'type' => 'image' ),
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
        $type = isset( $def['type'] ) ? $def['type'] : nextwp_infer_field_type( $name );
        $acf_type = nextwp_field_type_to_acf( $type );
        $key = 'field_' . md5( $parent_key . '_' . $name . '_' . $depth );

        $field = array(
            'key'   => $key,
            'label' => ucfirst( str_replace( array( '_', '-' ), ' ', $name ) ),
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
