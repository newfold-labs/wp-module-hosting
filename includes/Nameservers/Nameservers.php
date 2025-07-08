<?php

namespace NewfoldLabs\WP\Module\Hosting\Nameservers;

use NewfoldLabs\WP\Module\Hosting\Helpers\HUAPIHelper;

/**
 * Handles DNS name server retrieval.
 */
class Nameservers {

	/**
	 * Dependency container instance.
	 *
	 * @var mixed
	 */
	protected $container;

	/**
	 * API endpoint for name servers.
	 *
	 * @var string
	 */
	protected $huapi_endpoint = 'v1/sites/site-id/domain';

	/**
	 * Nameservers constructor.
	 *
	 * @param mixed $container The dependency container instance.
	 */
	public function __construct( $container ) {
		$this->container = $container;
	}

	/**
	 * Retrieves site URL, runs a DNS check, and fetches name servers.
	 *
	 * @return array Name server data.
	 */
	public function get_data() {
		$site_id = HUAPIHelper::get_site_id();
		if ( is_wp_error( $site_id ) ) {
			return array(
				'records' => array(),
			);
		}

		$endpoint = str_replace( 'site-id', $site_id, $this->huapi_endpoint );
		$helper   = new HUAPIHelper( $endpoint, array(), 'GET' );
		$response = $helper->send_request();

		if ( is_wp_error( $response ) ) {
			return array(
				'records' => array(),
			);
		}

		$data         = json_decode( $response, true );
		$name_servers = array();

		if ( ! empty( $data['detected']['ns'] ) ) {
			foreach ( $data['detected']['ns'] as $index => $value ) {
				$name_servers[] = $value;
			}
		}

		return array(
			'records' => $name_servers,
		);
	}
}
