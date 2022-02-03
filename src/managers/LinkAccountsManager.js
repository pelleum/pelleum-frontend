import accountConnectClient from "../api/clients/AccountConnectClient";
import { store } from "../redux/Store";
import { updateAccountsStatus } from "../redux/actions/LinkedAccountsActions";
import { AC_GET_CONNECTIONS_PATH, AC_LOGIN_BASE_PATH, AC_DEACTIVATE_BASE_PATH } from "@env";

class LinkAccountsManager {
	static getLinkedAccountsStatus = async () => {
		const response = await accountConnectClient({
			method: "get",
			url: AC_GET_CONNECTIONS_PATH,
		});

		if (response.status == 200) {
			store.dispatch(
				updateAccountsStatus(response.data.records.active_connections)
			);
		} else {
			console.log(
				"There was an error confirming the status of your linked accounts."
			);
		}
	};

	static accountLogin = async (queryParams) => {
		//we should have a .env type file to store institution IDs
		const ROBINHOOD_ID = "d75e2cf4-a4ee-4869-88c3-14bfadf7c196";
		const response = await accountConnectClient({
			method: "post",
			url: `${AC_LOGIN_BASE_PATH}/${ROBINHOOD_ID}`,
			data: queryParams,
		});

		return response;
	};

	static unlinkAccount = async () => {
		//we should have a .env type file to store institution IDs
		const ROBINHOOD_ID = "d75e2cf4-a4ee-4869-88c3-14bfadf7c196";
		const response = await accountConnectClient({
			method: "delete",
			url: `${AC_DEACTIVATE_BASE_PATH}/${ROBINHOOD_ID}`,
		});

		return response;
	};

	static verifyAccount = async (queryParams) => {
		//we should have a .env type file to store institution IDs
		const ROBINHOOD_ID = "d75e2cf4-a4ee-4869-88c3-14bfadf7c196";
		const response = await accountConnectClient({
			method: "post",
			url: `${AC_LOGIN_BASE_PATH}/${ROBINHOOD_ID}/verify`,
			data: queryParams,
		});

		return response;
	};
}

export default LinkAccountsManager;
