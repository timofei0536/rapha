<?php
/**
 * NextWP — migrate default images to media library and pre-fill repeater/group meta.
 * Runs when not on the page edit screen so meta is filled once and clone fields show correct rows.
 */

if ( ! defined( 'ABSPATH' ) ) {
    return;
}

/** Meta key on attachments: original schema src path, used to avoid duplicate uploads. */
define( 'NEXTWP_META_SOURCE_SRC', '_nextwp_source_src' );

/**
 * Resolve filesystem path for a schema image src (e.g. /images/about/manager.png).
 *
 * @param string $project_path NextWP project root (theme nextwp dir or NEXTWP_PROJECT_PATH).
 * @param string $src          Value from schema default (e.g. "/images/about/manager.png").
 * @return string|null Full path if file exists, null otherwise.
 */
function nextwp_resolve_default_image_path( $project_path, $src ) {
    if ( ! is_string( $src ) || $src === '' ) {
        return null;
    }
    $base = rtrim( $project_path, '/\\' );
    $rel  = ltrim( str_replace( '\\', '/', $src ), '/' );
    $parent = dirname( $base );
    $candidates = array(
        $base . '/public/' . $rel,
        $base . '/' . $rel,
        $parent . '/public/' . $rel,
    );
    foreach ( $candidates as $path ) {
        if ( is_readable( $path ) && is_file( $path ) ) {
            return $path;
        }
    }
    return null;
}

/**
 * Upload a local file to WordPress media library and return attachment ID.
 *
 * @param string $path       Full filesystem path to the file.
 * @param string $filename   Optional. Filename for upload (default: basename of path).
 * @param string $alt        Optional. Alt text for the image (stored in _wp_attachment_image_alt).
 * @param string $source_src Optional. Schema src path (e.g. /images/about/manager.png) for dedupe; stored on attachment.
 * @return int|null Attachment ID or null on failure.
 */
function nextwp_upload_file_to_media( $path, $filename = '', $alt = '', $source_src = '' ) {
    if ( ! is_readable( $path ) || ! is_file( $path ) ) {
        return null;
    }
    $filename = $filename !== '' ? $filename : basename( $path );
    $content  = file_get_contents( $path );
    if ( $content === false ) {
        return null;
    }
    require_once ABSPATH . 'wp-admin/includes/file.php';
    require_once ABSPATH . 'wp-admin/includes/image.php';
    $upload = wp_upload_bits( $filename, null, $content );
    if ( ! empty( $upload['error'] ) ) {
        nextwp_log( 'Media migration: wp_upload_bits failed', $upload['error'] );
        return null;
    }
    $file_path = $upload['file'];
    $mime      = wp_check_filetype( $filename, null );
    $mime_type = $mime['type'] ? $mime['type'] : 'image/png';
    $attachment = array(
        'post_title'     => sanitize_file_name( pathinfo( $filename, PATHINFO_FILENAME ) ),
        'post_mime_type' => $mime_type,
        'post_content'   => '',
        'post_status'    => 'inherit',
    );
    $attachment_id = wp_insert_attachment( $attachment, $file_path, 0 );
    if ( is_wp_error( $attachment_id ) || ! $attachment_id ) {
        return null;
    }
    $metadata = wp_generate_attachment_metadata( $attachment_id, $file_path );
    if ( is_array( $metadata ) ) {
        update_post_meta( $attachment_id, '_wp_attachment_metadata', $metadata );
        if ( empty( $metadata['sizes'] ) && wp_attachment_is_image( $attachment_id ) ) {
            $metadata = wp_generate_attachment_metadata( $attachment_id, $file_path );
            if ( is_array( $metadata ) && ! empty( $metadata['sizes'] ) ) {
                update_post_meta( $attachment_id, '_wp_attachment_metadata', $metadata );
            }
        }
    }
    if ( is_string( $alt ) && $alt !== '' ) {
        update_post_meta( $attachment_id, '_wp_attachment_image_alt', $alt );
    }
    if ( is_string( $source_src ) && $source_src !== '' ) {
        $norm = '/' . ltrim( str_replace( '\\', '/', $source_src ), '/' );
        update_post_meta( $attachment_id, NEXTWP_META_SOURCE_SRC, $norm );
    }
    return (int) $attachment_id;
}

