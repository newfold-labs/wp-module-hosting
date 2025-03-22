<?php

namespace NewfoldLabs\WP\Module\Hosting\HostingPanel\RestApi;

/**
 * Class RestApi
 *
 * Handles the registration of custom REST API routes
 */
final class RestApi {
	/**
	 * An array of controller class names that manage REST API routes.
	 *
	 * @var array $controllers
	 */
	protected $controllers = array(
		'NewfoldLabs\\WP\\Module\\Hosting\\HostingPanel\\RestApi\\Controllers\\HostingPanelController',
	);

	/**
	 * Constructor to initialize the custom REST API.
	 */
	public function __construct() {
		// Hook the 'rest_api_init' action to register custom routes
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	/**
	 * Register the custom REST API routes.
	 */
	public function register_routes() {
		foreach ( $this->controllers as $controller ) {
			$instance = new $controller();
			$instance->register_routes();
		}
	}
}
