import { cleanupVisitHomePage, wpLogin } from '../support/utils';
import { deleteTransient } from '../support/serverHelpers';
import { testEnabledForPlugin } from '../support/utils';
import { interceptPanelAndReplaceKey } from '../support/intercepts';
import constants from '../fixtures/constants.json';

const TRANSIENT = constants.transients.hostingPanelData;

describe( 'Server Hits Card', () => {
	before( () => {
		testEnabledForPlugin( 'bluehost' );
		wpLogin();
		cy.visit( '/wp-admin/admin.php?page=nfd-hosting' );
	} );

	beforeEach( () => {
		deleteTransient( TRANSIENT );
	} );

	context( 'when total hits are within normal range', () => {
		beforeEach( () => {
			interceptPanelAndReplaceKey( 'server-hits', {
				total_hits: 65986,
				hits_allotted: 200000,
				percentage_change: -12.5,
				last_n_days: Array.from( { length: 30 }, ( _, i ) => ( {
					name: `Day ${ i + 1 }`,
					hits: 2000,
				} ) ),
			} );
			cy.reload( true );
			cy.wait( '@getPanelData' );
		} );

		it( 'renders blue bars and normal status message', () => {
			cy.get( '[data-testid="server-hits-card"]' ).within( () => {
				cy.contains( '65,986' );
				cy.contains( '200,000' );
				cy.contains( '12.5%' );
			} );
		} );
	} );

	context( 'when total hits are nearing the limit', () => {
		beforeEach( () => {
			interceptPanelAndReplaceKey( 'server-hits', {
				total_hits: 180986,
				hits_allotted: 200000,
				percentage_change: 38.0,
				last_n_days: Array.from( { length: 30 }, ( _, i ) => ( {
					name: `Day ${ i + 1 }`,
					hits: i > 25 ? 8000 : 5000,
				} ) ),
			} );
			cy.reload( true );
			cy.wait( '@getPanelData' );
		} );

		it( 'renders orange bars and warning message', () => {
			cy.get( '[data-testid="server-hits-card"]' ).within( () => {
				cy.contains( '180,986' );
				cy.contains( '200,000' );
				cy.contains( '38.0%' );
			} );
		} );
	} );

	context( 'when total hits have exceeded the limit', () => {
		beforeEach( () => {
			interceptPanelAndReplaceKey( 'server-hits', {
				total_hits: 215342,
				hits_allotted: 200000,
				percentage_change: 38.0,
				last_n_days: Array.from( { length: 30 }, ( _, i ) => ( {
					name: `Day ${ i + 1 }`,
					hits: i > 25 ? 11000 : 5000,
				} ) ),
			} );
			cy.reload( true );
			cy.wait( '@getPanelData' );
		} );

		it( 'renders red bars and exceeded message', () => {
			cy.get( '[data-testid="server-hits-card"]' ).within( () => {
				cy.contains( '215,342' );
				cy.contains( '200,000' );
				cy.contains( '38.0%' );
			} );
		} );
	} );

	context( 'when there is an error in API response', () => {
		beforeEach( () => {
			interceptPanelAndReplaceKey( 'server-hits', {
				error: 'API failed for server hits',
			} );
			cy.reload( true );
			cy.wait( '@getPanelData' );
		} );

		it( 'does not render the server hits card', () => {
			cy.get( '[data-testid="server-hits-card"]' ).should( 'not.exist' );
		} );
	} );

	after( () => {
		cleanupVisitHomePage();
	} );
} );
