import { cleanupVisitHomePage, wpLogin } from '../support/utils';
import { spyOnHostingPanelApi } from '../support/intercepts';
import { testEnabledForPlugin } from '../support/utils';

describe( 'Refreshing Data', () => {
	before( function () {
		testEnabledForPlugin( 'bluehost' );
		wpLogin();
		cy.visit( '/wp-admin/admin.php?page=bluehost#/hosting' );
		spyOnHostingPanelApi();
		cy.wait( '@getPanelData' );
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
