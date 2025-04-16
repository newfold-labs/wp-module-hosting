// Initialize App Store and Styles
import '../../store';
import '../../styles/styles.css';

// Newfold
import { NewfoldRuntime } from '@newfold/wp-module-runtime';

// WordPress
import apiFetch from '@wordpress/api-fetch';
import { useState, useEffect, useContext, Fragment } from '@wordpress/element';
import { getPlatformPathUrl, addUtmParams } from '../../utils/helpers';

// Components
import Panel from '../../sections/Panel';

const App = () => {
	const moduleConstants = {};

	const moduleMethods = {
		apiFetch,
		useState,
		useEffect,
		useContext,
		NewfoldRuntime,
		getPlatformPathUrl,
		addUtmParams,
	}

	const moduleComponents = {
		Fragment,
	};

	return (
		<Panel
			constants={ moduleConstants }
			methods={ moduleMethods }
			Components={ moduleComponents }
		/>
	);
};

export default App;
