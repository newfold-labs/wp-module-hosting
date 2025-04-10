import { cleanupVisitHomePage, wpLogin } from '../support/utils';
import {
	interceptPanelAndReplaceKey,
	spyOnHostingPanelApi,
} from '../support/intercepts';
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

		cy.visit( '/wp-admin/admin.php?page=bluehost#/hosting' );
		cy.wait( '@getPanelData' ); // First call is overridden
	} );

	it( 'shows initial refresh time and updates it on refresh click', () => {
		cy.get( '[data-testid="nfd-data-refresh-time"]' )
			.should( 'exist' )
			.and( 'not.be.empty' )
			.invoke( 'text' )
			.as( 'initialTime' );

		cy.get( '[data-testid="nfd-data-refresh-button"]' )
			.should( 'exist' )
			.and( 'not.be.disabled' )
			.as( 'refreshButton' );

		spyOnHostingPanelApi(); // Reattach before click
		cy.get( '@refreshButton' ).click();
		cy.wait( '@getPanelData' );

		cy.get( '@initialTime' ).then( ( initialText ) => {
			cy.get( '[data-testid="nfd-data-refresh-time"]' )
				.should( 'exist' )
				.and( 'not.be.empty' )
				.invoke( 'text' )
				.should( 'not.equal', initialText );
		} );
	} );

	it('Check refresh time text and Refresh button click', () => {
		cy.get('[data-testid="nfd-data-refresh-time"]')
		.should('exist')
        .invoke('text') // Get start text
        .then((initialText) => {
			cy.get('[data-testid="nfd-data-refresh-button"]')
			.should('exist')
			.then(($button) => {
				spyOnHostingPanelApi();
				cy.wrap($button).click();
				cy.wait( '@getPanelData' )
				// Check if the start text is different from the end text
				cy.get('[data-testid="nfd-data-refresh-time"]')
					.invoke('text')
					.should('not.equal', initialText);
			});
        });
	});

	// After all tests in the suite, visit the home page to reset the environment
	after( () => {
		cleanupVisitHomePage();
	} );
} );
