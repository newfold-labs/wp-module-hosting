<?php

namespace NewfoldLabs\WP\Module\Hosting\Helpers;

use WP_Error;
use NewfoldLabs\WP\Module\Data\Helpers\Encryption;

/**
 * Class HUAPIHelper
 *
 * Helper class for interacting with Hosting UAPI.
 */
class HUAPIHelper {

	/**
	 * Transient key for storing encrypted HUAPI context data (auth + payload).
	 *
	 * @var string
	 */
	protected static $token_transient_key = 'nfd_hosting_panel_huapi_context_data';

	/**
	 * Base URL for HUAPI.
	 *
	 * @var string
	 */
	private $api_base_url;

	/**
	 * API endpoint path (e.g. "/v1/hosting/{id}/info/diskusage").
	 *
	 * @var string
	 */
	private $endpoint;

	/**
	 * HTTP method (GET, POST, etc).
	 *
	 * @var string
	 */
	private $method;

	/**
	 * Query parameters for GET/DELETE requests.
	 *
	 * @var array
	 */
	private $query_params;

	/**
	 * Request body for POST/PUT/PATCH requests.
	 *
	 * @var array
	 */
	private $body;

	/**
	 * Constructor.
	 *
	 * @param string $endpoint     API endpoint path.
	 * @param array  $query_params Optional query parameters.
	 * @param array  $body         Optional request body.
	 * @param string $method       HTTP method (default GET).
	 */
	public function __construct(
		$endpoint,
		$query_params = array(),
		$body = array(),
		$method = 'GET'
	) {
		if ( ! defined( 'NFD_HUAPI_URL' ) ) {
			define( 'NFD_HUAPI_URL', 'https://hosting.uapi.newfold.com' );
		}

		$this->api_base_url = constant( 'NFD_HUAPI_URL' );
		$this->endpoint     = ltrim( $endpoint, '/' );
		$this->method       = strtoupper( $method );
		$this->query_params = (array) $query_params;
		$this->body         = (array) $body;
	}

	/**
	 * Sends the request to HUAPI.
	 *
	 * @return string|WP_Error Response body or WP_Error on failure.
	 */
	public function send_request() {
		// Retrieve encrypted context data from transient
		$encrypted = get_transient( self::$token_transient_key );
		if ( false === $encrypted ) {
			return new WP_Error(
				'nfd_huapi_error',
				__( 'No HUAPI context data available.', 'wp-module-hosting' )
			);
		}

		// Decrypt the context data (includes token and original payload)
		$context = self::get_huapi_context_data();
		if ( is_wp_error( $context ) ) {
			return $context;
		}

		$token = $context['token'];
		// Build full URL
		$url = rtrim( $this->api_base_url, '/' ) . '/' . $this->endpoint;

		// Attach query params for GET/DELETE
		if ( in_array( $this->method, array( 'GET', 'DELETE' ), true ) && ! empty( $this->query_params ) ) {
			$url = add_query_arg( $this->query_params, $url );
		}

		$args = array(
			'method'  => $this->method,
			'headers' => array(
				'Content-Type'  => 'application/json',
				'Authorization' => 'Bearer ' . $token,
			),
			'timeout' => 30,
		);

		// Attach body for POST/PUT/PATCH
		if ( in_array( $this->method, array( 'POST', 'PUT', 'PATCH' ), true ) && ! empty( $this->body ) ) {
			$args['body'] = wp_json_encode( $this->body );
		}

		// Perform the request
		$response = wp_remote_request( $url, $args );
		if ( is_wp_error( $response ) ) {
			return $response;
		}

		$code = wp_remote_retrieve_response_code( $response );
		if ( $code < 200 || $code >= 300 ) {
			return new WP_Error(
				'nfd_huapi_error',
				sprintf(
				/* translators: %d is the HTTP response code returned by the HUAPI endpoint. */
					__( 'HUAPI returned HTTP %d', 'wp-module-hosting' ),
					$code
				)
			);

		}

		return wp_remote_retrieve_body( $response );
	}

	/**
	 * Retrieves or fetches HUAPI context data (token + original payload), caching in transient.
	 *
	 * @return array|WP_Error Array with 'token' and 'data' on success, or WP_Error on failure.
	 */
	private static function get_huapi_context_data() {
		// Attempt to pull encrypted JSON string from transient
		$cached = get_transient( self::$token_transient_key );
		if ( false !== $cached ) {
			$decrypted_json = ( new Encryption() )->decrypt( $cached );
			$decrypted      = json_decode( $decrypted_json, true );

			if ( ! is_array( $decrypted ) ) {
				return new WP_Error(
					'nfd_huapi_error',
					__( 'Decrypted HUAPI context is invalid.', 'wp-module-hosting' )
				);
			}

			return array(
				'token' => $decrypted['token'] ?? '',
				'data'  => $decrypted,
			);
		}

		// Fetch fresh data from the Laravel endpoint
		$helper   = new HiiveHelper( '/sites/v1/customer', array(), 'GET' );
		$response = $helper->send_request();
		if ( is_wp_error( $response ) ) {
			return $response;
		}

		$body = json_decode( $response, true );
		if ( ! is_array( $body ) ) {
			return new WP_Error(
				'nfd_hiive_error',
				__( 'Unexpected Hiive API payload.', 'wp-module-hosting' )
			);
		}

		$token = $body['token'] ?? '';

		// JSON-encode the entire payload, then encrypt and cache it for 30 minutes
		$json_body = wp_json_encode( $body );
		$encrypted = ( new Encryption() )->encrypt( $json_body );
		set_transient( self::$token_transient_key, $encrypted, 30 * MINUTE_IN_SECONDS );

		return array(
			'token' => $token,
			'data'  => $body,
		);
	}


	/**
	 * Get the customer ID from the HUAPI context data.
	 *
	 * @return mixed Customer ID on success, or WP_Error on failure.
	 */
	public static function get_customer_id() {
		$context = self::get_huapi_context_data();
		if ( is_wp_error( $context ) ) {
			return $context;
		}

		if ( isset( $context['data']['customer_id'] ) ) {
			return $context['data']['customer_id'];
		}

		return new WP_Error(
			'nfd_huapi_error',
			__( 'Customer ID not found in HUAPI context data.', 'wp-module-hosting' )
		);
	}

	/**
	 * Get the site ID from the HUAPI context data.
	 *
	 * @return mixed Site ID on success, or WP_Error on failure.
	 */
	public static function get_site_id() {
		$context = self::get_huapi_context_data();
		if ( is_wp_error( $context ) ) {
			return $context;
		}

		if ( isset( $context['data']['site_id'] ) ) {
			return $context['data']['site_id'];
		}

		return new WP_Error(
			'nfd_huapi_error',
			__( 'Site ID not found in HUAPI context data.', 'wp-module-hosting' )
		);
	}
}
