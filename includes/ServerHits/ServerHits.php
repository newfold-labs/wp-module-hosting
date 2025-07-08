<?php

namespace NewfoldLabs\WP\Module\Hosting\ServerHits;

use NewfoldLabs\WP\Module\Hosting\Helpers\HUAPIHelper;

/**
 * Handles retrieval of server hits data for a hosting plan.
 */
class ServerHits {

	/**
	 * Dependency container instance.
	 *
	 * @var mixed
	 */
	protected $container;

	/**
	 * Transient key for storing last total hits
	 */
	const TOTAL_HITS_TRANSIENT = 'nfd_server_hits_last_total';

	/**
	 * ServerHits constructor.
	 *
	 * @param mixed $container The dependency container instance.
	 */
	public function __construct( $container ) {
		$this->container = $container;
	}

	/**
	 * Retrieves the server hits data from the FastAPI service.
	 *
	 * @return array
	 */
	public function get_data() {
		$customer_id = HUAPIHelper::get_customer_id();
		if ( is_wp_error( $customer_id ) ) {
			return array(
				'error' => __( 'Failed to fetch customer id.', 'wp-module-hosting' ),
			);
		}

		$endpoint = sprintf( '/v1/hosting/%s/server-hits?interval=30', $customer_id );
		$helper   = new HUAPIHelper( $endpoint, array(), 'GET', true );
		$response = $helper->send_request();

		if ( is_wp_error( $response ) ) {
			return array(
				'error' => __( 'Failed to fetch server hits.', 'wp-module-hosting' ),
			);
		}

		$data = json_decode( $response, true );
		if ( ! is_array( $data ) || ! isset( $data['server_hits'] ) ) {
			return array(
				'error' => __( 'Invalid response format.', 'wp-module-hosting' ),
			);
		}

		$hits               = $data['server_hits'];
		$current_total_hits = $hits['total_hits'] ?? 0;

		$previous_total_hits = get_transient( self::TOTAL_HITS_TRANSIENT );
		$percentage_change   = 0;

		if ( false !== $previous_total_hits && $previous_total_hits > 0 ) {
			$percentage_change = ( ( $current_total_hits - $previous_total_hits ) / $previous_total_hits ) * 100;
		}

		// Only store transient if not already set
		if ( false === $previous_total_hits ) {
			set_transient( self::TOTAL_HITS_TRANSIENT, $current_total_hits, DAY_IN_SECONDS );
		}

		return array(
			'total_hits'        => $current_total_hits,
			'hits_allotted'     => $hits['hits_allotted'] ?? 0,
			'last_n_days'       => is_array( $hits['last_n_days'] ) ? $hits['last_n_days'] : array(),
			'percentage_change' => round( $percentage_change, 2 ),
		);
	}

	/**
	 * Clears stored server hits comparison data.
	 *
	 * @return bool True if deleted, false otherwise.
	 */
	public static function clear_transients() {
		return delete_transient( self::TOTAL_HITS_TRANSIENT );
	}
}
