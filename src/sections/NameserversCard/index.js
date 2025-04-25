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
				testId={'nameservers-card-no-records' }
			/>
		);
	}

	return (
		<InfoActionCard
			title={ text.title }
			items={ nameservers.records.map( ( ns, i ) => ( {
				key: `ns-${ i }`,
				value: ns,
				actionText: text.copyButton,
				actionType: 'copy',
				onAction: () => navigator.clipboard.writeText( ns ),
			} ) ) }
			infoText={ text.infoText }
			testId={'nameservers-card' }
		/>
	);
};

export default NameserversCard;
