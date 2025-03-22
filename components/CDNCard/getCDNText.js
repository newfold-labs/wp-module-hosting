import { __ } from '@wordpress/i18n';

const getCDNText = () => {
	return {
		title: __( 'CDN', 'wp-module-hosting' ),
		statusEnabled: __( 'CDN is enabled', 'wp-module-hosting' ),
		statusDisabled: __( 'CDN is NOT enabled', 'wp-module-hosting' ),
		descriptionEnabled: __(
			"Your site's static content is being cached.",
			'wp-module-hosting'
		),
		descriptionDisabled: __(
			"Your site's static content is NOT being cached.",
			'wp-module-hosting'
		),
		clearCacheButton: __( 'Clear Cache', 'wp-module-hosting' ),
		disableCDNButton: __( 'Disable Cache', 'wp-module-hosting' ),
		enableCDNButton: __( 'Enable CDN', 'wp-module-hosting' ),
		purgeSuccessTitle: __( 'CDN Cache Cleared', 'wp-module-hosting' ),
		purgeSuccessDescription: __(
			'Static content cache has been successfully cleared.',
			'wp-module-hosting'
		),
		purgeErrorTitle: __( 'CDN Purge Failed', 'wp-module-hosting' ),
		purgeErrorDescription: __(
			'We were unable to clear the CDN cache. Please try again.',
			'wp-module-hosting'
		),
	};
};

export default getCDNText;
