import { __ } from '@wordpress/i18n';

const getPanelText = () => {
	return {
		loading: __(
			"Hang tight, we're gathering the latest info…",
			'wp-module-hosting'
		),
		error: __( 'Error:', 'wp-module-hosting' ),
		title: __( 'Hosting', 'wp-module-hosting' ),
		descriptionWithPlan:
			/* translators: %s: hosting plan name */
			__(
				"A general overview of your %s hosting plan and your site's performance.",
				'wp-module-hosting'
			),
		description: __(
			"A general overview of your hosting and your site's performance.",
			'wp-module-hosting'
		),
		planNameFallback: __( 'PLAN_NAME', 'wp-module-hosting' ),
		manageButton: __( 'Manage Hosting', 'wp-module-hosting' ),
	};
};

export default getPanelText;
