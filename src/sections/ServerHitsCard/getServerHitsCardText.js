import { __ } from '@wordpress/i18n';

const getServerHitsCardText = () => {
	return {
		title: __( 'Server Hits', 'wp-module-hosting' ),
		subtitle: __( 'Last 30 days', 'wp-module-hosting' ),
		messages: {
			normal: __(
				"You're within the normal range of server hits that your plan is designed for.",
				'wp-module-hosting'
			),
			nearing: __(
				"You're nearing the maximum number of hits that your plan is designed for.",
				'wp-module-hosting'
			),
			exceeded: __(
				"You've exceeded the maximum number of hits that your plan is designed for.",
				'wp-module-hosting'
			),
		},
		labels: {
			totalHits: __( 'Total Hits', 'wp-module-hosting' ),
			hitsAllotted: __( 'Hits Allotted', 'wp-module-hosting' ),
		},
		changePlan: __( 'CHANGE PLAN', 'wp-module-hosting' ),
	};
};

export default getServerHitsCardText;
