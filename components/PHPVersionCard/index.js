import InfoActionCard from '../InfoActionCard';
import getPHPVersionText from './getPHPVersionText';

const PHPVersionCard = ( { phpVersion = {}, platformUrl } ) => {
	const {
		current_version: currentVersion,
		recommended_version: recommendedVersion,
	} = phpVersion;

	if ( ! currentVersion ) {
		return null;
	}

	const text = getPHPVersionText( currentVersion, recommendedVersion );

	return (
		<InfoActionCard
			title={ text.title }
			items={ [
				{
					value: text.versionInfo,
					actionText: text.button,
					actionType: 'redirect',
					actionUrl: platformUrl,
				},
			] }
		/>
	);
};

export default PHPVersionCard;
