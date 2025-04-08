import InfoActionCard from '../InfoActionCard';
import getPHPVersionText from './getPHPVersionText';

const PHPVersionCard = ( { phpVersion = {}, platformUrl, methods, customClass } ) => {
	const {
		current_version: currentVersion,
		recommended_version: recommendedVersion,
	} = phpVersion;

	const text = getPHPVersionText( currentVersion, recommendedVersion );

	const getDeepLinkedPlatformUrl = ( path = '' ) => {
		const hasSiteId = /\d+$/.test( platformUrl );
		const baseUrl =
			hasSiteId && path ? `${ platformUrl }/${ path }` : platformUrl;
		return methods.addUtmParams( baseUrl );
	};

	if ( ! currentVersion ) {
		return (
			<InfoActionCard
				title={ text.title }
				items={ [ { value: text.noRecords } ] }
				customClass={customClass}
				cyIsValid = {false}
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
					actionUrl: getDeepLinkedPlatformUrl( 'settings' ),
				},
			] }
			customClass={customClass}
			cyIsValid = {true}
		/>
	);
};

export default PHPVersionCard;
