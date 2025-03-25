<?php

namespace NewfoldLabs\WP\Module\Hosting\HostingPanel;

use NewfoldLabs\WP\Module\Hosting\CDNInfo\CDNInfo;
use WP_Error;
use NewfoldLabs\WP\Module\Hosting\HostingPanel\RestApi\RestApi;
use NewfoldLabs\WP\Module\Hosting\MalwareCheck\MalwareCheck;
use NewfoldLabs\WP\Module\Hosting\Permissions;
use NewfoldLabs\WP\Module\Hosting\ObjectCache\ObjectCache;
use NewfoldLabs\WP\Module\Hosting\PHPVersion\PHPVersion;
use NewfoldLabs\WP\Module\Hosting\Nameservers\Nameservers;
use NewfoldLabs\WP\Module\Hosting\PlanInfo\PlanInfo;
use NewfoldLabs\WP\Module\Hosting\SSHInfo\SSHInfo;

/**
 * Class HostingPanel
 *
 * Manages hosting panel features dynamically.
 */
class HostingPanel {

	/**
	 * Dependency container instance.
	 *
	 * @var mixed
	 */
	protected $container;

	/**
	 * Transient name to cache the full hosting panel response.
	 *
	 * @var string
	 */
	public static $transient_key = 'nfd_hosting_panel_data';

	/**
	 * List of feature class names.
	 *
	 * @var array
	 */
	protected $features = array(
		'object-cache'  => ObjectCache::class,
		'php-version'   => PHPVersion::class,
		'malware-check' => MalwareCheck::class,
		'nameservers'   => Nameservers::class,
		'ssh-info'      => SSHInfo::class,
		'cdn-info'      => CDNInfo::class,
		'plan-info'     => PlanInfo::class,
	);

	/**
	 * Holds instantiated feature objects.
	 *
	 * @var array
	 */
	protected $instances = array();

	/**
	 * HostingPanel constructor.
	 *
	 * @param mixed $container The dependency container instance.
	 */
	public function __construct( $container ) {
		$this->container = $container;
		$this->initialize_features();
		$this->maybe_initialize_rest_api();
	}

	/**
	 * Initializes all registered features.
	 */
	protected function initialize_features() {
		foreach ( $this->features as $identifier => $class_name ) {
			if ( class_exists( $class_name ) ) {
				$this->instances[ $identifier ] = new $class_name( $this->container );
			}
		}
	}

	/**
	 * Initializes the REST API routes if accessed via REST and user is an admin.
	 */
	protected function maybe_initialize_rest_api() {
		if ( Permissions::rest_is_authorized_admin() ) {
			new RestApi( $this );
		}
	}

	/**
	 * Registers a new feature dynamically.
	 *
	 * @param string $identifier The unique slug identifier for the feature.
	 * @param string $class_name The class name responsible for managing the feature.
	 */
	public function register_feature( $identifier, $class_name ) {
		if ( ! class_exists( $class_name ) ) {
			return new WP_Error(
				'invalid_class',
				__( 'Feature class does not exist.', 'wp-module-hosting' )
			);
		}

		$this->features[ $identifier ]  = $class_name;
		$this->instances[ $identifier ] = new $class_name( $this->container );
	}

	/**
	 * Retrieves hosting panel data dynamically from registered features.
	 *
	 * @return array Hosting panel data.
	 */
	public function get_data() {
		$cached = get_transient( self::$transient_key );

		if ( false !== $cached ) {
			$cached['__meta'] = array(
				'generated'  => $cached['__generated'] ?? time(),
				'from_cache' => true,
			);
			return $cached;
		}

		$data = array();
		foreach ( $this->instances as $identifier => $instance ) {
			if ( method_exists( $instance, 'get_data' ) ) {
				$data[ $identifier ] = $instance->get_data();
			}
		}

		$generated           = time();
		$data['__generated'] = $generated;
		$data['__meta']      = array(
			'generated'  => $generated,
			'from_cache' => false,
		);

		set_transient( self::$transient_key, $data, DAY_IN_SECONDS );

		return $data;
	}

	/**
	 * Flushes the cached hosting panel transient.
	 *
	 * @return bool True if the transient was deleted, false otherwise.
	 */
	public static function flush_cache() {
		return delete_transient( self::$transient_key );
	}

	/**
	 * Performs an action on a registered feature dynamically.
	 *
	 * @param string $identifier The feature identifier.
	 * @param string $action     The public function to call.
	 * @param array  $data       Optional data to pass to the method.
	 *
	 * @return mixed|WP_Error The function result or WP_Error.
	 */
	public function perform_action( $identifier, $action, $data = array() ) {
		if ( ! isset( $this->instances[ $identifier ] ) ) {
			return new WP_Error(
				'invalid_identifier',
				__( 'Invalid feature identifier.', 'wp-module-hosting' )
			);
		}

		$instance = $this->instances[ $identifier ];

		// Check if the requested action is a valid public method in the class
		if ( method_exists( $instance, $action ) && is_callable( array( $instance, $action ) ) ) {
			if ( ! empty( $data ) ) {
				return call_user_func( array( $instance, $action ), $data );
			}

			return call_user_func( array( $instance, $action ) );
		}

		return new WP_Error(
			'invalid_action',
			__( 'Action not supported.', 'wp-module-hosting' )
		);
	}
}
