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
 * Intercepts the panel API, replaces a specific key in the first response only,
 * and optionally mutates the full response with a modifier function.
 *
 * @param {string}   key        - Top-level key to override (e.g. 'object-cache')
 * @param {Object}   value      - Value to assign for that key
 * @param {Function} [modifier] - Optional modifier for the full response body
 */
export const interceptPanelAndReplaceKey = ( key, value, modifier = null ) => {
	let callCount = 0;

	cy.intercept(
		'GET',
		'**/index.php?rest_route=%2Fnewfold-hosting%2Fv1%2Fpanel**',
		( req ) => {
			req.continue( ( res ) => {
				callCount++;

				if ( callCount === 1 && res.body ) {
					res.body[ key ] = value;

					if ( typeof modifier === 'function' ) {
						modifier( res.body );
					}
				}

				res.send();
			} );
		}
	).as( 'getPanelData' );
};
