import { __ } from '@wordpress/i18n';

const getDataCenterText = () => {
	return {
		title: __( 'Server Location', 'wp-module-hosting' ),
		noRecords: __( 'No server location found', 'wp-module-hosting' ),
		viewButton: __( 'View Details', 'wp-module-hosting' ),
		infoText: __(
			'Shows the current location of the server, which may be relevant for understanding data residency and latency.',
			'wp-module-hosting'
		),
	};
};

export default getDataCenterText;
