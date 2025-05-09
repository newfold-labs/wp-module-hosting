<?php

namespace NewfoldLabs\WP\Module\Hosting\PHPVersion;

/**
 * Handles PHP version-related functionality.
 */
class PHPVersion {

	/**
	 * Retrieves PHP version data.
	 *
	 * @return array PHP version details.
	 */
	public function get_data() {
        $site_id = 'xxxx';
        $token = 'xx';

		$response = wp_remote_get(
			"https://hosting.uapi.newfold.com/v1/sites/{$site_id}/settings/php-versions",
			array(
				'headers' => array(
				    'Authorization' => 'Bearer ' . $token,
                )
			)
		);

		if ( ! is_wp_error( $response ) ) {
			$body = wp_remote_retrieve_body( $response );
			$api_data = json_decode( $body, true );

			if ( isset( $api_data['latest'] ) ) {
				$current_version = $api_data['latest'];
			}

			if ( isset( $api_data['default'] ) ) {
				$recommended_version = $api_data['default'];
			}
		}else{
            $current_version     = phpversion();
            $recommended_version = '8.3';
        }

		$data = array(
			'current_version' => $current_version,
            'recommended_version' => $recommended_version
		);


		return $data;
	}
}
