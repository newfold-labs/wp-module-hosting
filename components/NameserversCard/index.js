import InfoActionCard from '../InfoActionCard';
import getNameserversText from './getNameserversText';

const NameserversCard = ( { nameservers } ) => {
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
			} ) ) }
			infoText={ text.infoText }
		/>
	);
};

export default NameserversCard;
