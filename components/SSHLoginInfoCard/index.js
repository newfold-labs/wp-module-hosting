import InfoActionCard from '../InfoActionCard';
import getSSHLoginText from './getSSHLoginText';

const SSHLoginInfoCard = ( { sshLoginInfo, methods, platformUrl } ) => {
	const text = getSSHLoginText();

	const items = [
		{
			label: text.sshKeysLabel,
			infoText: text.sshKeysInfo,
			actionText: text.manageKeysAction,
			actionType: 'redirect',
			actionUrl: methods.addUtmParams( `${ platformUrl }/advanced` ),
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
