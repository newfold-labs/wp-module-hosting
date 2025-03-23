import { __, sprintf } from '@wordpress/i18n';

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
	if ( ! timestamp || typeof timestamp !== 'number' ) return null;

	const timeAgo = formatTimeAgo( timestamp );

	return (
		<div className="nfd-flex nfd-items-center nfd-gap-2 nfd-text-sm nfd-text-gray-500 nfd-mt-2">
			<span>
				{ sprintf(
					/* translators: %s is the relative time since last refresh, like "5 minutes ago" */
					__( 'Last updated %s', 'wp-module-hosting' ),
					timeAgo
				) }
			</span>
			<button
				className="nfd-text-[#0E3E80] nfd-font-medium hover:nfd-underline"
				onClick={ onRefresh }
			>
				{ __( 'Refresh', 'wp-module-hosting' ) }
			</button>
		</div>
	);
};

export default DataRefreshInfo;
