import InfoActionCard from '../InfoActionCard';
import getPHPVersionText from './getPHPVersionText';

const PHPVersionCard = ( { phpVersion = {}, platformUrl, methods } ) => {
	const {
		current_version: currentVersion,
		recommended_version: recommendedVersion,
	} = phpVersion;

	const text = getPHPVersionText( currentVersion, recommendedVersion );

	if ( ! currentVersion ) {
		return (
			<InfoActionCard
				title={ text.title }
				items={ [ { value: text.noRecords } ] }
			/>
		);
	}

	return (
		<InfoActionCard
			title={ text.title }
			items={ [
				{
					value: text.versionInfo,
					actionText: text.button,
					actionType: 'redirect',
					actionUrl: methods.addUtmParams(
						`${ platformUrl }/settings`
					),
				},
			] }
		/>
	);
};

export default PHPVersionCard;
