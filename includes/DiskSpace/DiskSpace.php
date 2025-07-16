<?php

namespace NewfoldLabs\WP\Module\Hosting\DiskSpace;

use NewfoldLabs\WP\Module\Hosting\Helpers\HUAPIHelper;

/**
 * Handles Disk Space details.
 */
class DiskSpace {

	/**
	 * API endpoint for name servers.
	 *
	 * @var string
	 */
	protected $huapi_endpoint = '/v1/hosting/hosting_id/info/diskusage';

	/**
	 * Retrieves Dish Space data.
	 *
	 * @return array Disk Space details.
	 */
	public function get_data() {

		$customer_id = HUAPIHelper::get_customer_id();

		if ( is_wp_error( $customer_id ) ) {
			return array();
		}

		$endpoint = str_replace( 'hosting_id', $customer_id, $this->huapi_endpoint );

		$helper   = new HUAPIHelper( $endpoint, array(), 'GET' );
		$response = $helper->send_request();

		if ( is_wp_error( $response ) ) {
			return array();
		}

		$data = json_decode( $response, true );

		if ( isset( $data['diskused'], $data['disklimit'], $data['filesused'], $data['fileslimit'] ) ) {
			return array(
				'diskused'   => $data['diskused'],
				'disklimit'  => $data['disklimit'],
				'filesused'  => $data['filesused'],
				'fileslimit' => $data['fileslimit'],
			);
		}

		return array();
	}
}
