import InfoActionCard from '../InfoActionCard';
import getNameserversText from './getNameserversText';

const NameserversCard = ( { nameservers, customClass } ) => {
	const text = getNameserversText();

	if (
		! nameservers ||
		! nameservers.records ||
		nameservers.records.length === 0
	) {
		return (
			<InfoActionCard
				title={ text.title }
				items={ [ { value: text.noRecords } ] }
				infoText={ text.infoText }
				customClass={customClass}
				dataRecord = {0}
				cyIsValid = {false}
			/>
		);
	}

	return (
		<InfoActionCard
			title={ text.title }
			items={ nameservers.records.map( ( ns ) => ( {
				value: ns,
				actionText: text.copyButton,
				actionType: 'copy',
				onAction: () => navigator.clipboard.writeText( ns ),
				cyIsValid : true
			} ) ) }
			infoText={ text.infoText }
			cyIsValid = { !! nameservers.records.length }
		/>
	);
};

export default NameserversCard;
