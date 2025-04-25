import { __ } from '@wordpress/i18n';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import reactStringReplace from 'react-string-replace';

const formatTimeAgo = ( timestamp ) => {
	if ( timestamp < 1e12 ) {
		timestamp *= 1000;
	}

	const secondsAgo = Math.floor( ( Date.now() - timestamp ) / 1000 );

	if ( secondsAgo < 60 ) {
		return __( 'just now', 'wp-module-hosting' );
	} else if ( secondsAgo < 3600 ) {
		const minutes = Math.floor( secondsAgo / 60 );
		return sprintf(
			// translators: %d is the number of minutes ago
			__( '%d minute(s) ago', 'wp-module-hosting' ),
			minutes
		);
	} else if ( secondsAgo < 86400 ) {
		const hours = Math.floor( secondsAgo / 3600 );

		return sprintf(
			// translators: %d is the number of hours ago
			__( '%d hour(s) ago', 'wp-module-hosting' ),
			hours
		);
	}

	const days = Math.floor( secondsAgo / 86400 );

	return sprintf(
		// translators: %d is the number of days ago
		__( '%d day(s) ago', 'wp-module-hosting' ),
		days
	);
};

const DataRefreshInfo = ( { timestamp, onRefresh } ) => {
	if ( ! timestamp || typeof timestamp !== 'number' ) {
		return null;
	}

	const timeAgo = formatTimeAgo( timestamp );

	return (
		<div className="nfd-flex nfd-items-center nfd-gap-4 nfd-text-sm nfd-text-black nfd-mt-2">
			<span className="nfd-font-bold" data-testid="nfd-data-refresh-time">
				{ reactStringReplace(
					/* translators: %s is the relative time since last refresh, like "5 minutes ago" */
					__( 'Last updated: %s', 'wp-module-hosting' ),
					/%s/,
					( match, i, _, key ) => (
						<span key={ i } className="nfd-font-normal">
							{ timeAgo }
						</span>
					)
				) }
			</span>
			<button
				className="nfd-group nfd-flex nfd-items-center nfd-gap-2 nfd-text-[#196bde] nfd-font-medium hover:nfd-underline hover:nfd-text[#1a4884]"
				data-testid="nfd-data-refresh-button"
				onClick={ onRefresh }
			>
				<ArrowPathIcon className="nfd-duration-300 nfd-w-[16px] group-hover:nfd-rotate-180" />
				{ __( 'Refresh', 'wp-module-hosting' ) }
			</button>
		</div>
	);
};

export default DataRefreshInfo;
