import InfoActionCard from '../InfoActionCard';
import getSSHLoginText from './getSSHLoginText';

const SSHLoginInfoCard = ( {
	sshLoginInfo,
	methods,
	platformUrl,
	isAtomic,
	customClass
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
			cyIsValid : true,
		},
		{
			label: text.sshLoginLabel,
			value: sshLoginInfo || text.sshUnavailable,
			actionText: sshLoginInfo ? text.copyButton : '',
			actionType: sshLoginInfo ? 'copy' : '',
			onAction: sshLoginInfo
				? () => navigator.clipboard.writeText( sshLoginInfo )
				: null,
			id: 'nfd-hosting-copy-ssh-login',
			cyIsValid : !!sshLoginInfo,
		},
	];

	return <InfoActionCard title={ text.title } items={ items } customClass={customClass} cyIsValid={ items.length > 0 }/>;
};

export default SSHLoginInfoCard;
