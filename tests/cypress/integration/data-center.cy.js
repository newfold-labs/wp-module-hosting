import { cleanupVisitHomePage, wpLogin } from '../support/utils';
import { deleteTransient } from '../support/serverHelpers';
import { interceptPanelAndReplaceKey } from '../support/intercepts';
import { testEnabledForPlugin } from '../support/utils';
import constants from '../fixtures/constants.json';

const TRANSIENT = constants.transients.hostingPanelData;

describe( 'Data-Center Card', () => {
	before( function () {
		testEnabledForPlugin( 'bluehost' );
		wpLogin();
		cy.visit( '/wp-admin/admin.php?page=nfd-hosting' );
	} );

	context('If it is not atomic', () => {
		beforeEach( () => {
			interceptPanelAndReplaceKey( 'plan-info', {
				is_atomic: false,
			} );
			cy.reload( true ); // Use reload to re-trigger the page
			cy.wait( '@getPanelData' );
		} );

		it( 'not even show the data-center card', () => {
			cy.get('[data-testid="datacenter-card"], [data-testid="datacenter-card-no-records"]')
			.should('not.exist');
		});
	});

	context('If it is atomic', () => {
		beforeEach( () => {
			interceptPanelAndReplaceKey( 'plan-info', {
				is_atomic: true,
			} );
			cy.reload( true ); // Use reload to re-trigger the page
			cy.wait( '@getPanelData' );
		} );

		it( 'show the data-center card', () => {
			cy.get('[data-testid="datacenter-card"], [data-testid="datacenter-card-no-records"]')
			.should('exist');
		});
	});

	// After all tests in the suite, visit the home page to reset the environment
	after( () => {
		cleanupVisitHomePage();
	} );
} );
