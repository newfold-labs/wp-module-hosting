import { __ } from '@wordpress/i18n';

const getPerformanceHealthText = () => {
	return {
		title: __( 'Performance & Health', 'wp-module-hosting' ),
		jetpackBoost: {
			installationFailed: __( 'Jetpack boost Installation Failed', 'wp-module-hosting' ),
		},
		buttons: {
			boost: __( 'Boost Your Site', 'wp-module-hosting' ),
			learnMore: __( 'Learn More', 'wp-module-hosting' ),
		},
	};
};

export default getPerformanceHealthText;
