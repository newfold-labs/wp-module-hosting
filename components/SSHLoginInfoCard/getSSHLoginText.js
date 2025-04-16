import { __ } from '@wordpress/i18n';

const getSSHLoginText = () => {
	return {
		title: __( 'SSH Login Info', 'wp-module-hosting' ),
		sshKeysLabel: __( 'SSH Keys', 'wp-module-hosting' ),
		sshKeysInfo: __(
			'SSH provides a secure way to access the web server over CLI to run server commands through a terminal.',
			'wp-module-hosting'
		),
		manageKeysAction: __( 'Manage keys', 'wp-module-hosting' ),
		sshLoginLabel: __( 'SSH Login:', 'wp-module-hosting' ),
		sshUnavailable: __( 'SSH info unavailable', 'wp-module-hosting' ),
		copyButton: __( 'Copy', 'wp-module-hosting' ),
	};
};

export default getSSHLoginText;
