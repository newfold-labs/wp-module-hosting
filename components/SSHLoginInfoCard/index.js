import InfoActionCard from '../InfoActionCard';
import getSSHLoginText from './getSSHLoginText';

const SSHLoginInfoCard = ( {
	sshLoginInfo,
	methods,
	platformUrl,
	isAtomic,
} ) => {
	const text = getSSHLoginText();

	const getDeepLinkedPlatformUrl = ( path = '' ) => {
		if ( isAtomic ) {
			path = 'ssh/users';
		}
		const hasSiteId = /\d+$/.test( platformUrl );
		const baseUrl =
			hasSiteId && path ? `${ platformUrl }/${ path }` : platformUrl;
		return methods.addUtmParams( baseUrl );
	};

	const items = [
		{
			label: text.sshKeysLabel,
			infoText: text.sshKeysInfo,
			actionText: text.manageKeysAction,
			actionType: 'redirect',
			actionUrl: getDeepLinkedPlatformUrl( 'advanced' ),
			id: 'nfd-hosting-manage-keys',
		},
		{
			label: text.sshLoginLabel,
			value: sshLoginInfo || text.sshUnavailable,
			actionText: sshLoginInfo ? text.copyButton : '',
			actionType: sshLoginInfo ? 'copy' : '',
			onAction: sshLoginInfo
				? () => navigator.clipboard.writeText( sshLoginInfo )
				: null,
			id: 'nfd-hosting-ssh-login-info',
		},
	];



	return <InfoActionCard title={ text.title } items={ items } testId="ssh-login-info-card" testSSHLoginInfoAvailable={ items.length > 0 } />;
};

export default SSHLoginInfoCard;
