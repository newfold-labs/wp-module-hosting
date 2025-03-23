import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { Card } from '@newfold/ui-component-library';

import InformationTooltip from '../InformationTooltip';

const InfoActionCard = ( { title, infoText, items } ) => {
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

	return (
		<Card className="nfd-relative nfd-overflow-visible nfd-p-6 nfd-border nfd-border-gray-200 nfd-rounded-lg">
			<div className="nfd-flex nfd-items-center nfd-space-x-2">
				<h3 className="nfd-text-lg nfd-font-medium">{ title }</h3>
				{ infoText && <InformationTooltip text={ infoText } /> }
			</div>

			<div className="nfd-mt-3">
				{ items.map(
					(
						{
							label,
							value,
							actionText,
							infoText: itemInfotext,
							actionType,
							actionUrl,
						},
						index
					) => (
						<div
							key={ index }
							className="nfd-flex nfd-items-center nfd-justify-between nfd-mb-2"
						>
							<div className="nfd-flex nfd-items-center nfd-space-x-2">
								{ label && (
									<p className="nfd-font-bold">{ label }</p>
								) }
								{ itemInfotext && (
									<InformationTooltip text={ itemInfotext } />
								) }
								<p className="nfd-text-gray-700 nfd-mr-2">
									{ value }
								</p>
								{ actionText && (
									<div className="nfd-relative">
										<button
											className="nfd-text-[#0E3E80] nfd-font-bold nfd-text-sm nfd-no-underline"
											onClick={ () =>
												handleAction(
													value,
													index,
													actionType,
													actionUrl
												)
											}
										>
											{ actionText }
										</button>
										{ actionType === 'copy' &&
											copiedIndex === index && (
												<div className="nfd-absolute nfd-bottom-full nfd-left-1/2 nfd-transform -nfd-translate-x-1/2 nfd-mb-2 nfd-bg-[#0E3E80] nfd-text-white nfd-text-xs nfd-font-semibold nfd-py-1 nfd-px-2 nfd-rounded-md nfd-shadow-md">
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
