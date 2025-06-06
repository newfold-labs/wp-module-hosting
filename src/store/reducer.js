const DEFAULT_STATE = {
	feed: {},
};

export default function reducer( state = DEFAULT_STATE, action ) {
	switch ( action.type ) {
		case 'PUSH_NOTIFICATION':
			return {
				...state,
				feed: {
					...state.feed,
					[ action.id ]: action.message,
				},
			};

		case 'DISMISS_NOTIFICATION':
			return {
				...state,
				feed: {
					...state.feed,
					[ action.id ]: null,
				},
			};

		default:
			return state;
	}
}
