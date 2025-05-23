import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { Card } from '@newfold/ui-component-library';

import InformationTooltip from '../InformationTooltip';

const InfoActionCard = ( { title, infoText, items, testId, dataAttributes = {} } ) => {
	const [ copiedIndex, setCopiedIndex ] = useState( null );

	const handleAction = ( value, index, actionType, actionUrl ) => {
		if ( actionType === 'copy' ) {
			window.navigator.clipboard.writeText( value );
			setCopiedIndex( index );

			setTimeout( () => {
				setCopiedIndex( null );
			}, 2000 );
		} else if ( actionType === 'redirect' ) {
			window.open( actionUrl, '_blank', 'noopener,noreferrer' );
		}
	};

	const dynamicDataAttributes = Object.entries( dataAttributes ).reduce(
		( acc, [ key, value ] ) => {
			acc[ `data-${ key }` ] = value;
			return acc;
		},
		{}
	);

	return (
		<Card
			className="nfd-relative nfd-overflow-visible nfd-p-6 nfd-border nfd-border-gray-200 nfd-rounded-lg"
			data-testid={ testId }
			{ ...dynamicDataAttributes }
		>
			<div className="nfd-flex nfd-items-center nfd-space-x-2">
				<h3 className="nfd-text-lg nfd-font-medium">{ title }</h3>
				{ infoText && <InformationTooltip text={ infoText }/> }
			</div>

			<div className="nfd-mt-3">
				{ items.map(
					(
						{
							label,
							value,
							actionIcon: ActionIcon,
							actionText,
							infoText: itemInfotext,
							actionType,
							actionUrl,
							id,
						},
						index
					) => (
						<div
							key={ index }
							id={ id }
							className="info-item nfd-flex nfd-items-center nfd-justify-between nfd-mb-2"
						>
							<div className="nfd-flex nfd-items-center nfd-space-x-2">
								{ label && (
									<p className="nfd-font-bold">{ label }</p>
								) }
								{ itemInfotext && (
									<InformationTooltip text={ itemInfotext }/>
								) }
								<p className="nfd-info-action-card-value nfd-text-gray-700 nfd-mr-2">
									{ value }
								</p>
								{ (actionText || ActionIcon) && (
									<div className="nfd-relative">
										<button
											className="nfd-text-[#196bde] nfd-flex nfd-items-center nfd-gap-2 nfd-text-sm nfd-no-underline hover:nfd-text[#1a4884]"
											data-action={ actionType }
											onClick={ () =>
												handleAction(
													value,
													index,
													actionType,
													actionUrl
												)
											}
										>
											{ !! ActionIcon && <ActionIcon className="nfd-w-[20px] nfd-stroke-[1.25]"/> }
											{ actionText }
										</button>
										{ actionType === 'copy' &&
											copiedIndex === index && (
												<div className="nfd-button-copied nfd-absolute nfd-bottom-full nfd-left-1/2 nfd-transform -nfd-translate-x-1/2 nfd-mb-2 nfd-bg-[#0E3E80] nfd-text-white nfd-text-xs nfd-font-semibold nfd-py-1 nfd-px-2 nfd-rounded-md nfd-shadow-md">
													{ __(
														'Copied!',
														'wp-module-hosting'
													) }
													<div className="nfd-absolute nfd-left-1/2 nfd-transform -nfd-translate-x-1/2 nfd-w-0 nfd-h-0 nfd-border-l-4 nfd-border-l-transparent nfd-border-r-4 nfd-border-r-transparent nfd-border-t-4 nfd-border-t-[#0E3E80] nfd-top-full"></div>
												</div>
											) }
									</div>
								) }
							</div>
						</div>
					)
				) }
			</div>
		</Card>
	);
};

export default InfoActionCard;
