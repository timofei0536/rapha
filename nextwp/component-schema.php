<?php
/**
 * NextWP — component field schema. Types inferred by regex when omitted.
 * Arrays → repeater, objects → group (define sub_fields).
 */

if ( ! defined( 'ABSPATH' ) ) {
    return;
}

/**
 * Get schema for all components. Each field: name, type (optional), sub_fields (for repeater/group).
 *
 * @return array [ 'ComponentName' => [ ['name' => 'title', 'type' => 'text'], ... ], ... ]
 */
function nextwp_get_component_schema() {
    $schema = array(
        'Hero' => array(
            array( 'name' => 'title', 'type' => 'text' ),
            array( 'name' => 'formTitle', 'type' => 'text' ),
            array( 'name' => 'image', 'type' => 'image' ),
        ),
        'PageScreen' => array(
            array( 'name' => 'title', 'type' => 'text' ),
            array( 'name' => 'image', 'type' => 'image' ),
        ),
        'TextPage' => array(
            array( 'name' => 'title', 'type' => 'text' ),
            array( 'name' => 'content', 'type' => 'content' ),
        ),
        'AboutScreen' => array(
            array( 'name' => 'subtitle', 'type' => 'text' ),
            array( 'name' => 'title', 'type' => 'text' ),
            array( 'name' => 'content', 'type' => 'content' ),
            array( 'name' => 'image', 'type' => 'image' ),
        ),
        'Careers' => array(
            array( 'name' => 'heading', 'type' => 'text' ),
            array( 'name' => 'content', 'type' => 'content' ),
            array( 'name' => 'gallery', 'type' => 'gallery' ),
        ),
        'About' => array(
            array( 'name' => 'sectionTitle', 'type' => 'text' ),
            array(
                'name' => 'gm',
                'type' => 'group',
                'sub_fields' => array(
                    array( 'name' => 'image', 'type' => 'image' ),
                    array( 'name' => 'title', 'type' => 'text' ),
                    array( 'name' => 'position', 'type' => 'text' ),
                ),
            ),
            array(
                'name' => 'items',
                'type' => 'repeater',
                'sub_fields' => array(
                    array( 'name' => 'content', 'type' => 'content' ),
                    array( 'name' => 'image', 'type' => 'image' ),
                    array( 'name' => 'layout', 'type' => 'text' ),
                ),
            ),
        ),
        'Contact' => array(
            array( 'name' => 'map', 'type' => 'group', 'sub_fields' => array(
                array( 'name' => 'title', 'type' => 'text' ),
                array( 'name' => 'src', 'type' => 'text' ),
            ) ),
            array(
                'name' => 'items',
                'type' => 'repeater',
                'sub_fields' => array(
                    array( 'name' => 'title', 'type' => 'text' ),
                    array( 'name' => 'link', 'type' => 'link' ),
                ),
            ),
        ),
        'Services' => array(
            array( 'name' => 'title', 'type' => 'text' ),
            array( 'name' => 'image', 'type' => 'image' ),
            array(
                'name' => 'services',
                'type' => 'repeater',
                'sub_fields' => array(
                    array( 'name' => 'title', 'type' => 'text' ),
                    array( 'name' => 'text', 'type' => 'content' ),
                ),
            ),
        ),
        'News' => array(
            array( 'name' => 'title', 'type' => 'text' ),
            array(
                'name' => 'items',
                'type' => 'repeater',
                'sub_fields' => array(
                    array( 'name' => 'image', 'type' => 'image' ),
                    array( 'name' => 'title', 'type' => 'text' ),
                    array( 'name' => 'text', 'type' => 'content' ),
                    array( 'name' => 'link', 'type' => 'link' ),
                ),
            ),
        ),
        'Infra' => array(
            array( 'name' => 'title', 'type' => 'text' ),
            array(
                'name' => 'items',
                'type' => 'repeater',
                'sub_fields' => array(
                    array( 'name' => 'image', 'type' => 'image' ),
                    array( 'name' => 'title', 'type' => 'text' ),
                ),
            ),
        ),
        'Team' => array(
            array( 'name' => 'titleSmall', 'type' => 'text' ),
            array( 'name' => 'title', 'type' => 'text' ),
            array( 'name' => 'text', 'type' => 'content' ),
            array(
                'name' => 'gallery',
                'type' => 'group',
                'sub_fields' => array(
                    array( 'name' => 'left', 'type' => 'gallery' ),
                    array( 'name' => 'right', 'type' => 'gallery' ),
                ),
            ),
        ),
        'Structure' => array(
            array( 'name' => 'title', 'type' => 'text' ),
            array(
                'name' => 'tabs',
                'type' => 'repeater',
                'sub_fields' => array(
                    array( 'name' => 'label', 'type' => 'text' ),
                    array( 'name' => 'content', 'type' => 'content' ),
                ),
            ),
        ),
        'Chart' => array(
            array( 'name' => 'title', 'type' => 'text' ),
            array( 'name' => 'data', 'type' => 'content' ),
        ),
        'Service' => array(
            array(
                'name' => 'services',
                'type' => 'repeater',
                'sub_fields' => array(
                    array( 'name' => 'slug', 'type' => 'text' ),
                    array( 'name' => 'title', 'type' => 'text' ),
                ),
            ),
        ),
    );

    foreach ( $schema as $comp => $fields ) {
        foreach ( $fields as $i => $f ) {
            if ( empty( $f['type'] ) ) {
                $schema[ $comp ][ $i ]['type'] = nextwp_infer_field_type( $f['name'] );
            }
        }
    }

    return $schema;
}

/**
 * Build ACF fields array from schema for one component.
 *
 * @param string $component_name Component name (e.g. Hero).
 * @param string $group_key ACF group key (e.g. group_next_hero).
 * @return array ACF fields for acf_import_field_group.
 */
function nextwp_build_acf_fields_from_schema( $component_name, $group_key ) {
    $schema_all = nextwp_get_component_schema();
    $fields_def = isset( $schema_all[ $component_name ] ) ? $schema_all[ $component_name ] : array();
    if ( empty( $fields_def ) ) {
        return array();
    }

    return nextwp_build_acf_fields_recursive( $fields_def, $group_key, 0 );
}

/**
 * Recursive build of ACF field arrays (handles group + repeater).
 *
 * @param array  $defs Array of [ name, type, sub_fields? ].
 * @param string $parent_key Parent field key or group key.
 * @param int    $depth Depth for unique keys.
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
            $field['preview_size']   = 'medium';
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
