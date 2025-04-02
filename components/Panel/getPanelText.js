import { __ } from '@wordpress/i18n';

const getPanelText = () => {
	return {
		loading: __(
			"Hang tight, we're gathering the latest info…",
			'wp-module-hosting'
		),
		error: __( 'Error:', 'wp-module-hosting' ),
		title: __( 'Hosting', 'wp-module-hosting' ),
		planNameFallback: __( 'PLAN_NAME', 'wp-module-hosting' ),
		manageButton: __( 'Manage', 'wp-module-hosting' ),
	};
};

export default getPanelText;
