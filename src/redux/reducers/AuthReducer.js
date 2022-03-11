import {
	AUTH_ERROR,
	CLEAR_AUTH_ERROR,
	LOG_IN,
	LOG_OUT,
	RESTORE_TOKEN,
    STORE_USER_OBJECT,
    DUMP_USER_OBJECT,
	SUBSCRIPTION_CHANGE
} from "../actions/AuthActions";

// Declare initial state
const initialState = {
	isLoading: true,
	isLogout: false,
	hasUserToken: false,
	errorMessage: "",
    userObject: { username: null, userId: null },
	subscriptionObject: { subscriptionName: null, isActive: false }
};

function authReducer(state = initialState, action) {
	switch (action.type) {
		case AUTH_ERROR:
			return { ...state, errorMessage: action.payload };
		case CLEAR_AUTH_ERROR:
			return { ...state, errorMessage: "" };
		case LOG_IN:
			return {
				...state,
				isLogout: false,
				hasUserToken: true,
				isLoading: false,
			};
		case LOG_OUT:
			return {
				...state,
				isLogout: true,
				hasUserToken: false,
				isLoading: false,
			};
		case RESTORE_TOKEN:
			return { ...state, hasUserToken: true, isLoading: false };
        case STORE_USER_OBJECT:
            return { ...state, userObject: action.payload};
        case DUMP_USER_OBJECT:
            return { ...state, userObject: null};
		case SUBSCRIPTION_CHANGE:
			return { ...state, subscriptionObject: action.payload }
		default:
			return state;
	}
}

export default authReducer;
