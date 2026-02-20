<?php
/**
 * NextWP — ACF fields from schema.json (built by: node nextwp/scripts/build-schema.js).
 * Schema is required; run npm run schema before deploying.
 */

if ( ! defined( 'ABSPATH' ) ) {
    return;
}

/**
 * Load full schema from nextwp/schema.json.
 *
 * @param string $project_path NextWP/project root path (e.g. theme/nextwp).
 * @return array|null Associative array component_name => fields array, or null if file missing.
 */
function nextwp_load_schema_json( $project_path ) {
    $path = rtrim( $project_path, '/\\' ) . '/schema.json';
    if ( ! is_readable( $path ) ) {
        return null;
    }
    $raw = file_get_contents( $path );
    if ( $raw === false ) {
        return null;
    }
    $data = json_decode( $raw, true );
    return is_array( $data ) ? $data : null;
}

/**
 * Build field definitions for a component from schema.json.
 *
 * @param string $component_name Component name.
 * @param string $project_path  Project root path (nextwp folder).
 * @return array List of [ 'name' => ..., 'type' => ..., 'sub_fields' => ... (optional) ].
 */
function nextwp_get_schema_for_component( $component_name, $project_path ) {
    $schema = nextwp_load_schema_json( $project_path );
    if ( $schema === null ) {
        nextwp_log( 'schema.json missing; run npm run schema', $project_path );
        return array();
    }
    if ( ! isset( $schema[ $component_name ] ) || ! is_array( $schema[ $component_name ] ) ) {
        return array();
    }
    return $schema[ $component_name ];
}

/**
 * Build ACF fields from schema for a component.
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
 * Convert schema default value to ACF default_value (scalar or array for link/image).
 *
 * @param mixed  $default  Value from schema (default).
 * @param string $acf_type ACF field type.
 * @return mixed Value for ACF default_value, or null to omit.
 */
function nextwp_default_value_for_acf( $default, $acf_type ) {
    if ( $default === null ) {
        return null;
    }
    if ( in_array( $acf_type, array( 'repeater', 'group' ), true ) ) {
        return null;
    }
    if ( $acf_type === 'link' && is_array( $default ) ) {
        return $default;
    }
    if ( ( $acf_type === 'image' || $acf_type === 'gallery' ) && is_array( $default ) ) {
        return $default;
    }
    if ( is_string( $default ) || is_numeric( $default ) || is_bool( $default ) ) {
        return $default;
    }
    if ( is_array( $default ) && isset( $default['url'] ) ) {
        return $default;
    }
    return null;
}

/**
 * Recursive build of ACF field arrays (handles group + repeater).
 * Repeater sub_fields get no default_value so every new row isn't filled with the first row's data.
 *
 * @param array  $defs            Array of [ name, type, sub_fields?, default? ].
 * @param string $parent_key      Parent field key or group key.
 * @param int    $depth           Depth for unique keys.
 * @param string $parent_acf_type Parent field ACF type (e.g. 'repeater') to skip default_value on repeater sub_fields.
 * @return array ACF fields.
 */
function nextwp_build_acf_fields_recursive( $defs, $parent_key, $depth = 0, $parent_acf_type = null ) {
    $fields = array();
    foreach ( $defs as $i => $def ) {
        $name = isset( $def['name'] ) ? $def['name'] : 'field_' . $i;
        $type = isset( $def['type'] ) ? $def['type'] : 'text';
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

        $allow_default = ( $parent_acf_type !== 'repeater' );
        if ( $allow_default && array_key_exists( 'default', $def ) ) {
            $acf_default = nextwp_default_value_for_acf( $def['default'], $acf_type );
            if ( $acf_default !== null ) {
                $field['default_value'] = $acf_default;
            }
        }

        if ( in_array( $acf_type, array( 'repeater', 'group' ), true ) && ! empty( $def['sub_fields'] ) ) {
            $field['sub_fields'] = nextwp_build_acf_fields_recursive( $def['sub_fields'], $key, $depth + 1, $acf_type );
        }

        $fields[] = $field;
    }

    return $fields;
}
