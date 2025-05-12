<?php

namespace NewfoldLabs\WP\Module\Hosting\DataCenter;

use NewfoldLabs\WP\Module\Hosting\Helpers\PlatformHelper;
use NewfoldLabs\WP\Module\Hosting\Helpers\HUAPIHelper;

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
	protected $huapi_endpoint = '/v1/sites/';

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
		$side_id = HUAPIHelper::get_site_id();
		if ( is_wp_error( $side_id ) ) {
			return '';
		}

		$endpoint = $this->huapi_endpoint . $side_id;
		$helper   = new HUAPIHelper( $endpoint, array(), 'GET' );
		$response = $helper->send_request();

		if ( is_wp_error( $response ) || 200 !== wp_remote_retrieve_response_code( $response ) ) {
			return '';
		}

		$response = json_decode( wp_remote_retrieve_body( $response ), true );

		return ! empty( $response['datacenter'] ) ? $response['datacenter'] : '';
	}
}
