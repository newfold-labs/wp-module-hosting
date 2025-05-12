<?php

namespace NewfoldLabs\WP\Module\Hosting\PHPVersion;

use NewfoldLabs\WP\Module\Hosting\Helpers\HUAPIHelper;

/**
 * Handles PHP version-related functionality.
 */
class PHPVersion {

	/**
	 * API endpoint for name servers.
	 *
	 * @var string
	 */
	protected $huapi_endpoint = '/v1/sites/site_id/settings/php-versions';

	/**
	 * Retrieves PHP version data.
	 *
	 * @return array PHP version details.
	 */
	public function get_data() {

		$current_version     = phpversion();
		$recommended_version = '8.3';

		$site_id = HUAPIHelper::get_site_id();

		if ( ! is_wp_error( $site_id ) ) {

			$endpoint = str_replace( 'site_id', $site_id, $this->huapi_endpoint );
			$helper   = new HUAPIHelper( $endpoint, array(), 'GET' );
			$response = $helper->send_request();

			if ( ! is_wp_error( $response ) ) {
				$body     = wp_remote_retrieve_body( $response );
				$api_data = json_decode( $body, true );

				if ( isset( $api_data['latest'] ) ) {
					$current_version = $api_data['latest'];
				}

				if ( isset( $api_data['default'] ) ) {
					$recommended_version = $api_data['default'];
				}
			}
		}

		$data = array(
			'current_version'     => $current_version,
			'recommended_version' => $recommended_version,
		);

		return $data;
	}
}
