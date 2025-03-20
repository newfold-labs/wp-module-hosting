import InfoActionCard from '../InfoActionCard';
import getSSHLoginText from './getSSHLoginText';

const SSHLoginInfoCard = ( { sshLoginInfo, methods } ) => {
	const text = getSSHLoginText();

	// Generate platform URL dynamically
	const platformUrl = methods.addUtmParams(
		methods.getPlatformPathUrl( 'hosting/details', 'app/#/sites' )
	);

	const items = [
		{
			label: text.sshKeysLabel,
			infoText: text.sshKeysInfo,
			actionText: text.manageKeysAction,
			actionType: 'redirect',
			actionUrl: platformUrl,
		},
		{
			label: text.sshLoginLabel,
			value: sshLoginInfo || text.sshUnavailable,
			actionText: sshLoginInfo ? text.copyButton : '',
			actionType: sshLoginInfo ? 'copy' : '',
			onAction: sshLoginInfo
				? () => navigator.clipboard.writeText( sshLoginInfo )
				: null,
		},
	];

	return <InfoActionCard title={ text.title } items={ items } />;
};

export default SSHLoginInfoCard;
