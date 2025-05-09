<?php

namespace NewfoldLabs\WP\Module\Hosting\PerformanceHealth;

use NewfoldLabs\WP\Module\Installer\Services\PluginInstaller;
use NewfoldLabs\WP\Module\Hosting\Helpers\APIHelper;
use NewfoldLabs\WP\Module\Hosting\HostingPanel\HostingPanel;

/**
 * Handles Performance & Health info retrieval.
 */
class PerformanceHealth {

	/**
	 * Dependency container instance.
	 *
	 * @var mixed
	 */
	protected $container;

	/**
	 * Nameservers constructor.
	 *
	 * @param mixed $container The dependency container instance.
	 */
	public function __construct( $container ) {
		$this->container = $container;
	}

	/**
	 * Retrieves site performance.
	 *
	 * @return array results.
	 */
	public function get_data() {
		$plugin_basename = $this->container->plugin()->brand;

		// Get existing panel transient
		$transient_key     = HostingPanel::$transient_key;
		$cached_data       = get_transient( $transient_key );
		$performance_value = 'unknown';

		if ( ! empty( $cached_data ) && isset( $cached_data['performance-health']['resultValue'] ) ) {
			$performance_value = $cached_data['performance-health']['resultValue'];
		}

		$base_values = array(
			'install_token'      => PluginInstaller::rest_get_plugin_install_hash(),
			'plugin'             => 'jetpack-boost',
			'urls'               => array(
				'jetpackBoostPage' => admin_url( 'admin.php?page=jetpack-boost' ),
				'supportPage' => admin_url( "admin.php?page={$plugin_basename}#/help" ),
			),
		);

		$performance_health = array_merge(
			$this->get_datas_by_result_value( $performance_value ),
			array(
				'value' => $performance_value,
			)
		);

		return array_merge(
			$base_values,
			array(
				'results' => $performance_health
			),
		);
	}

	/**
	 * Updates the performance health results.
	 *
	 * @param array $data The data to update.
	 * @return bool True on success, false on failure.
	 */
	public function update_performance_health( $data) {
		if ( empty( $data['value'] ) ) {
			return false;
		}

		$value        = sanitize_text_field( $data['value'] );
		$transient_key = HostingPanel::$transient_key;
		$cached_data   = get_transient( $transient_key );

		if ( ! empty( $cached_data ) && is_array( $cached_data ) ) {
			$performance_health_results = array_merge(
				$this->get_datas_by_result_value( $value ),
				array(
					'value' => $value,
				)
			);
			$cached_data['performance-health']['results'] = $performance_health_results;
			set_transient( $transient_key, $cached_data, DAY_IN_SECONDS );
			return $performance_health_results;
		}

		return false;
	}

	/**
	 * Retrieves the performance health status.
	 *
	 * @param int $value The performance value.
	 * @return string The performance health status.
	 */
	public function get_datas_by_result_value( $value ) {
		$status      = array(
			'very_good' => __( 'Very Good!', 'wp-module-hosting' ),
			'good'      => __( 'Good', 'wp-module-hosting' ),
			'warning'   => __( 'Warning', 'wp-module-hosting' ),
			'critical'  => __( 'Critical', 'wp-module-hosting' ),
		);
		$description = array(
			'very_good' => __( 'Your site\'s performance is looking good!', 'wp-module-hosting' ),
			'good'      => __( 'Your site\'s performance is Good', 'wp-module-hosting' ),
			'warning'   => __( 'Your site\'s performance could be better', 'wp-module-hosting' ),
			'critical'  => __( 'Your site\'s performance is Critical', 'wp-module-hosting' ),
		);
		$color       = array(
			'very_good' => '#4CAF50',
			'good'      => '#4CAF50',
			'warning'   => '#FF9800',
			'critical'  => '#F44336',
		);

		if ( $value >= 90 ) {
			return array(
				'status'      => $status['very_good'],
				'description' => $description['very_good'],
				'color'       => $color['very_good'],
			);
		} elseif ( $value >= 80 ) {
			return array(
				'status'      => $status['good'],
				'description' => $description['good'],
				'color'       => $color['good'],
			);
		} elseif ( $value >= 50 ) {
			return array(
				'status'      => $status['warning'],
				'description' => $description['warning'],
				'color'       => $color['warning'],
			);
		} else {
			return array(
				'status'      => $status['critical'],
				'description' => $description['critical'],
				'color'       => $color['critical'],
			);
		}
	}
}
