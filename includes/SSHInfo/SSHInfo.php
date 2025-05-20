<?php

namespace NewfoldLabs\WP\Module\Hosting\SSHInfo;

use NewfoldLabs\WP\Module\Hosting\Helpers\PlatformHelper;

use NewfoldLabs\WP\Module\Hosting\Helpers\HUAPIHelper;

/**
 * Handles SSH login information retrieval.
 */
class SSHInfo {

	/**
	 * Dependency container instance.
	 *
	 * @var mixed
	 */
	protected $container;


	/**
	 * API endpoint for SSH Info.
	 *
	 * @var string
	 */
	protected $huapi_shared_endpoint = array(
		'shared' => '/v1/hosting/hosting_id/ssh',
		'cloud'  => '/v2/sites/15704106/ssh-users',
	);

	/**
	 * SSHInfo constructor.
	 *
	 * @param mixed $container The dependency container instance.
	 */
	public function __construct( $container ) {
		$this->container = $container;
	}

	/**
	 * Retrieves SSH login info using the real server hostname and filesystem username.
	 *
	 * @return array SSH login data.
	 */
	public function get_data() {

		$customer_id = HUAPIHelper::get_customer_id();

		if ( is_wp_error( $customer_id ) ) {
			return null;
		}

		$is_atomic = PlatformHelper::is_atomic();

		$huapi_endpoint = PlatformHelper::is_atomic() ? $this->huapi_shared_endpoint['cloud'] : $this->huapi_shared_endpoint['shared'];

		$endpoint = str_replace( 'hosting_id', $customer_id, $huapi_endpoint );

		$helper   = new HUAPIHelper( $endpoint, array(), 'GET' );
		$response = $helper->send_request();

		if ( is_wp_error( $response ) ) {
			// error_log( 'Error in the API call: ' . $response->get_error_message() ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
			return null;
		}

		$data = json_decode( $response, true );

		if ( $is_atomic ) {
			if ( isset( $data['users'] ) && is_array( $data['users'] ) && count( $data['users'] ) > 0 ) {
				$ssh_info = $data['users'][0]['user'] . '@' . $data['users'][0]['ssh_hostname'];
			} else {
				$ssh_info = '';
			}
		} elseif ( isset( $data['credential'] ) ) {
				$ssh_info = $data['credential'];
		} else {
			$ip       = $data['ip'] ?? $this->get_host_ip_from_hostname();
			$username = $this->get_server_username();
			$ssh_info = $username && $ip ? "{$username}@{$ip}" : '';
		}

		return array(
			'ssh_info' => $ssh_info,
		);
	}

	/**
	 * Retrieves the IP address based on the server's hostname.
	 *
	 * @return string|null IP address or null if not found.
	 */
	private function get_host_ip_from_hostname() {
		$hostname = gethostname();
		$ip       = gethostbyname( $hostname );

		if ( empty( $ip ) || $ip === $hostname ) {
			return null;
		}

		return $ip;
	}

	/**
	 * Retrieves the server username from the WordPress installation path.
	 *
	 * @return string|null Server username or null if not found.
	 */
	private function get_server_username() {
		$absolute_path = ABSPATH;
		$parts         = explode( '/', trim( $absolute_path, '/' ) );

		return isset( $parts[1] ) ? $parts[1] : null;
	}
}