/**
 * Return existing attachment ID if we already uploaded this src (avoid duplicates).
 *
 * @param string $src Schema image src (e.g. /images/about/manager.png).
 * @return int|null Attachment ID or null.
 */
function nextwp_get_existing_attachment_by_src( $src ) {
    if ( $src === '' ) {
        return null;
    }
    $norm = '/' . ltrim( str_replace( '\\', '/', $src ), '/' );
    $posts = get_posts( array(
        'post_type'      => 'attachment',
        'post_status'    => 'any',
        'meta_key'       => NEXTWP_META_SOURCE_SRC,
        'meta_value'     => $norm,
        'posts_per_page' => 1,
        'fields'         => 'ids',
    ) );
    if ( ! empty( $posts ) ) {
        return (int) $posts[0];
    }
    return null;
}

/**
 * Convert schema default image (src/alt) to attachment ID and return value for meta.
 * Reuses existing attachment if same src was already uploaded. If file not found or upload fails, returns null.
 *
 * @param string $project_path Project root.
 * @param array  $default     Schema default for image field (e.g. array( 'src' => '...', 'alt' => '...' )).
 * @return int|null Attachment ID or null.
 */
function nextwp_default_image_to_attachment_id( $project_path, $default ) {
    if ( ! is_array( $default ) ) {
        return null;
    }
    $src = isset( $default['src'] ) ? $default['src'] : ( isset( $default['url'] ) ? $default['url'] : '' );
    if ( $src === '' ) {
        return null;
    }
    $norm = '/' . ltrim( str_replace( '\\', '/', $src ), '/' );
    $existing = nextwp_get_existing_attachment_by_src( $norm );
    if ( $existing !== null ) {
        return $existing;
    }
    $path = nextwp_resolve_default_image_path( $project_path, $src );
    if ( $path === null ) {
        nextwp_log( 'Media migration: file not found', $src );
        return null;
    }
    $alt = isset( $default['alt'] ) ? $default['alt'] : '';
    $id  = nextwp_upload_file_to_media( $path, basename( $path ), $alt, $norm );
    return $id;
}

/**
 * Check if current meta value is "empty" for an ACF field (so we can fill with default).
 *
 * @param mixed $value Meta value.
 * @return bool True if considered empty.
 */
function nextwp_meta_value_empty( $value ) {
    if ( $value === null || $value === '' || $value === false ) {
        return true;
    }
    if ( is_array( $value ) ) {
        return count( $value ) === 0;
    }
    return false;
}

/**
 * Recursively fill one component's defaults into page meta (images → attachment IDs, repeaters → rows).
 *
 * @param int    $page_id       Post ID of the page.
 * @param string $clone_prefix  Meta key prefix (e.g. component_about).
 * @param array  $schema_fields Schema fields for this component.
 * @param string $project_path  Project root for resolving image paths.
 * @param string $meta_prefix   Current meta key prefix (for nested: clone_prefix or clone_prefix_fieldname).
 * @return void
 */
