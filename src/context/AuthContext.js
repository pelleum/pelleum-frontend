// Import Installed Libraries
import React, { createContext, useEffect, useMemo, useReducer } from 'react';
import * as SecureStore from 'expo-secure-store';

// Import Local Files
import PelleumPublic from "../api/PelleumPublic";


// Declare AuthContext as a Context object
const AuthContext = createContext();

// Declare initial state
const initialState = {
    isLoading: true,
    isLogout: false,
    userToken: null,
    //errorMessage: '',
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


// //****    fetch token action    ****//
// //**********************************//
// useEffect(() => {
//     const fetchToken = async () => {
//         let userToken;
//         try {
//             userToken = await SecureStore.getItemAsync('userToken');
//         } catch (err) {
//             // Restoring token failed
//             console.log('Unable to fetch token.')
//         }
//         // After restoring token, we may need to validate it
//         dispatch({ type: 'RESTORE_TOKEN', token: userToken });
//     };
//     fetchToken();
// }, []);
// //**********************************//


// //**** signUp, logIn, and logOut actions   ****//
// //*********************************************//
// const authContext = useMemo(() => ({
//     signUp: async ({ email, username, password }) => {
//         try {
//             const response = await PelleumPublic.post('/public/auth/users', { email, username, password });
//             console.log("\n", response.status);
//             console.log("\n", response.data);
//             // to log the user in after signup, store the token and dispatch the LOG_IN action
//             // await SecureStore.setItemAsync('userToken', response.data.access_token);
//             // dispatch({ type: 'LOG_IN', token: response.data.access_token });
//         } catch (err) {
//             dispatch({ type: 'AUTH_ERROR', error: err.response.data.detail });
//             console.log("\n", err.response.status);
//             console.log("\n", err.response.data);
//         };
//     },
//     logIn: async ({ username, password }) => {
//         var qs = require('query-string');
//         const config = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };

//         try {
//             const response = await PelleumPublic.post('/public/auth/users/login', qs.stringify({ username, password }), config);
//             console.log("\n", response.status);
//             await SecureStore.setItemAsync('userToken', response.data.access_token);
//             dispatch({ type: 'LOG_IN', token: response.data.access_token });
//         } catch (err) {
//             dispatch({ type: 'AUTH_ERROR', error: err.response.data.detail });
//             console.log("\n", err.response.status);
//             console.log("\n", err.response.data);
//         };
//     },
//     logOut: async () => {
//         await SecureStore.deleteItemAsync('token');
//         dispatch({ type: 'LOG_OUT' });
//     },
//     clearErrorMessage: () => dispatch({ type: 'CLEAR_AUTH_ERROR' }),
// }),
//     []
// );
// //*********************************************//

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    return (
        <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>
    );
};

export default AuthContext;