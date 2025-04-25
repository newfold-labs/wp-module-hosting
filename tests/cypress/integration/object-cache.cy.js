import { cleanupVisitHomePage, wpLogin } from '../support/utils';
import { deleteTransient } from '../support/serverHelpers';
import { testEnabledForPlugin } from '../support/utils';
import { interceptPanelAndReplaceKey } from '../support/intercepts';
import constants from '../fixtures/constants.json';

const TRANSIENT = constants.transients.hostingPanelData;

describe( 'Object Caching Card', () => {
	before( () => {
		testEnabledForPlugin( 'bluehost' );
		wpLogin();
		// Visit once at the start (SPA behavior)
		cy.visit( '/wp-admin/admin.php?page=nfd-hosting' );
	} );

	beforeEach( () => {
		// Clear the transient and reload for each test
		deleteTransient( TRANSIENT );
	} );

	context( 'when object cache is enabled', () => {
		beforeEach( () => {
			interceptPanelAndReplaceKey( 'object-cache', {
				status: 'enabled',
				message: 'Object cache is enabled.',
			} );
			cy.reload( true ); // Use reload to re-trigger the page
			cy.wait( '@getPanelData' );
		} );

		it( 'shows green icon and both buttons', () => {
			cy.get( '[data-testid="object-cache-card-status-icon"] svg' )
				.should( 'have.attr', 'class' )
				.and( 'match', /nfd-text-green-500/ );

			cy.get( '[data-testid="object-cache-card-scan-button"]' ).should(
				'exist'
			);
			cy.get( '[data-testid="object-cache-card-support-button"]' ).should(
				'exist'
			);
		} );

		it( 'sends "clear" and "disable" requests', () => {
			cy.intercept(
				'POST',
				'**/index.php?rest_route=%2Fnewfold-hosting%2Fv1%2Fpanel%2Fupdate&_locale=user'
			).as( 'post' );

			cy.get( '[data-testid="object-cache-card-scan-button"]' ).click();
			cy.wait( '@post' ).its( 'request.body' ).should( 'deep.include', {
				identifier: 'object-cache',
				action: 'clear',
			} );

			cy.get(
				'[data-testid="object-cache-card-support-button"]'
			).click();
			cy.wait( '@post' ).its( 'request.body' ).should( 'deep.include', {
				identifier: 'object-cache',
				action: 'disable',
			} );
		} );
	} );

	context( 'when object cache is disabled', () => {
		beforeEach( () => {
			interceptPanelAndReplaceKey( 'object-cache', {
				status: 'disabled',
				message: 'Object cache is installed but disabled.',
			} );
			cy.reload( true );
			cy.wait( '@getPanelData' );
		} );

		it( 'shows red icon and only the Enable button', () => {
			cy.get( '[data-testid="object-cache-card-status-icon"] svg' )
				.should( 'have.attr', 'class' )
				.and( 'match', /nfd-text-red-500/ );

			cy.get( '[data-testid="object-cache-card-scan-button"]' ).should(
				'exist'
			);
			cy.get( '[data-testid="object-cache-card-support-button"]' ).should(
				'not.exist'
			);
		} );

		it( 'sends "enable" request', () => {
			cy.intercept(
				'POST',
				'**/index.php?rest_route=%2Fnewfold-hosting%2Fv1%2Fpanel%2Fupdate&_locale=user'
			).as( 'enable' );

			cy.get( '[data-testid="object-cache-card-scan-button"]' ).click();
			cy.wait( '@enable' ).its( 'request.body' ).should( 'deep.include', {
				identifier: 'object-cache',
				action: 'enable',
			} );
		} );
	} );

	context( 'when object cache is not set up', () => {
		beforeEach( () => {
			interceptPanelAndReplaceKey( 'object-cache', {
				status: 'not_setup',
				message: 'Object cache is not set up.',
			} );
			cy.reload( true );
			cy.wait( '@getPanelData' );
		} );

		it( 'does not render the card', () => {
			cy.get( '[data-testid="object-cache-card"]' ).should( 'not.exist' );
		} );
	} );

	// After all tests in the suite, visit the home page to reset the environment
	after( () => {
		cleanupVisitHomePage();
	} );
} );
