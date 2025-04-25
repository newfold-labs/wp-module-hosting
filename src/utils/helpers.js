import { NewfoldRuntime } from '@newfold/wp-module-runtime';
import { addQueryArgs } from '@wordpress/url';

/**
 * Decorates an external link URL with UTM params.
 *
 * The utm_term, if passed, should be the link anchor text.
 * The utm_content should be the unique identifier for the link.
 * The utm_campaign is optional and reserved for special occasions.
 *
 * @param {string} url    The original URL.
 * @param {Object} params The URL parameters to add.
 *
 * @return {string} The new URL.
 */
export const addUtmParams = ( url, params = {} ) => {
	params.utm_source = `wp-admin/admin.php?page=bluehost${ window.location.hash }`;
	params.utm_medium = 'bluehost_plugin';
	return addQueryArgs( url, params );
};

/**
 * Get's Base Platform URL
 * @param {string} path The path to a resource within the platform, leave blank for root.
 *
 * @return {string} The base URL for the platform.
 */
export const getPlatformBaseUrl = ( path = '' ) => {
	const brand = NewfoldRuntime.plugin.brand;

	const baseUrl = () => {
		if ( brand === 'Bluehost_India' ) {
			return 'https://my.bluehost.in';
		}

		if ( isJarvis() ) {
			return 'https://www.bluehost.com';
		}

		return 'https://my.bluehost.com';
	};

	return baseUrl() + path;
};

/**
 * Gets Platform URL
 *
 * @param {string} jarvisPath The path to the hosting resource for Jarvis accounts, leave blank for the main page.
 * @param {string} legacyPath The path to the hosting resource for Legacy accounts, leave blank for the main page.
 *
 * @return {string} The URL for the platform.
 *
 * @example
 * getPlatformPathUrl('home', 'app#home')
 * // returns https://www.bluehost.com/my-account/home if Jarvis or https://my.bluehost.com/hosting/app#home if legacy
 */
export const getPlatformPathUrl = ( jarvisPath = '', legacyPath = '' ) => {
	if ( isJarvis() ) {
		return getPlatformBaseUrl( '/my-account/' ) + jarvisPath;
	}

	return getPlatformBaseUrl( '/hosting/' ) + legacyPath;
};

/**
 * Check if this is a jarvis site or not.
 * Defaults to true in cases where the capabilites are not set such as
 * in local and test environments that do not receive capabilities.
 *
 * @return {boolean} Whether or not this is a jarvis site.
 */
export const isJarvis = () => {
	if ( window.NewfoldRuntime.capabilities.hasOwnProperty( 'isJarvis' ) ) {
		return NewfoldRuntime.hasCapability( 'isJarvis' );
	}
	return true;
};
