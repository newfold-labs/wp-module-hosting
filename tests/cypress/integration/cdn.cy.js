import { wpLogin } from '../support/utils';
import { spyOnHostingPanelApi } from '../support/intercepts';
import {
	deleteTransient,
	setWpOption,
	deleteWpOption,
} from '../support/serverHelpers';
import { testEnabledForPlugin, cleanupVisitHomePage } from '../support/utils';
import constants from '../fixtures/constants.json';

const TRANSIENT = constants.transients.hostingPanelData;
const OPTION = constants.options.cdn;

describe( 'CDN Card', () => {
	before( () => {
		testEnabledForPlugin( 'bluehost' );
		wpLogin();
		// First-time visit to allow hard reloads later
		cy.visit( '/wp-admin/admin.php?page=nfd-hosting' );
	} );

	context( 'when CDN is enabled', () => {
		before( () => {
			deleteTransient( TRANSIENT );
			setWpOption( OPTION, 'premium' );

			spyOnHostingPanelApi();
			cy.reload( true );
			cy.wait( '@getPanelData' );
		} );

		it( 'shows green icon and cache control buttons', () => {
			cy.get( '[data-testid="cdn-info-card-status-icon"] svg' )
				.should( 'have.attr', 'class' )
				.and( 'match', /nfd-text-green-500/ );

			cy.get( '[data-testid="cdn-info-card-scan-button"]' ).should(
				'exist'
			);
			cy.get( '[data-testid="cdn-info-card-support-button"]' ).should(
				'exist'
			);
		} );

		it( 'sends correct payload when purging cache', () => {
			cy.intercept(
				'POST',
				'**/index.php?rest_route=%2Fnewfold-hosting%2Fv1%2Fpanel%2Fupdate**'
			).as( 'purgeRequest' );

			cy.get( '[data-testid="cdn-info-card-scan-button"]' ).click();

			cy.wait( '@purgeRequest' )
				.its( 'request.body' )
				.should( ( body ) => {
					expect( body ).to.deep.equal( {
						identifier: 'cdn-info',
						action: 'purge',
					} );
				} );
		} );
	} );

	context( 'when CDN is disabled', () => {
		before( () => {
			deleteTransient( TRANSIENT );
			deleteWpOption( OPTION );

			spyOnHostingPanelApi();
			cy.reload( true );
			cy.wait( '@getPanelData' );
		} );

		it( 'shows red icon and opens platform URL on enable click', () => {
			cy.get( '[data-testid="cdn-info-card-status-icon"] svg' )
				.should( 'have.attr', 'class' )
				.and( 'match', /nfd-text-red-500/ );

			cy.window().then( ( win ) => {
				cy.stub( win, 'open' ).as( 'windowOpen' );
			} );

			cy.get( '[data-testid="cdn-info-card-scan-button"]' ).click();
			cy.get( '@windowOpen' ).should(
				'be.calledWithMatch',
				/hosting\/details\/sites/
			);
		} );

		it( 'does not show support button', () => {
			cy.get( '[data-testid="cdn-info-card-support-button"]' ).should(
				'not.exist'
			);
		} );
	} );

	// After all tests in the suite, visit the home page to reset the environment
	after( () => {
		cleanupVisitHomePage();
	} );
} );
