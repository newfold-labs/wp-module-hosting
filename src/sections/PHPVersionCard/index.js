import InfoActionCard from '../InfoActionCard';
import getPHPVersionText from './getPHPVersionText';

const PHPVersionCard = ( { phpVersion = {}, platformUrl, methods } ) => {
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
				testId="php-version-card"
				dataAttributes={ { version: false } }
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
					actionUrl: getDeepLinkedPlatformUrl( 'advanced' ),
				},
			] }
			testId="php-version-card"
			dataAttributes={ { version: currentVersion } }
		/>
	);
};

export default PHPVersionCard;
