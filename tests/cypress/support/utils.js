// tests/cypress/support/utils.js

export const wpLogin = () => {
	cy.login( Cypress.env( 'wpUsername' ), Cypress.env( 'wpPassword' ) );
};

export const testEnabledForPlugin = ( expectedPluginId ) => {
	const pluginId = Cypress.env( 'pluginId' );

	if ( pluginId !== expectedPluginId ) {
		cy.log( `Not running tests — plugin is not ${ expectedPluginId }` );
		cy.skip();
	}
};

export const cleanupVisitHomePage = () => {
	cy.visit( '/wp-admin/index.php' );
};
