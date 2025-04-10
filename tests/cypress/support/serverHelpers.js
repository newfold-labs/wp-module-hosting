/**
 * Deletes a transient using WP CLI.
 *
 * @param transient
 */
export const deleteTransient = ( transient ) => {
	cy.exec( `npx wp-env run cli wp transient delete ${ transient }` );
};

/**
 * Sets any option using WP CLI.
 *
 * @param option
 * @param value
 */
export const setWpOption = ( option, value ) => {
	cy.exec( `npx wp-env run cli wp option update ${ option } "${ value }"` );
};

/**
 * Deletes any option using WP CLI.
 *
 * @param option
 */
export const deleteWpOption = ( option ) => {
	cy.exec( `npx wp-env run cli wp option delete ${ option }` );
};
