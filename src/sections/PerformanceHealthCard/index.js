import { useState } from '@wordpress/element';
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

	const boostSite = async () => {
		const currentUrl = window.location.href;
		const siteUrl = currentUrl.split( '/wp-admin/' )[ 0 ];

		const apiUrl = methods.NewfoldRuntime.createApiUrl(
			'/newfold-installer/v1/plugins/install'
		);

		const INSTALL_TOKEN = methods.NewfoldRuntime.sdk?.jetpackboost.install_token || '';
		const plugin = 'jetpack-boost';

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
			window.location.href = `${ siteUrl }/wp-admin/admin.php?page=jetpack-boost`;
		}
	}

	return (
		<SiteStatusCard
			testId="performancehealth-info-card"
			title={ text.title }
			status={ data.status }
			description={ data.description }
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
				<CircularGauge value={ data.resultValue } strokeFillColor={data.color}/>
			}
		/>
	);
}

export default PerformanceHealthCard;