import { useState } from '@wordpress/element';

import {
	CheckBadgeIcon,
	ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { Spinner } from '@newfold/ui-component-library';

import getObjectCachingText from './getObjectCachingText';
import SiteStatusCard from '../SiteStatusCard';

const ObjectCachingCard = ( {
	objectCachingStatus,
	platformUrl,
	methods,
	isAtomic,
} ) => {
	const [ status, setStatus ] = useState( objectCachingStatus );
	const [ isLoading, setIsLoading ] = useState( false );
	const notify = methods.useNotification();
	const text = getObjectCachingText();

	const getDeepLinkedPlatformUrl = ( path = '' ) => {
		if ( isAtomic ) {
			path = 'performance';
		}
		const hasSiteId = /\d+$/.test( platformUrl );
		const baseUrl =
			hasSiteId && path ? `${ platformUrl }/${ path }` : platformUrl;
		return methods.addUtmParams( baseUrl );
	};

	const handleObjectCachingAction = async ( action ) => {
		setIsLoading( true );

		const apiUrl = methods.NewfoldRuntime.createApiUrl(
			'/newfold-hosting/v1/panel/update'
		);

		try {
			await methods.apiFetch( {
				url: apiUrl,
				method: 'POST',
				data: {
					identifier: 'object-cache',
					action,
				},
			} );

			if ( action === 'enable' ) {
				setStatus( 'enabled' );
			} else if ( action === 'disable' ) {
				setStatus( 'disabled' );
			} else if ( action === 'clear' ) {
				notify.push( 'object-caching-clear-success', {
					title:
						text.notifications.clearSuccess?.title ||
						'Cache cleared',
					description:
						text.notifications.clearSuccess?.description ||
						'Object cache was successfully cleared.',
					variant: 'success',
					autoDismiss: 5000,
				} );
			}
		} catch ( error ) {
			notify.push( 'object-caching-update-error', {
				title: text.notifications.updateError.title,
				description: text.notifications.updateError.description,
				variant: 'error',
				autoDismiss: 5000,
			} );
		} finally {
			setIsLoading( false );
		}
	};

	const handleRedirectToLearnMorePage = () => {
		window.open( getDeepLinkedPlatformUrl( 'speed' ), '_blank' );
		getDeepLinkedPlatformUrl( 'performance' );
	};

	let primaryButtonText = null;
	let secondaryButtonText = null;
	let primaryButtonAction = null;
	let secondaryButtonAction = null;

	if ( status === 'enabled' ) {
		primaryButtonText = text.buttons.clearCache;
		primaryButtonAction = () => handleObjectCachingAction( 'clear' );
		secondaryButtonText = text.buttons.disable;
		secondaryButtonAction = () => handleObjectCachingAction( 'disable' );
	} else if ( status === 'disabled' ) {
		primaryButtonText = text.buttons.enable;
		primaryButtonAction = () => handleObjectCachingAction( 'enable' );
	} else if ( status === 'not_setup' ) {
		secondaryButtonAction = handleRedirectToLearnMorePage;
		secondaryButtonText = text.buttons.learnMore;
	}

	return (
		<SiteStatusCard
			title={ text.title }
			status={ text.status[ status ] || text.status.not_setup }
			description={
				text.description[ status ] || text.description.not_setup
			}
			primaryButtonText={ primaryButtonText }
			primaryButtonAction={ primaryButtonAction }
			primaryButtonDisabled={ isLoading }
			primaryButtonContent={ isLoading ? <Spinner /> : null }
			secondaryButtonText={ secondaryButtonText }
			secondaryButtonAction={ secondaryButtonAction }
			Illustration={ () =>
				status === 'enabled' ? (
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

export default ObjectCachingCard;
