<?php

namespace NewfoldLabs\WP\Module\Hosting\SSHInfo;

use NewfoldLabs\WP\Module\Hosting\Helpers\PlatformHelper;

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
	 * SSHInfo constructor.
	 *
	 * @param mixed $container The dependency container instance.
	 */
	public function __construct( $container ) {
		$this->container = $container;
	}

	/**
	 * Retrieves site URL, fetches the IP, and constructs SSH login info.
	 *
	 * @return array SSH login data.
	 */
	public function get_data() {
		// Use the helper to check if the platform is 'atomic'
		if ( PlatformHelper::is_atomic() ) {
			return array(
				'ssh_info' => 'unavailable',
			);
		}

		$site_url = wp_parse_url( get_site_url(), PHP_URL_HOST );
		$ip       = $this->get_host_ip( $site_url );
		$username = $this->get_server_username();
		$ssh_info = $username && $ip ? "{$username}@{$ip}" : 'SSH info unavailable';

		return array(
			'ssh_info' => $ssh_info,
		);
	}

	/**
	 * Retrieves the IP address for the given domain, falling back to name server IP if needed.
	 *
	 * @param string $domain The domain to check.
	 * @return string|null IP address or null if not found.
	 */
	private function get_host_ip( $domain ) {
		// Try fetching IP from A record
		$dns_records = dns_get_record( $domain, DNS_A );
		if ( ! empty( $dns_records ) ) {
			return $dns_records[0]['ip'];
		}

		// If A record fails, try extracting the IP from the NS record
		$ns_records = dns_get_record( $domain, DNS_NS );
		if ( ! empty( $ns_records ) ) {
			foreach ( $ns_records as $ns ) {
				$ns_ip = dns_get_record( $ns['target'], DNS_A ); // Get the IP of the name server
				if ( ! empty( $ns_ip ) ) {
					return $ns_ip[0]['ip']; // Return first available IP
				}
			}
		}

		// No IP found
		return null;
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
