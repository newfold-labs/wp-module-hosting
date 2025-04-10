/**
 * Spies on the real hosting panel API request (query-param route with encoding).
 */
export const spyOnHostingPanelApi = () => {
	cy.intercept(
		'GET',
		'**/index.php?rest_route=%2Fnewfold-hosting%2Fv1%2Fpanel**'
	).as( 'getPanelData' );
};

/**
 * Intercepts the panel API and replaces a specific key in the response.
 * The request must be triggered by visiting the hosting page.
 *
 * @param {string} key   - The top-level key in the API response to override
 * @param {Object} value - The value to replace it with
 */
export const interceptPanelAndReplaceKey = ( key, value ) => {
	cy.intercept(
		'GET',
		'**/index.php?rest_route=%2Fnewfold-hosting%2Fv1%2Fpanel**',
		( req ) => {
			req.continue( ( res ) => {
				if ( res.body ) {
					res.body[ key ] = value;
				}
				res.send();
			} );
		}
	).as( 'getPanelData' );
};
