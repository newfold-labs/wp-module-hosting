import { useState } from '@wordpress/element';
import { Spinner } from '@newfold/ui-component-library';
import SiteStatusCard from '../SiteStatusCard';
import getPerformanceHealthText from './getPerformanceHealthText';
import CircularGauge from '../../components/CircularGauge';

const PerformanceHealthCard = ( { data, methods, platformUrl, isAtomic } ) => {
	const text = getPerformanceHealthText();
	const [ isLoading, setIsLoading ] = useState( false );

	const boostSite = () => {
		
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
			primaryButtonContent={ isLoading ? <Spinner /> : null }
			secondaryButtonText={ text.buttons.learnMore }
			secondaryButtonAction={
				() =>
					window.open(
						getDeepLinkedPlatformUrl( 'speed' ),
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