function nextwp_fill_component_defaults_recursive( $page_id, $clone_prefix, $schema_fields, $project_path, $meta_prefix = null ) {
    if ( $meta_prefix === null ) {
        $meta_prefix = $clone_prefix;
    }
    foreach ( $schema_fields as $def ) {
        $name = isset( $def['name'] ) ? $def['name'] : '';
        $type = isset( $def['type'] ) ? $def['type'] : 'text';
        if ( $name === '' ) {
            continue;
        }
        $acf_type = function_exists( 'nextwp_field_type_to_acf' ) ? nextwp_field_type_to_acf( $type ) : 'text';
        $meta_key = $meta_prefix . '_' . $name;

        if ( $acf_type === 'image' ) {
            if ( ! array_key_exists( 'default', $def ) || ! is_array( $def['default'] ) ) {
                continue;
            }
            $current = get_post_meta( $page_id, $meta_key, true );
            if ( ! nextwp_meta_value_empty( $current ) ) {
                continue;
            }
            $attachment_id = nextwp_default_image_to_attachment_id( $project_path, $def['default'] );
            if ( $attachment_id !== null ) {
                update_post_meta( $page_id, $meta_key, $attachment_id );
                nextwp_log( 'Media migration: set image', array( 'meta_key' => $meta_key, 'id' => $attachment_id ) );
            }
            continue;
        }

        if ( $acf_type === 'gallery' ) {
            if ( ! array_key_exists( 'default', $def ) || ! is_array( $def['default'] ) ) {
                continue;
            }
            $current = get_post_meta( $page_id, $meta_key, true );
            if ( ! nextwp_meta_value_empty( $current ) ) {
                continue;
            }
            $ids = array();
            foreach ( $def['default'] as $item ) {
                $img = isset( $item['image'] ) ? $item['image'] : $item;
                $id  = nextwp_default_image_to_attachment_id( $project_path, is_array( $img ) ? $img : array() );
                if ( $id !== null ) {
                    $ids[] = $id;
                }
            }
            if ( ! empty( $ids ) ) {
                update_post_meta( $page_id, $meta_key, $ids );
                nextwp_log( 'Media migration: set gallery', array( 'meta_key' => $meta_key, 'count' => count( $ids ) ) );
            }
            continue;
        }

        if ( $acf_type === 'group' && ! empty( $def['sub_fields'] ) ) {
            foreach ( $def['sub_fields'] as $sub ) {
                $sub_name = isset( $sub['name'] ) ? $sub['name'] : '';
                $sub_type = isset( $sub['type'] ) ? $sub['type'] : 'text';
                $sub_acf  = function_exists( 'nextwp_field_type_to_acf' ) ? nextwp_field_type_to_acf( $sub_type ) : 'text';
                $sub_meta_key = $meta_key . '_' . $sub_name;
                $existing = get_post_meta( $page_id, $sub_meta_key, true );
                if ( ! nextwp_meta_value_empty( $existing ) ) {
                    continue;
                }
                if ( $sub_acf === 'image' && array_key_exists( 'default', $sub ) && is_array( $sub['default'] ) ) {
                    $id = nextwp_default_image_to_attachment_id( $project_path, $sub['default'] );
                    if ( $id !== null ) {
                        update_post_meta( $page_id, $sub_meta_key, $id );
                    }
                } elseif ( $sub_acf === 'gallery' && array_key_exists( 'default', $sub ) && is_array( $sub['default'] ) ) {
                    $ids = array();
                    foreach ( $sub['default'] as $item ) {
                        $img = isset( $item['image'] ) ? $item['image'] : $item;
                        $id  = nextwp_default_image_to_attachment_id( $project_path, is_array( $img ) ? $img : array() );
                        if ( $id !== null ) {
                            $ids[] = $id;
                        }
                    }
                    if ( ! empty( $ids ) ) {
                        update_post_meta( $page_id, $sub_meta_key, $ids );
                    }
                } elseif ( array_key_exists( 'default', $sub ) ) {
                    update_post_meta( $page_id, $sub_meta_key, $sub['default'] );
                }
            }
            continue;
        }

        if ( $acf_type === 'repeater' && ! empty( $def['sub_fields'] ) && array_key_exists( 'default', $def ) && is_array( $def['default'] ) ) {
            $existing_count = get_post_meta( $page_id, $meta_key, true );
            if ( is_numeric( $existing_count ) && (int) $existing_count > 0 ) {
                continue;
            }
            $default_rows = $def['default'];
            $rows = array();
            foreach ( $default_rows as $row ) {
                $new_row = array();
                foreach ( $def['sub_fields'] as $sub ) {
                    $sub_name = isset( $sub['name'] ) ? $sub['name'] : '';
                    $sub_type = isset( $sub['type'] ) ? $sub['type'] : 'text';
                    $sub_acf  = function_exists( 'nextwp_field_type_to_acf' ) ? nextwp_field_type_to_acf( $sub_type ) : 'text';
                    $val = isset( $row[ $sub_name ] ) ? $row[ $sub_name ] : null;
                    if ( $sub_acf === 'image' && is_array( $val ) ) {
                        $id = nextwp_default_image_to_attachment_id( $project_path, $val );
                        $new_row[ $sub_name ] = $id !== null ? $id : '';
                    } else {
                        $new_row[ $sub_name ] = $val;
                    }
                }
                $rows[] = $new_row;
            }
            if ( ! empty( $rows ) ) {
                update_post_meta( $page_id, $meta_key, count( $rows ) );
                foreach ( $def['sub_fields'] as $sub ) {
                    $sub_name = isset( $sub['name'] ) ? $sub['name'] : '';
                    if ( $sub_name === '' ) {
                        continue;
                    }
                    foreach ( $rows as $i => $row ) {
                        $cell_key = $meta_key . '_' . $i . '_' . $sub_name;
                        $cell_val = isset( $row[ $sub_name ] ) ? $row[ $sub_name ] : '';
                        update_post_meta( $page_id, $cell_key, $cell_val );
                    }
                }
                nextwp_log( 'Media migration: set repeater', array( 'meta_key' => $meta_key, 'rows' => count( $rows ) ) );
            }
            continue;
        }

        if ( $type !== 'group' && $type !== 'repeater' && array_key_exists( 'default', $def ) ) {
            $current = get_post_meta( $page_id, $meta_key, true );
            if ( nextwp_meta_value_empty( $current ) ) {
                update_post_meta( $page_id, $meta_key, $def['default'] );
            }
        }
    }
}

