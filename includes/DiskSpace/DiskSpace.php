<?php

namespace NewfoldLabs\WP\Module\Hosting\DiskSpace;

/**
 * Handles Disk Space details.
 */
class DiskSpace {

	/**
	 * Retrieves Dish Space data.
	 *
	 * @return array Disk Space details.
	 */
	public function get_data() {
		$hosting_id = 'xx';
		$token      = 'xxx';
		$api_url    = "https://hosting.uapi.newfold.com/v1/hosting/{$hosting_id}/info/diskusage";

		$response = wp_remote_get(
			$api_url,
			array(
				'headers' => array(
					'Authorization' => 'Bearer ' . $token,
					'Content-Type'  => 'application/json',
				),
			)
		);

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
