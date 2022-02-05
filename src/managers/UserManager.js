import * as SecureStore from "expo-secure-store";
import pelleumClient from "../api/clients/PelleumClient";
import RationalesManager from "../managers/RationalesManager";
import LinkAccountsManager from "./LinkAccountsManager";
import * as Haptics from "expo-haptics";

// Redux
import { store } from "../redux/Store";
import {
	authError,
	login,
	restoreToken,
	storeUserObject,
} from "../redux/actions/AuthActions";
import { refreshLibrary } from "../redux/actions/RationaleActions";
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
			// 2. dispatch storeUserObject action
			store.dispatch(
				storeUserObject({
					username: response.data.username,
					userId: response.data.user_id,
				})
			);
			// 3. dispatch login action
			store.dispatch(login());
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
			// 4. retrieve rationales from backend and update rationaleLibrary
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
			// 2. dispatch storeUserObject action
			store.dispatch(
				storeUserObject({
					username: response.data.username,
					userId: response.data.user_id,
				})
			);
			// 3. dispatch login action
			store.dispatch(login());
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
			// 4. retrieve rationales from backend and update rationaleLibrary
			const retrievedRationales = await RationalesManager.retrieveRationales({
				user_id: response.data.user_id,
			});
			if (retrievedRationales) {
				const rationaleInfo = await RationalesManager.extractRationaleInfo(
					retrievedRationales.records.rationales
				);
				store.dispatch(refreshLibrary(rationaleInfo));
			}
			//5. update linked brokerage accounts status
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
