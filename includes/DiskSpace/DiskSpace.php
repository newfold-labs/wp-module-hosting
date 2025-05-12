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
            return null;
        }

        $endpoint = str_replace( 'hosting-id', $customer_id, $this->huapi_endpoint );
        $helper   = new HUAPIHelper( $endpoint, array(), 'GET' );
        $response = $helper->send_request();
        
		if ( is_wp_error( $response ) ) {
			error_log( 'Error in the API call: ' . $response->get_error_message() ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
			return null;
		}

		$status_code = wp_remote_retrieve_response_code( $response );
		if ( 200 !== $status_code ) {
			error_log( 'Error in the API call: HTTP Code ' . $status_code ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
			return null;
		}

		$body = wp_remote_retrieve_body( $response );
		$data = json_decode( $body, true );

		if ( isset( $data['diskused'], $data['disklimit'], $data['filesused'], $data['fileslimit'] ) ) {
			return array(
				'diskused'   => $data['diskused'],
				'disklimit'  => $data['disklimit'],
				'filesused'  => $data['filesused'],
				'fileslimit' => $data['fileslimit'],
			);
		}

		return null;
	}
}
