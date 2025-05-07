<?php

namespace NewfoldLabs\WP\Module\Hosting\DataCenter;

use NewfoldLabs\WP\Module\Hosting\Helpers\PlatformHelper;

/**
 * Handles DataCenter info retrieval.
 */
class DataCenter {

	/**
	 * Dependency container instance.
	 *
	 * @var mixed
	 */
	protected $container;

	/**
	 * API endpoint for sites.
	 *
	 * @var string
	 */
	protected $huapi_endpoint = 'https://hosting.uapi.newfold.com/v1/sites/';

	/**
	 * DataCenter constructor.
	 *
	 * @param mixed $container The dependency container instance.
	 */
	public function __construct( $container ) {
		$this->container = $container;
	}

	/**
	 * Retrieves data center if Atomic.
	 *
	 * @return string Data Center information.
	 */
	public function get_data() {
		$data_center = '';
		if ( PlatformHelper::is_atomic() ) {
			$data_center = $this->get_data_center();
		}
		return $data_center;
	}

	/**
	 * Retrieves the data center information.
	 *
	 * @return string Data center name or an empty string on error.
	 */
	public function get_data_center() {
		$site_id  = 'xxxxxxx';
		$endpoint = $this->huapi_endpoint . $site_id;
		$response = wp_remote_get(
			$endpoint,
			array(
				'headers' => array(
					'Authorization' => 'Bearer xxxxxxx',
				),
			)
		);

		if ( is_wp_error( $response ) || 200 !== wp_remote_retrieve_response_code( $response ) ) {
			return '';
		}

		$response = json_decode( wp_remote_retrieve_body( $response ), true );

		return ! empty( $response['datacenter'] ) ? $response['datacenter'] : '';
	}
}
