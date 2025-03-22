import InfoActionCard from '../InfoActionCard';
import getPHPVersionText from './getPHPVersionText';

const PHPVersionCard = ( { phpVersion, platformUrl } ) => {
	const text = getPHPVersionText(
		phpVersion.current_version,
		phpVersion.recommended_version
	);

	return (
		<InfoActionCard
			title={ text.title }
			items={ [
				{
					value: text.versionInfo,
					actionText: text.updateButton,
					actionType: 'redirect',
					actionUrl: platformUrl,
				},
			] }
		/>
	);
};

export default PHPVersionCard;
