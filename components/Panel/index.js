import { __ } from '@wordpress/i18n';

import { Root, Container, Title, Button } from '@newfold/ui-component-library';

const Panel = ( { constants, methods, Components } ) => {
	return (
		<Root context={ { isRtl: false } }>
			<Container.Header className="nfd-flex nfd-flex-row nfd-justify-between">
				<div className="nfd-flex nfd-flex-col">
					<Title
						as="h2"
						className="nfd-text-2xl nfd-font-medium nfd-text-title"
					>
						{ __( 'Hosting', 'wp-module-hosting' ) }
					</Title>
					<p className="nfd-mt-5 nfd-text-lg">
						{ __( 'PLAN_NAME', 'wp-module-hosting' ) }
					</p>
				</div>
				<div className="nfd-flex nfd-flex-col nfd-justify-center">
					<Button
						onClick={ () => window.open( '#', '_blank' ) }
						variant="secondary"
						id="staging-create-button"
					>
						{ __( 'Manage', 'wp-module-hosting' ) }
					</Button>
				</div>
			</Container.Header>
			<Container.Block>
				<div className="nfd-flex nfd-gap-4">
					{ /* Left Column */ }
					<div className="nfd-flex-1 nfd-p-4 nfd-space-y-4"></div>
					{ /* Right Column */ }
					<div className="nfd-flex-1 nfd-p-4 nfd-space-y-4"></div>
				</div>
			</Container.Block>
		</Root>
	);
};

export default Panel;
