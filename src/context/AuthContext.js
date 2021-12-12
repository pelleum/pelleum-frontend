// Import Installed Libraries
import React, { createContext, useEffect, useMemo, useReducer } from 'react';

// Declare AuthContext as a Context object
const AuthContext = createContext();

// Declare initial state
const initialState = {
    isLoading: true,
    isLogout: false,
    userToken: null,
    errorMessage: '',
}

// Reducer to manage auth state
const authReducer = (prevState, action) => {
    switch (action.type) {
        case 'AUTH_ERROR':
            return {
                ...prevState,
                errorMessage: action.error,
            };
        case 'CLEAR_AUTH_ERROR':
            return {
                ...prevState,
                errorMessage: '',
            };
        case 'LOG_IN':
            return {
                ...prevState,
                isLogout: false,
                userToken: action.token,
            };
        case 'LOG_OUT':
            return {
                ...prevState,
                isLogout: true,
                userToken: null,
            };
        case 'RESTORE_TOKEN':
            return {
                ...prevState,
                userToken: action.token,
                isLoading: false,
            };
        default:
            return state;
    };
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    return (
        <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>
    );
};

export default AuthContext;