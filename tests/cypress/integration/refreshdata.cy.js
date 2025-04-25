import { wpLogin, cleanupVisitHomePage } from '../support/utils';
import { interceptPanelAndReplaceKey } from '../support/intercepts';
import { testEnabledForPlugin } from '../support/utils';

describe( 'Refreshing Data', () => {
	before( () => {
		testEnabledForPlugin( 'bluehost' );
		wpLogin();

		const fiveMinutesAgo = Math.floor( Date.now() / 1000 ) - 5 * 60;

		interceptPanelAndReplaceKey( 'object-cache', {}, ( body ) => {
			body.__generated = fiveMinutesAgo;
			if ( body.__meta ) {
				body.__meta.generated = fiveMinutesAgo;
			}
		} );

		cy.visit( '/wp-admin/admin.php?page=nfd-hosting' );
		cy.wait( '@getPanelData' );
	} );

	it( 'shows an old refresh time and updates it after refresh button click', () => {
		cy.get( '[data-testid="nfd-data-refresh-time"]' )
			.should( 'exist' )
			.and( 'not.be.empty' )
			.invoke( 'text' )
			.as( 'initialTime' );

		cy.get( '[data-testid="nfd-data-refresh-button"]' )
			.should( 'exist' )
			.and( 'not.be.disabled' )
			.as( 'refreshButton' );

		cy.get( '@refreshButton' ).click();
		cy.wait( '@getPanelData' );

		cy.get( '@initialTime' ).then( ( initial ) => {
			cy.get( '[data-testid="nfd-data-refresh-time"]' )
				.should( 'exist' )
				.and( 'not.be.empty' )
				.invoke( 'text' )
				.should( 'not.equal', initial );
		} );
	} );

	after( () => {
		cleanupVisitHomePage();
	} );
} );
