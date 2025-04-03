import {
	Root,
	Container,
	Title,
	Button,
	Spinner,
} from '@newfold/ui-component-library';

import getPanelText from './getPanelText';
import ObjectCachingCard from '../ObjectCachingCard';
import PHPVersionCard from '../PHPVersionCard';
import MalwareCheckCard from '../MalwareCheckCard';
import NameserversCard from '../NameserversCard';
import SSHLoginInfoCard from '../SSHLoginInfoCard';
import CDNCard from '../CDNCard';
import DataRefreshInfo from '../DataRefreshInfo';

const Panel = ( { constants, methods, Components } ) => {
	const [ hostingData, setHostingData ] = methods.useState( null );
	const [ loading, setLoading ] = methods.useState( true );
	const [ error, setError ] = methods.useState( null );
	const [ platFormUrl, setPlatformUrl ] = methods.useState( '' );
	const [ isAtomic, setIsAtomic ] = methods.useState( false );
	const text = getPanelText();

	const fetchHostingData = async ( shouldFlush = false ) => {
		try {
			const apiUrl = methods.NewfoldRuntime.createApiUrl(
				'/newfold-hosting/v1/panel'
			);

			const headers = shouldFlush ? { 'X-NFD-Flush-Cache': 'true' } : {};

			const response = await methods.apiFetch( {
				url: apiUrl,
				method: 'GET',
				headers,
			} );

			setHostingData( response );

			const siteId = response?.[ 'plan-info' ]?.site_id;
			const url = methods.getPlatformPathUrl(
				siteId
					? `hosting/details/sites/${ siteId }`
					: 'hosting/details/sites',
				'app/#/sites'
			);
			setPlatformUrl( url );

			const isAtomicPlan = response?.[ 'plan-info' ]?.is_atomic;
			setIsAtomic( isAtomicPlan );

			setLoading( false );
		} catch ( err ) {
			setError( err.message );
			setLoading( false );
		}
	};

	methods.useEffect( () => {
		fetchHostingData();
	}, [ methods ] );

	if ( loading ) {
		return (
			<div className="nfd-flex nfd-flex-col nfd-text-primary nfd-items-center nfd-justify-center nfd-h-[630px]">
				<Spinner />
				<p className="nfd-mt-4 nfd-text-gray-600">{ text.loading }</p>
			</div>
		);
	}

	if ( error ) {
		return (
			<p className="nfd-text-center nfd-text-red-500">
				{ text.error } { error }
			</p>
		);
	}

	const handleRefresh = () => {
		setLoading( true );
		setError( null );
		fetchHostingData( true );
	};

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
					{ hostingData?.[ 'plan-info' ]?.plan_name && (
						<p className="nfd-mt-5 nfd-text-lg">
							{ hostingData[ 'plan-info' ].plan_name }
						</p>
					) }
					<DataRefreshInfo
						timestamp={ hostingData?.__meta?.generated }
						onRefresh={ handleRefresh }
					/>
				</div>
				<div className="nfd-flex nfd-flex-col nfd-justify-center">
					<Button
						onClick={ () =>
							window.open(
								methods.addUtmParams( platFormUrl ),
								'_blank'
							)
						}
						variant="secondary"
					>
						{ text.manageButton }
					</Button>
				</div>
			</Container.Header>
			<Container.Block>
				<div className="nfd-grid nfd-grid-cols-1 md:nfd-grid-cols-2 nfd-gap-6">
					{ /* Left Column */ }
					<div className="nfd-flex nfd-flex-col nfd-gap-6">
						<MalwareCheckCard
							data={ hostingData[ 'malware-check' ] }
							methods={ methods }
						/>
						<CDNCard
							platformUrl={ platFormUrl }
							isAtomic={ isAtomic }
							data={ hostingData[ 'cdn-info' ] }
							methods={ methods }
						/>
						{ hostingData[ 'object-cache' ]?.status &&
							hostingData[ 'object-cache' ].status !==
								'not_setup' && (
								<ObjectCachingCard
									objectCachingStatus={
										hostingData[ 'object-cache' ].status
									}
									methods={ methods }
									platformUrl={ platFormUrl }
									isAtomic={ isAtomic }
								/>
							) }
					</div>
					{ /* Right Column */ }
					<div className="nfd-flex nfd-flex-col nfd-gap-6">
						<SSHLoginInfoCard
							sshLoginInfo={
								hostingData?.[ 'ssh-info' ]?.ssh_info
							}
							methods={ methods }
							platformUrl={ platFormUrl }
							isAtomic={ isAtomic }
						/>
						<NameserversCard
							nameservers={ hostingData?.nameservers }
						/>
						<PHPVersionCard
							phpVersion={ hostingData[ 'php-version' ] }
							methods={ methods }
							platformUrl={ platFormUrl }
						/>
					</div>
				</div>
			</Container.Block>
		</Root>
	);
};

export default Panel;
