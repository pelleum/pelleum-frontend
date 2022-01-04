import { AUTH_ERROR, CLEAR_AUTH_ERROR, LOG_IN, LOG_OUT, RESTORE_TOKEN } from "../actions/AuthActions";

// Declare initial state
const initialState = {
    isLoading: true,
    isLogout: false,
    hasUserToken: false,
    errorMessage: '',
}


function authReducer(state = initialState, action) {
    switch (action.type) {
        case AUTH_ERROR:
            return { ...state, errorMessage: action.payload };
        case CLEAR_AUTH_ERROR:
            return { ...state, errorMessage: '' };
        case LOG_IN:
            return { ...state, isLogout: false, hasUserToken: true, isLoading: false };
        case LOG_OUT:
            return { ...state, isLogout: true, hasUserToken: false, isLoading: false };
        case RESTORE_TOKEN:
            return { ...state, hasUserToken: true, isLoading: false };
        default:
            return state;
    }
}


export default authReducer;