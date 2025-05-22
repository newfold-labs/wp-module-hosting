import { Card, Link } from '@newfold/ui-component-library';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
} from 'recharts';
import {
	ArrowUpIcon,
	ArrowDownIcon,
	ExclamationTriangleIcon,
	ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import getServerHitsCardText from './getServerHitsCardText';

const ServerHitsCard = ( {
	data,
	totalHits,
	hitsAllotted,
	percentageChange,
	platFormUrl,
} ) => {
	const { title, subtitle, messages, changePlan, labels } =
		getServerHitsCardText();

	totalHits = Number( totalHits );
	hitsAllotted = Number( hitsAllotted );

	let barColor = '#196BDE';
	let textColor = 'nfd-text-gray-500';
	let warningIcon = null;
	let warningText = messages.normal;

	if ( totalHits > hitsAllotted ) {
		barColor = '#DC2626';
		textColor = 'nfd-text-red-600';
		warningIcon = (
			<ExclamationCircleIcon className="nfd-inline nfd-w-5 nfd-h-5 nfd-text-red-600 nfd-mr-1" />
		);
		warningText = messages.exceeded;
	} else if ( totalHits > hitsAllotted * 0.9 ) {
		barColor = '#F59E0B';
		textColor = 'nfd-text-yellow-600';
		warningIcon = (
			<ExclamationTriangleIcon className="nfd-inline nfd-w-5 nfd-h-5 nfd-text-yellow-600 nfd-mr-1" />
		);
		warningText = messages.nearing;
	}

	return (
		<Card className="nfd-p-6 nfd-border nfd-border-gray-200 nfd-rounded-lg">
			<div className="nfd-flex nfd-justify-between nfd-items-center">
				<div className="nfd-text-left">
					<h3 className="nfd-text-lg nfd-font-medium">{ title }</h3>
					<p className="nfd-text-sm nfd-text-gray-500">
						{ subtitle }
					</p>
				</div>
				<div
					className={ `nfd-flex nfd-items-center ${
						percentageChange >= 0
							? 'nfd-text-green-500'
							: 'nfd-text-red-500'
					} nfd-font-semibold` }
				>
					{ percentageChange >= 0 ? (
						<ArrowUpIcon className="nfd-h-4 nfd-w-4 nfd-mr-1" />
					) : (
						<ArrowDownIcon className="nfd-h-4 nfd-w-4 nfd-mr-1" />
					) }
					<span className="nfd-text-sm">
						{ percentageChange.toFixed( 1 ) }%
					</span>
				</div>
			</div>

			<div className="nfd-mb-2 nfd-mt-10" style={ { height: 80 } }>
				<ResponsiveContainer width="100%" height="100%">
					<BarChart
						data={ data }
						margin={ { top: 5, right: 0, left: 0, bottom: 0 } }
						barCategoryGap={ 0 }
						barGap={ 0 }
					>
						<XAxis dataKey="name" hide />
						<YAxis hide />
						<Tooltip cursor={ { fill: 'transparent' } } />
						<Bar dataKey="hits" fill={ barColor } />
					</BarChart>
				</ResponsiveContainer>
			</div>

			<div className="nfd-text-center nfd-mb-4">
				<p className="nfd-text-lg nfd-font-bold nfd-inline-block">
					{ labels.totalHits }: { totalHits.toLocaleString() }
				</p>
				<p className="nfd-text-sm nfd-text-gray-500">
					{ labels.hitsAllotted }: { hitsAllotted.toLocaleString() }
				</p>
			</div>

			<p
				className={ `nfd-text-sm ${ textColor } nfd-flex nfd-items-center` }
			>
				{ warningIcon } { warningText }
			</p>

			<div className="nfd-flex nfd-flex-row nfd-justify-end nfd-mt-4">
				<Link
					href={ platFormUrl }
					target="_blank"
					rel="noopener noreferrer"
					className="nfd-text-[#0E3E80] nfd-font-bold nfd-text-md nfd-no-underline"
				>
					{ changePlan }
				</Link>
			</div>
		</Card>
	);
};

export default ServerHitsCard;
