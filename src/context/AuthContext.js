import createDataContext from "./createDataContext";
import pelleumPublic from "../api/pelleumPublic";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from "../navigationRef";

const authReducer = (state, action) => {
    switch (action.type) {
        case 'add_error':
            return { ...state, errorMessage: action.payload }
        case 'login':
            return { errorMessage: '', token: action.payload }
        case 'clear_error_message':
            return { ...state, errorMessage: '' };
        case 'logout':
            return { token: null, errorMessage: '' }
        default:
            return state;
    };
};

const tryLocalLogin = dispatch => async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token || token === null) navigate('loginFlow');
    if (token) {
        dispatch({ type: 'login', payload: token });
        navigate('mainFlow');
    };
};

//clear error message
const clearErrorMessage = dispatch => () => {
    dispatch({ type: 'clear_error_message' })
}

    //signup action function
    const signup = (dispatch) => async ({ email, username, password }) => {
        try {
            const response = await pelleumPublic.post('/public/auth/users', { email, username, password });
            console.log("\n", response.status);
            console.log("\n", response.data);
            navigate('Login')
        } catch (err) {
            dispatch({ type: 'add_error', payload: err.response.data.detail });
            console.log("\n", err.response.status);
            console.log("\n", err.response.data);
        };
    };

    //login action function
    const login = (dispatch) => async ({ username, password }) => {

        var qs = require('query-string');

        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        try {
            const response = await pelleumPublic.post('/public/auth/users/login', qs.stringify({ username, password }), config);
            console.log("\n", response.status);
            console.log("\n", response.data);
            console.log("\n this is my token:\n", response.data.access_token);
            await AsyncStorage.setItem('token', response.data.access_token);
            dispatch({ type: 'login', payload: response.data.access_token });
            navigate('mainFlow')
        } catch (err) {
            dispatch({ type: 'add_error', payload: err.response.data.detail });
            console.log("\n", err.response.status);
            console.log("\n", err.response.data);
        };
    };

    //logout action function
    const logout = dispatch => async () => {
        await AsyncStorage.removeItem('token');
        dispatch({ type: 'logout' });
        navigate('loginFlow');
    };

    export const { Provider, Context } = createDataContext(
        authReducer,
        { signup, login, logout, clearErrorMessage, tryLocalLogin },
        { token: null, errorMessage: '' }
    );