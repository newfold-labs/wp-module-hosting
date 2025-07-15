import {
	getTransient,
} from '../support/serverHelpers';
import constants from '../fixtures/constants.json';
import { wpLogin, testEnabledForPlugin } from '../support/utils';
import { spyOnHostingPanelApi } from '../support/intercepts';

const PANEL_TRANSIENT = constants.transients.hostingPanelData;

describe( 'Flush Hosting Panel cache transient on Permalink structure change', () => {
	before( () => {
		testEnabledForPlugin( 'bluehost' );
		wpLogin();
		cy.visit( '/wp-admin/admin.php?page=nfd-hosting' );
		spyOnHostingPanelApi();
		cy.wait( '@getPanelData' );
	});

	after( () => {
		cy.exec(
			`npx wp-env run cli wp rewrite structure '/%postname%/'`	
		);
	});

	it( 'Change Permalinks Structure and check if transient is deleted', () => {
		getTransient( PANEL_TRANSIENT ).then( ( value ) => {
    		expect(value).to.not.be.empty;
		});

		/* Change the permalink structure */
		cy.exec(
			`npx wp-env run cli wp rewrite structure '/%year%/' --hard`	
		).then( ({ stdout }) => {
			/* Check transient has been removed */
			getTransient( PANEL_TRANSIENT ).then( ( value ) => {
				expect(value).to.be.empty;
			}).then( () => {
				cy.reload().then( () => {
					/* reload the hosting panel page and check a new transient has been saved */
					getTransient( PANEL_TRANSIENT ).then( ( value ) => {
						expect(value).to.not.be.empty;
					});
				});
			});
		});
	} );
} );
