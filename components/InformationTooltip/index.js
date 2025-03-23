import { InformationCircleIcon } from '@heroicons/react/24/solid';

const InformationTooltip = ( { text, className = '' } ) => {
	if ( ! text ) return null;

	return (
		<div
			className={ `nfd-relative nfd-inline-block nfd-group ${ className }` }
		>
			<InformationCircleIcon className="nfd-h-5 nfd-w-5 nfd-text-gray-500 group-hover:nfd-text-gray-700 nfd-cursor-pointer" />
			<div className="nfd-absolute nfd-bottom-full nfd-left-1/2 -nfd-translate-x-1/2 nfd-mb-2 nfd-hidden group-hover:nfd-flex nfd-items-center nfd-bg-[#0E3E80] nfd-text-white nfd-text-xs nfd-font-semibold nfd-px-2 nfd-py-1 nfd-rounded-md nfd-whitespace-nowrap nfd-z-10 nfd-shadow-md">
				{ text }
				<div className="nfd-absolute nfd-left-1/2 -nfd-translate-x-1/2 nfd-w-0 nfd-h-0 nfd-border-l-4 nfd-border-l-transparent nfd-border-r-4 nfd-border-r-transparent nfd-border-t-4 nfd-border-t-[#0E3E80] nfd-top-full" />
			</div>
		</div>
	);
};

export default InformationTooltip;
