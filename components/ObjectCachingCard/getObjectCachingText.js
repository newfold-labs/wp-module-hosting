import { __ } from '@wordpress/i18n';

const getObjectCachingText = () => {
	return {
		title: __( 'Object Caching', 'wp-module-hosting' ),
		status: {
			enabled: __( 'Object Caching is enabled', 'wp-module-hosting' ),
			disabled: __(
				'Object Caching is NOT enabled',
				'wp-module-hosting'
			),
			not_setup: __( 'Object Caching is NOT setup', 'wp-module-hosting' ),
		},
		description: {
			enabled: __(
				"Your site's data is being cached.",
				'wp-module-hosting'
			),
			disabled: __(
				"Your site's data is NOT being cached.",
				'wp-module-hosting'
			),
			not_setup: __(
				"Your site's data is NOT being cached.",
				'wp-module-hosting'
			),
		},
		buttons: {
			clearCache: __( 'Clear Object Cache', 'wp-module-hosting' ),
			enable: __( 'Enable Object Caching', 'wp-module-hosting' ),
			disable: __( 'Disable Object Cache', 'wp-module-hosting' ),
			learnMore: __( 'Learn more', 'wp-module-hosting' ),
		},
		notifications: {
			updateError: {
				title: __(
					'Object Caching Update Failed',
					'wp-module-hosting'
				),
				description: __(
					'There was an error updating the object caching settings. Please try again.',
					'wp-module-hosting'
				),
			},
			actionSuccess: __(
				'Action executed successfully',
				'wp-module-hosting'
			),
		},
	};
};

export default getObjectCachingText;
