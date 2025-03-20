import { __ } from '@wordpress/i18n';

const getSSHLoginText = () => {
	return {
		title: __( 'SSH Login Info', 'wp-module-hosting' ),
		sshKeysLabel: __( 'SSH Keys', 'wp-module-hosting' ),
		sshKeysInfo: __( 'Manage your SSH keys', 'wp-module-hosting' ),
		manageKeysAction: __( 'MANAGE KEYS', 'wp-module-hosting' ),
		sshLoginLabel: __( 'SSH Login:', 'wp-module-hosting' ),
		sshUnavailable: __( 'SSH info unavailable', 'wp-module-hosting' ),
		copyButton: __( 'COPY', 'wp-module-hosting' ),
	};
};

export default getSSHLoginText;
