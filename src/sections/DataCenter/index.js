import InfoActionCard from '../InfoActionCard';
import getDataCenterText from './getDataCenterText';

const DataCenterCard = ( { serverLocation, platformUrl, methods } ) => {
	const text = getDataCenterText();

	if (
		! serverLocation ||
		'' === serverLocation
	) {
		return (
			<InfoActionCard
				title={ text.title }
				items={ [ { value: text.noRecords } ] }
				infoText={ text.infoText }
				testId={'datacenter-card-no-records' }
			/>
		);
	}

	const getDeepLinkedPlatformUrl = ( path = '' ) => {
		const hasSiteId = /\d+$/.test( platformUrl );
		const baseUrl = hasSiteId && path ? `${ platformUrl }/${ path }` : platformUrl;
		return methods.addUtmParams( baseUrl );
	};

	return (
		<InfoActionCard
			title={ text.title }
			items={ [ {
				key: 'ns-0',
				value: serverLocation,
				actionText: text.viewButton,
				actionType: 'redirect',
				actionUrl: getDeepLinkedPlatformUrl( 'advanced' ),
			} ] }
			infoText={ text.infoText }
			testId={'datacenter-card' }
		/>
	);
};

export default DataCenterCard;
