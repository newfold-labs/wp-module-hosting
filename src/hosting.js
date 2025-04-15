import domReady from '@wordpress/dom-ready';
import { createRoot } from '@wordpress/element';

import App from './components/App';

import { NFD_HOSTING_ELEMENT_ID } from './data/constants';

domReady( () => {
	const mountNode = document.getElementById( NFD_HOSTING_ELEMENT_ID );

	if ( mountNode ) {
		const root = createRoot( mountNode );
		root.render( <App /> );
	}
} );
