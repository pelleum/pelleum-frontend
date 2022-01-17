
import { store } from "../redux/Store";
import * as SecureStore from 'expo-secure-store';
import pelleumClient from "../api/clients/PelleumClient";
import { authError, login, restoreToken } from "../redux/actions/AuthActions";

class UserManager {

    static login = async ({ username, password }) => {
        var qs = require("query-string");
        const response = await pelleumClient({
            method: "post",
            url: "/public/auth/users/login",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            data: qs.stringify({ username, password }),
            onLogin: true
        });
        
        if (response.status == 200) {
            await SecureStore.setItemAsync('userObject', JSON.stringify(response.data));
            store.dispatch(login());
        } else {
            store.dispatch(authError(response.data.detail));
        }
	}

    static signup = async (data) => {

        const response = await pelleumClient({
            method: "post",
            url: "/public/auth/users",
            data: data
        });

        if (response.status == 201) {
            await SecureStore.setItemAsync('userObject', JSON.stringify(response.data));
            store.dispatch(login());
        } else {
            store.dispatch(authError(response.data.detail));
        }
	}

    static getUser = async () => {
        const authorizedResponse = await pelleumClient({ 
			method: 'get', 
			url: '/public/auth/users' 
		});
		if (authorizedResponse) {
			if (authorizedResponse.status == 200) {
				store.dispatch(restoreToken());
                return authorizedResponse.data;
			} else {
				console.log("There was an error retrieving the current user when attempting to restore the token.")
			};
		};
    }
}

export default UserManager;