/** Option key: set to '1' after first migration so we don't re-upload on every request. Delete to re-run. */
define( 'NEXTWP_OPTION_DEFAULTS_MIGRATED', 'next_wp_defaults_migrated' );

/**
 * Migrate default images to media library and pre-fill page meta for all NextWP pages.
 * Runs only once (unless option NEXTWP_OPTION_DEFAULTS_MIGRATED is deleted). Call when not on the post edit screen.
 *
 * @param string $project_path NextWP project root.
 */
function nextwp_migrate_defaults_to_pages( $project_path ) {
    if ( get_option( NEXTWP_OPTION_DEFAULTS_MIGRATED ) === '1' ) {
        return;
    }
    $pages = nextwp_get_pages_from_app( $project_path );
    $schema = nextwp_load_schema_json( $project_path );
    if ( $schema === null || empty( $pages ) ) {
        return;
    }
    foreach ( array_keys( $pages ) as $slug ) {
        $check_slug = $slug ? $slug : 'home';
        $page = get_page_by_path( $check_slug, OBJECT, 'page' );
        if ( ! $page || ! isset( $page->ID ) ) {
            continue;
        }
        $page_id = (int) $page->ID;
        $components = nextwp_get_components_for_page_slug( $project_path, $slug );
        foreach ( $components as $name ) {
            if ( ! isset( $schema[ $name ] ) || ! is_array( $schema[ $name ] ) ) {
                continue;
            }
            $clone_prefix = 'component_' . nextwp_name_to_acf_key( $name );
            nextwp_fill_component_defaults_recursive( $page_id, $clone_prefix, $schema[ $name ], $project_path );
        }
    }
    update_option( NEXTWP_OPTION_DEFAULTS_MIGRATED, '1' );
    nextwp_log( 'Media migration: finished (one-time)' );
}

/**
 * Clear migration flag (e.g. on rollback) so migration can run again.
 */
function nextwp_rollback_defaults_migration() {
    delete_option( NEXTWP_OPTION_DEFAULTS_MIGRATED );
}
