<?php

namespace NewfoldLabs\WP\Module\Hosting\Nameservers;

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
	protected $huapi_endpoint = 'https://hosting.uapi.newfold.com/v2/hosting/hosting-id/nameservers';

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
		$response = wp_remote_get(
			str_replace( 'hosting-id', 'WN.HP.xxxxxxxx', $this->huapi_endpoint ),
			array(
				'headers' => array( // the token will need to be get dynamically
					'Authorization' => 'Bearer xxx',
				),
			)
		);

		if ( is_wp_error( $response ) ) {
			return array(
				'records' => array(),
			);
		}

		if ( 200 !== wp_remote_retrieve_response_code( $response ) ) {
			return array(
				'records' => array(),
			);
		}

		$response     = json_decode( wp_remote_retrieve_body( $response ), true );
		$name_servers = array();

		if ( ! empty( $response['hosts'] ) ) {
			foreach ( $response['hosts'] as $index => $values ) {
				if ( ! empty( $values['host'] ) ) {
					$name_servers[] = $values['host'];
				}
			}
		}

		return array(
			'records' => $name_servers,
		);
	}
}
