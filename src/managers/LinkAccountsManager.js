import pelleumClient from "../api/clients/PelleumClient";
import { store } from "../redux/Store";
import { updateAccountsStatus } from "../redux/actions/LinkedAccountsActions";

class LinkAccountsManager {
	static getLinkedAccountsStatus = async () => {
		const response = await pelleumClient({
			method: "get",
			url: process.env.AC_GET_CONNECTIONS_PATH,
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
		const response = await pelleumClient({
			method: "post",
			url: `${process.env.AC_LOGIN_BASE_PATH}/${process.env.ROBINHOOD_ID}`,
			data: queryParams,
		});

		return response;
	};

	static unlinkAccount = async () => {
		//we should have a .env type file to store institution IDs
		const response = await pelleumClient({
			method: "delete",
			url: `${process.env.AC_DEACTIVATE_BASE_PATH}/${process.env.ROBINHOOD_ID}`,
		});

		return response;
	};

	static verifyAccount = async (requestBody) => {
		//we should have a .env type file to store institution IDs
		const response = await pelleumClient({
			method: "post",
			url: `${process.env.AC_LOGIN_BASE_PATH}/${process.env.ROBINHOOD_ID}/verify`,
			data: requestBody,
		});
		return response;
	};
}

export default LinkAccountsManager;
