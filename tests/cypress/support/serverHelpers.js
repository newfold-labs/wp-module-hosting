export const deleteTransient = ( transient ) => {
	cy.exec( `npx wp-env run cli wp transient delete ${ transient }` );
};

export const getTransient = ( key ) => {
	return cy
		.exec( `npx wp-env run cli wp transient get ${ key }`, {
			failOnNonZeroExit: false,
		} )
		.then( ( res ) => res.stdout.trim() );
};

export const setWpOption = ( option, value ) => {
	cy.exec( `npx wp-env run cli wp option update ${ option } "${ value }"` );
};

export const deleteWpOption = ( option ) => {
	cy.exec( `npx wp-env run cli wp option delete ${ option }` );
};

export const getSsoLoginUrl = () => {
	return cy
		.exec( 'npx wp-env run cli wp newfold sso' )
		.then( ( { stdout } ) => {
			const urlMatch = stdout.match( /http:\/\/[^\s]+/ );
			if ( ! urlMatch ) {
				throw new Error( 'SSO URL not found in wp-cli output' );
			}
			return urlMatch[ 0 ];
		} );
};
