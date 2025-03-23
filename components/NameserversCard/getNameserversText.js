import { __ } from '@wordpress/i18n';

const getNameserversText = () => {
	return {
		title: __( 'Nameservers', 'wp-module-hosting' ),
		noRecords: __( 'No name servers found', 'wp-module-hosting' ),
		copyButton: __( 'COPY', 'wp-module-hosting' ),
		infoText: __(
			'These are your current DNS nameservers',
			'wp-module-hosting'
		),
	};
};

export default getNameserversText;
