<?php
/**
 * REST endpoint for headless preview (draft/revision) by preview_id + preview_nonce.
 * Register: add_action( 'rest_api_init', 'el_rapha_register_preview_route' );
 * Frontend: GET /wp-json/el-rapha/v1/preview?preview_id=<id>&preview_nonce=<nonce>
 */
if ( ! defined( 'ABSPATH' ) ) {
	return;
}

/**
 * Register REST route for preview.
 */
function el_rapha_register_preview_route() {
	register_rest_route( 'el-rapha/v1', '/preview', array(
		'methods'             => 'GET',
		'permission_callback'  => '__return_true',
		'callback'            => 'el_rapha_preview_callback',
		'args'                => array(
			'preview_id'    => array(
				'required'          => true,
				'type'              => 'integer',
				'sanitize_callback' => 'absint',
			),
			'preview_nonce' => array(
				'required' => true,
				'type'     => 'string',
			),
		),
	) );
}

/**
 * Preview callback: verify nonce, load post/page (draft allowed), return JSON.
 *
 * @param \WP_REST_Request $request Request.
 * @return \WP_REST_Response|\WP_Error
 */
function el_rapha_preview_callback( $request ) {
	$preview_id    = $request->get_param( 'preview_id' );
	$preview_nonce = $request->get_param( 'preview_nonce' );

	if ( ! wp_verify_nonce( $preview_nonce, 'post_preview_' . $preview_id ) ) {
		return new \WP_Error( 'invalid_nonce', __( 'Preview link expired or invalid.', 'el-rapha' ), array( 'status' => 403 ) );
	}

	$post = get_post( $preview_id );
	if ( ! $post || ! in_array( $post->post_type, array( 'post', 'page' ), true ) ) {
		return new \WP_Error( 'not_found', __( 'Post not found.', 'el-rapha' ), array( 'status' => 404 ) );
	}

	$allowed_statuses = array( 'draft', 'pending', 'future', 'publish', 'private' );
	if ( ! in_array( $post->post_status, $allowed_statuses, true ) ) {
		return new \WP_Error( 'forbidden', __( 'Cannot preview this post.', 'el-rapha' ), array( 'status' => 403 ) );
	}

	$data = array(
		'id'       => $post->ID,
		'slug'     => $post->post_name,
		'date'     => $post->post_date,
		'date_gmt' => $post->post_date_gmt,
		'status'   => $post->post_status,
		'type'     => $post->post_type,
		'title'    => array( 'rendered' => get_the_title( $post ) ),
		'content'  => array( 'rendered' => apply_filters( 'the_content', $post->post_content ) ),
		'acf'      => array(),
	);

	if ( function_exists( 'get_fields' ) ) {
		$acf = get_fields( $post->ID );
		$data['acf'] = is_array( $acf ) ? $acf : array();
	}

	$response = new \WP_REST_Response( $data, 200 );
	$response->header( 'Cache-Control', 'no-store, no-cache, must-revalidate' );
	$response->header( 'Pragma', 'no-cache' );
	return $response;
}
