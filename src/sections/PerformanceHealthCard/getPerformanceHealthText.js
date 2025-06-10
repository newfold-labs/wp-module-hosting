import { __ } from '@wordpress/i18n';

const getPerformanceHealthText = () => {
	return {
		title: __( 'Performance & Health', 'wp-module-hosting' ),
		jetpackBoost: {
			installationFailed: __( 'Jetpack boost Installation Failed', 'wp-module-hosting' ),
		},
		loading: __( 'Loading...', 'wp-module-hosting' ),
		errors: {
			title: __( 'Status Unknown', 'wp-module-hosting' ),
			description: __( 'The current Performance & Health status could not be determined', 'wp-module-hosting' ),
			failToRetrieveData: __( 'Failed to retrieve data', 'wp-module-hosting' ),
		},
		buttons: {
			boost: __( 'Boost Your Site', 'wp-module-hosting' ),
			learnMore: __( 'Learn More', 'wp-module-hosting' ),
		},
	};
};

export default getPerformanceHealthText;
