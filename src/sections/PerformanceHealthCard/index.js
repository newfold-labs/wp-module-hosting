import { useEffect, useState } from '@wordpress/element';
import { Spinner } from '@newfold/ui-component-library';
import SiteStatusCard from '../SiteStatusCard';
import getPerformanceHealthText from './getPerformanceHealthText';
import CircularGauge from '../../components/CircularGauge';
import { useDispatch } from '@wordpress/data';
import { STORE_NAME } from '../../data/constants';

const PerformanceHealthCard = ( { data, methods, platformUrl, isAtomic } ) => {
	const text = getPerformanceHealthText();
	const [ isLoading, setIsLoading ] = useState( false );
	const { pushNotification } = useDispatch( STORE_NAME );
	const [results, setResults] = useState( data?.results || {} );

	useEffect( () => {
		if ( results?.value === 'unknown' ) {
			const updatePerformanceValue = async () => {
				try {
					setIsLoading( true );
					methods.apiFetch({
						url: data.api.lighthouse_service,
						method: 'POST',
						headers: {
							'Authorization': `Bearer ${data.api.token}`,
    						'Content-Type': 'application/json'
						},
						data:{
							url: 'pepoe'
						}

					}).then( (response) => {
						console.log('got response ', response)
					});
					const vl = Math.floor(Math.random() * (100 - 0 + 1) + 0); /* TODO: call a new api to retrieve the new value and so update it */
					await new Promise( ( resolve ) => setTimeout( resolve, 1000 ) );
					methods.apiFetch( {
						url: methods.NewfoldRuntime.createApiUrl(
							'/newfold-hosting/v1/panel/update'
						),
						method: 'POST',
						data: {
							identifier: 'performance-health',
							action: 'update_performance_health',
							data: {
								value: vl,
							},
						},
					} ).then( ( response ) => {
						setResults( response );
					} );
				} catch ( error ) {
					setResults( {} );
					pushNotification( 'performancehealth-error', {
						title: text.title,
						description: text.failToRetrieveData,
						variant: 'error',
						autoDismiss: 5000,
					} );
				} finally {
					setIsLoading( false );
				}
			}
			updatePerformanceValue();
		}
	},[]);

	const boostSite = async () => {
		const apiUrl = methods.NewfoldRuntime.createApiUrl(
			'/newfold-installer/v1/plugins/install'
		);

		const INSTALL_TOKEN = data?.install_token || '';
		const plugin = data?.plugin || 'jetpack-boost';

		try {
			setIsLoading( true );
			await methods.apiFetch( {
				url: apiUrl,
				method: 'POST',
				headers: { 'X-NFD-INSTALLER': INSTALL_TOKEN },
				data: { plugin, activate: true, queue: false },
			} );

			await methods.apiFetch( {
				url: methods.NewfoldRuntime.createApiUrl(
					'/newfold-hosting/v1/panel/update'
				),
				method: 'POST',
				data: {
					identifier: 'performance-health',
					action: 'update_performance_health',
					data: {
						value: 'unknown',
					},
				},
			} );
		} catch ( error ) {
			setIsLoading( false );
			pushNotification( 'performancehealth-error', {
				title: text.title,
				description: text.jetpackBoost.installationFailed,
				variant: 'error',
				autoDismiss: 5000,
			} );
		} finally {
			window.location.href = data?.urls?.jetpackBoostPage || '';
		}
	}

	return (
		<SiteStatusCard
			testId="performancehealth-info-card"
			title={ text.title }
			status={ isLoading ? '' : results?.status }
			description={ isLoading ? '' : results?.description }
			primaryButtonText={ text.buttons.boost }
			primaryButtonAction={ boostSite }
			primaryButtonDisabled={ isLoading }
			primaryButtonContent={
				isLoading ? (
					<>
						<Spinner data-testid="spinner" />
						<span className="nfd-ml-2">{ text.buttons.boost }</span>
					</>
				) : null
			}
			secondaryButtonText={ text.buttons.learnMore }
			secondaryButtonAction={
				() => 
					window.open(
						data?.urls?.supportPage,
						'_blank'
					)
			}
			Illustration={ 
				isLoading || results.value === 'unknown' ? (
					<Spinner data-testid="spinner" />
				) : (
					<CircularGauge value={ results.value } strokeFillColor={results?.color || '#000'}/>
				)
			}
		/>
	);
}

export default PerformanceHealthCard;