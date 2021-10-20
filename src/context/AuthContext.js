import createDataContext from "./createDataContext";
import pelleumPublic from "../api/pelleumPublic";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from "../navigationRef";

const authReducer = (state, action) => {
    switch (action.type) {
        case 'add_error':
            return { ...state, errorMessage: action.payload }
        case 'signup':
            return { errorMessage: '', token: action.payload }
        default:
            return state;
    };
};

//signup action function
const signup = (dispatch) => async ({ email, username, password }) => {
    try {
        const response = await pelleumPublic.post('/public/auth/users', { email, username, password });
        console.log("\n", response.status);
        console.log("\n", response.data);
        //console.log(response.data.email, response.data.is_active, response.data.is_verified, response.data.user_id, response.data.username)
        await AsyncStorage.setItem('token', response.data.token);
        dispatch({ type: 'signup', payload: response.data.token });
    } catch (err) {
        console.log("\n", err.response.status);
        console.log("\n", err.response.data);
        dispatch({ type: 'add_error', payload: err.response.data.detail });
        //console.log("The error is: \n\n", err);
        //console.log("The error status code is: \n\n", err.response.status)
        //console.log("The error headers are:\n\n", err.response.headers)
    };
};

//login action function
const login = (dispatch) => {
    return ({ username, password }) => {
        //try to log in
        //handle success by updating state
        //handle failure by showing error message
    };
};

//logout action function
const logout = (dispatch) => {
    return ({ username, password }) => {
        //try to slog out
    };
};

export const { Provider, Context } = createDataContext(
    authReducer,
    { signup, login, logout },
    { token: null, errorMessage: '' }
);