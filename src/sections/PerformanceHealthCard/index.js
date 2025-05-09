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
	const [ performanceValue, setPerformanceValue ] = useState( data?.results.value || 'unknown' );

	useEffect( () => {
		if ( performanceValue === 'unknown' ) {
			const updatePerformanceValue = async () => {
				try {
					setIsLoading( true );
					const vl = Math.floor(Math.random() * (100 - 0 + 1) + 0); /* TODO: call a new api to retrieve the new value and so update it */
					await methods.apiFetch( {
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
					} );
					setPerformanceValue(vl);
				} catch ( error ) {
					setPerformanceValue(0);
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
		} catch ( error ) {
			setIsLoading( false );
			pushNotification( 'performancehealth-error', {
				title: text.title,
				description: text.jetpackBoost.installationFailed,
				variant: 'error',
				autoDismiss: 5000,
			} );
		} finally {
			setIsLoading( false );
			//window.location.href = data?.urls?.jetpackBoostPage || '';
		}
	}

	return (
		<SiteStatusCard
			testId="performancehealth-info-card"
			title={ text.title }
			status={ data?.results.status }
			description={ data?.results.description }
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
						'',
						'_blank'
					)
			}
			Illustration={ 
				isLoading || performanceValue === 'unknown' ? (
					<Spinner data-testid="spinner" />
				) : (
					<CircularGauge value={ performanceValue } strokeFillColor={data?.results.color || '#000'}/>
				)
			}
		/>
	);
}

export default PerformanceHealthCard;