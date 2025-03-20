import { Root, Container, Title, Button } from '@newfold/ui-component-library';

import getPanelText from './getPanelText';
import ObjectCachingCard from '../ObjectCachingCard';
import PHPVersionCard from '../PHPVersionCard';
import MalwareCheckCard from '../MalwareCheckCard';
import NameserversCard from '../NameserversCard';
import SSHLoginInfoCard from '../SSHLoginInfoCard';

const Panel = ( { constants, methods, Components } ) => {
	const [ hostingData, setHostingData ] = methods.useState( null );
	const [ loading, setLoading ] = methods.useState( true );
	const [ error, setError ] = methods.useState( null );
	const text = getPanelText();

	const platFormUrl = methods.addUtmParams(
		methods.getPlatformPathUrl( 'hosting/details', 'app/#/sites' )
	);

	methods.useEffect( () => {
		const fetchHostingData = async () => {
			try {
				const apiUrl = methods.NewfoldRuntime.createApiUrl(
					'/newfold-hosting/v1/panel'
				);
				const response = await methods.apiFetch( {
					url: apiUrl,
					method: 'GET',
				} );

				setHostingData( response );
				setLoading( false );
			} catch ( err ) {
				setError( err.message );
				setLoading( false );
			}
		};

		fetchHostingData();
	}, [ methods ] );

	if ( loading ) {
		return (
			<p className="nfd-text-center nfd-text-gray-500">
				{ text.loading }
			</p>
		);
	}

	if ( error ) {
		return (
			<p className="nfd-text-center nfd-text-red-500">
				{ text.error } { error }
			</p>
		);
	}

	return (
		<Root context={ { isRtl: false } }>
			<Container.Header className="nfd-flex nfd-flex-row nfd-justify-between">
				<div className="nfd-flex nfd-flex-col">
					<Title
						as="h2"
						className="nfd-text-2xl nfd-font-medium nfd-text-title"
					>
						{ text.title }
					</Title>
					<p className="nfd-mt-5 nfd-text-lg">
						{ hostingData?.plan?.plan_name ||
							text.planNameFallback }
					</p>
				</div>
				<div className="nfd-flex nfd-flex-col nfd-justify-center">
					<Button
						onClick={ () => window.open( platFormUrl, '_blank' ) }
						variant="secondary"
					>
						{ text.manageButton }
					</Button>
				</div>
			</Container.Header>
			<Container.Block>
				<div className="nfd-flex nfd-gap-4">
					{ /* Left Column */ }
					<div className="nfd-flex-1 nfd-p-4 nfd-space-y-4">
						<SSHLoginInfoCard
							sshLoginInfo={
								hostingData?.[ 'ssh-info' ]?.ssh_info
							}
							methods={ methods }
						/>
					</div>
					{ /* Right Column */ }
					<div className="nfd-flex-1 nfd-p-4 nfd-space-y-4">
						<MalwareCheckCard
							data={ hostingData[ 'malware-check' ] }
							methods={ methods }
						/>
						<ObjectCachingCard
							objectCachingStatus={
								hostingData[ 'object-cache' ]?.status ||
								'not_setup'
							}
							methods={ methods }
						/>
						<NameserversCard
							nameservers={ hostingData?.nameservers }
						/>
						<PHPVersionCard
							phpVersion={ hostingData[ 'php-version' ] }
							platformUrl={ platFormUrl }
						/>
					</div>
				</div>
			</Container.Block>
		</Root>
	);
};

export default Panel;
