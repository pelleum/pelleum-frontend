import { store } from "../redux/Store";
import * as SecureStore from "expo-secure-store";
import pelleumClient from "../api/clients/PelleumClient";
import { authError, login, restoreToken } from "../redux/actions/AuthActions";
import RationalesManager from "../managers/RationalesManager";
import { refreshLibrary } from "../redux/actions/RationaleActions";
import LinkAccountsManager from "./LinkAccountsManager";
import { USER_BASE_PATH, USER_LOGIN_PATH } from "@env";

class UserManager {
	static login = async ({ username, password }) => {
		var qs = require("query-string");
		const response = await pelleumClient({
			method: "post",
			url: USER_LOGIN_PATH,
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			data: qs.stringify({ username, password }),
			onLogin: true,
		});

		if (response.status == 200) {
			// 1. store user object in SecureStore
			await SecureStore.setItemAsync(
				"userObject",
				JSON.stringify(response.data)
			);
			// 2. dispatch login action
			store.dispatch(login());
			// 3. retrieve rationales from backend and update rationaleLibrary
			const retrievedRationales = await RationalesManager.retrieveRationales({
				user_id: response.data.user_id,
			});
			if (retrievedRationales) {
				const rationaleInfo = await RationalesManager.extractRationaleInfo(
					retrievedRationales.records.rationales
				);
				store.dispatch(refreshLibrary(rationaleInfo));
			}
			//4. update linked brokerage accounts status
			await LinkAccountsManager.getLinkedAccountsStatus();
		} else {
			store.dispatch(authError(response.data.detail));
		}
	};

	static signup = async (data) => {
		const response = await pelleumClient({
			method: "post",
			url: USER_BASE_PATH,
			data: data,
		});

		if (response.status == 201) {
			// 1. store user object in SecureStore
			await SecureStore.setItemAsync(
				"userObject",
				JSON.stringify(response.data)
			);
			// 2. dispatch login action
			store.dispatch(login());
			// 3. retrieve rationales from backend and update rationaleLibrary
			const retrievedRationales = await RationalesManager.retrieveRationales({
				user_id: response.data.user_id,
			});
			if (retrievedRationales) {
				const rationaleInfo = await RationalesManager.extractRationaleInfo(
					retrievedRationales.records.rationales
				);
				store.dispatch(refreshLibrary(rationaleInfo));
			}
			//4. update linked brokerage accounts status
			await LinkAccountsManager.getLinkedAccountsStatus();
		} else {
			store.dispatch(authError(response.data.detail));
		}
	};

	static getUser = async () => {
		const authorizedResponse = await pelleumClient({
			method: "get",
			url: USER_BASE_PATH,
		});
		if (authorizedResponse) {
			if (authorizedResponse.status == 200) {
				store.dispatch(restoreToken());
				return authorizedResponse.data;
			} else {
				console.log(
					"There was an error retrieving the current user when attempting to restore the token."
				);
			}
		}
	};
}

export default UserManager;
