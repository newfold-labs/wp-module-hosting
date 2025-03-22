import { __, sprintf } from '@wordpress/i18n';

const getPHPVersionText = ( currentVersion, recommendedVersion ) => {
	return {
		title: __( 'PHP Version', 'wp-module-hosting' ),
		versionInfo: sprintf(
			/* translators: 1: Current PHP version, 2: Recommended PHP version */
			__( '%1$s (%2$s Recommended)', 'wp-module-hosting' ),
			currentVersion,
			recommendedVersion
		),
		updateButton: __( 'UPDATE', 'wp-module-hosting' ),
	};
};

export default getPHPVersionText;
