<?php

namespace NewfoldLabs\WP\Module\Hosting\PlanInfo;

use NewfoldLabs\WP\Module\Hosting\Helpers\HUAPIHelper;
use NewfoldLabs\WP\Module\Hosting\Helpers\PlatformHelper;

/**
 * Handles Plan information retrieval.
 */
class PlanInfo {
	/**
	 * Dependency container instance.
	 *
	 * @var mixed
	 */
	protected $container;

	/**
	 * PlanInfo constructor.
	 *
	 * @param mixed $container The dependency container instance.
	 */
	public function __construct( $container ) {
		$this->container = $container;
	}

	/**
	 * Retrieves and enhances the customer's hosting plan info.
	 *
	 * @return array
	 */
	public function get_data() {
		// Fetch customer_id (used as hosting_id in HUAPI)
		$customer_id = HUAPIHelper::get_customer_id();
		if ( is_wp_error( $customer_id ) ) {
			return array(
				'is_atomic' => PlatformHelper::is_atomic(),
			);
		}

		// Build and send the HUAPI request
		$endpoint = sprintf( '/v1/hosting/%s', $customer_id );
		$helper   = new HUAPIHelper( $endpoint, array(), 'GET' );
		$response = $helper->send_request();

		if ( is_wp_error( $response ) ) {
			return array(
				'is_atomic' => PlatformHelper::is_atomic(),
			);
		}

		$data = json_decode( $response, true );
		if ( ! is_array( $data ) ) {
			return array(
				'is_atomic' => PlatformHelper::is_atomic(),
			);
		}

		// Extract the product_name as the plan_name
		$plan_name = $data['billing']['product_name'] ?? null;

		return array(
			'plan_name' => $plan_name,
			'is_atomic' => PlatformHelper::is_atomic(),
		);
	}
}
