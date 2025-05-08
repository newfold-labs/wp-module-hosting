<?php

namespace NewfoldLabs\WP\Module\Hosting\PerformanceHealth;

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
		$result_value = 80;

		return array_merge(
			$this->get_datas_by_result_value( $result_value ),
			array(
				'resultValue' => $result_value,
			)
		);
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
