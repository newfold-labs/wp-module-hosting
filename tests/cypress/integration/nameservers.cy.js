import { cleanupVisitHomePage, wpLogin } from '../support/utils';
import { spyOnHostingPanelApi } from '../support/intercepts';
import { testEnabledForPlugin } from '../support/utils';

describe( 'Nameservers Card', () => {
	before( function () {
		testEnabledForPlugin( 'bluehost' );
		wpLogin();
		cy.visit( '/wp-admin/admin.php?page=bluehost#/hosting' );
		spyOnHostingPanelApi();
		cy.wait( '@getPanelData' );
	} );

	it('renders the Nameservers card and handles both scenarios with name servers and not', () => {
		cy.get('[data-testid="nameservers-card"], [data-testid="nameservers-card-no-records"]')
			.should('exist')
			.then(($card) => {
				if ($card.attr('data-testid') === 'nameservers-card') {
					// Case: name servers
					cy.wrap($card)
						.find('.info-item')
						.should('have.length', 2)
						.each(($el) => {
							cy.wrap($el)
								.find('button')
								.should('exist')
								.and('have.attr', 'data-action', 'copy')
								.click();
	
							cy.get('.copied')
								.should('exist')
								.and('be.visible');
						});
				} else if ($card.attr('data-testid') === 'nameservers-card-no-records') {
					// Case no name servers
					cy.wrap($card)
						.find('.info-item')
						.should('have.length', 1);
				}
			});
	});

	// After all tests in the suite, visit the home page to reset the environment
	after( () => {
		cleanupVisitHomePage();
	} );
} );
