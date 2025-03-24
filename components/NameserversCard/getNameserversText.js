import { __ } from '@wordpress/i18n';

const getNameserversText = () => {
	return {
		title: __( 'Nameservers', 'wp-module-hosting' ),
		noRecords: __( 'No name servers found', 'wp-module-hosting' ),
		copyButton: __( 'COPY', 'wp-module-hosting' ),
		infoText: __(
			'Name servers work as a directory that translates domain names into IP addresses. Helps you to connect your website to different services.',
			'wp-module-hosting'
		),
	};
};

export default getNameserversText;
