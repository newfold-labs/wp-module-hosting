import { useState } from '@wordpress/element';

import {
	CheckBadgeIcon,
	ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { Spinner } from '@newfold/ui-component-library';

import { useDispatch } from '@wordpress/data';
import { STORE_NAME } from '../../data/constants';

import SiteStatusCard from '../SiteStatusCard';

import getCDNText from './getCDNText';

const CDNCard = ( { data, methods, platformUrl, isAtomic } ) => {
	const text = getCDNText();
	const [ isLoading, setIsLoading ] = useState( false );
	const { pushNotification } = useDispatch( STORE_NAME );

	const isEnabled = data.cdn_enabled;

	const getDeepLinkedPlatformUrl = ( path = '' ) => {
		if ( isAtomic ) {
			return methods.addUtmParams( platformUrl );
		}
		const hasSiteId = /\d+$/.test( platformUrl );
		const baseUrl =
			hasSiteId && path ? `${ platformUrl }/${ path }` : platformUrl;
		return methods.addUtmParams( baseUrl );
	};

	const handlePurge = async () => {
		setIsLoading( true );

		const apiUrl = methods.NewfoldRuntime.createApiUrl(
			'/newfold-hosting/v1/panel/update'
		);

		try {
			await methods.apiFetch( {
				url: apiUrl,
				method: 'POST',
				data: {
					identifier: 'cdn-info',
					action: 'purge',
				},
			} );

			pushNotification( 'cdn-purge-success', {
				title: text.purgeSuccessTitle,
				description: text.purgeSuccessDescription,
				variant: 'success',
				autoDismiss: 5000,
			} );
		} catch ( error ) {
			pushNotification( 'cdn-purge-error', {
				title: text.purgeErrorTitle,
				description: text.purgeErrorDescription,
				variant: 'error',
				autoDismiss: 5000,
			} );
		} finally {
			setIsLoading( false );
		}
	};

	return (
		<SiteStatusCard
			testId="cdn-info-card"
			title={ text.title }
			status={ isEnabled ? text.statusEnabled : text.statusDisabled }
			description={
				isEnabled ? text.descriptionEnabled : text.descriptionDisabled
			}
			primaryButtonText={
				isEnabled ? text.clearCacheButton : text.enableCDNButton
			}
			primaryButtonAction={
				isEnabled
					? handlePurge
					: () =>
							window.open(
								getDeepLinkedPlatformUrl( 'performance' ),
								'_blank'
							)
			}
			primaryButtonDisabled={ isLoading }
			primaryButtonContent={ isLoading ? <Spinner /> : null }
			secondaryButtonText={ isEnabled ? text.disableCDNButton : null }
			secondaryButtonAction={
				isEnabled
					? () =>
							window.open(
								getDeepLinkedPlatformUrl( 'performance' ),
								'_blank'
							)
					: null
			}
			Illustration={ () =>
				isEnabled ? (
					<CheckBadgeIcon
						width={ 48 }
						height={ 48 }
						className="nfd-text-green-500"
					/>
				) : (
					<ExclamationCircleIcon
						width={ 48 }
						height={ 48 }
						className="nfd-text-red-500"
					/>
				)
			}
		/>
	);
};

export default CDNCard;
