import { __, sprintf } from '@wordpress/i18n';

const getPHPVersionText = ( currentVersion, recommendedVersion ) => {
	const hasRecommendation = !! recommendedVersion;

	return {
		title: __( 'PHP Version', 'wp-module-hosting' ),
		noRecords: __(
			'Could not determine the PHP version',
			'wp-module-hosting'
		),
		versionInfo: hasRecommendation
			? sprintf(
					/* translators: 1: Current PHP version, 2: Recommended PHP version */
					__( '%1$s (%2$s Recommended)', 'wp-module-hosting' ),
					currentVersion,
					recommendedVersion
			  )
			: currentVersion,
		button: hasRecommendation
			? __( 'UPDATE', 'wp-module-hosting' )
			: __( 'MANAGE', 'wp-module-hosting' ),
	};
};

export default getPHPVersionText;
