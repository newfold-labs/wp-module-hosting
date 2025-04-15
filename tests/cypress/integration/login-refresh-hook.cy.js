import {
	deleteTransient,
	getSsoLoginUrl,
	getTransient,
} from '../support/serverHelpers';
import constants from '../fixtures/constants.json';
import { forceWpLogin, testEnabledForPlugin } from '../support/utils';
import { spyOnHostingPanelApi } from '../support/intercepts';

const REFRESH_TRANSIENT = constants.transients.refreshFlag;

describe( 'HostingPanel wp_login hook', () => {
	before( () => {
		testEnabledForPlugin( 'bluehost' );
		deleteTransient( REFRESH_TRANSIENT );
		forceWpLogin();
	} );

	it( 'sets refresh transient after admin login and renders hosting panel', () => {
		getTransient( REFRESH_TRANSIENT ).then( ( value ) => {
			expect( value ).to.eq( '1' );
		} );

		spyOnHostingPanelApi();
		cy.visit( '/wp-admin/admin.php?page=bluehost#/hosting' );
		cy.wait( '@getPanelData' );

		cy.get( '.nfd-container__block' ).should( 'exist' );
	} );

	it( 'sets refresh transient after SSO login and renders hosting panel', () => {
		getSsoLoginUrl().then( ( ssoUrl ) => {
			cy.request( {
				url: ssoUrl,
				followRedirect: false,
			} ).then( ( res ) => {
				expect( res.status ).to.eq( 302 );
				expect( res.redirectedToUrl ).to.include( '/wp-admin' );

				cy.visit( res.redirectedToUrl );

				getTransient( REFRESH_TRANSIENT ).then( ( value ) => {
					expect( value ).to.eq( '1' );
				} );

				spyOnHostingPanelApi();
				cy.visit( '/wp-admin/admin.php?page=bluehost#/hosting' );
				cy.wait( '@getPanelData' );

				cy.get( '.nfd-container__block' ).should( 'exist' );
			} );
		} );
	} );
} );
