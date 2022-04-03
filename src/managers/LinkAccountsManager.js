import pelleumClient from "../api/clients/PelleumClient";
import { store } from "../redux/Store";
import { updateAccountsStatus } from "../redux/actions/LinkedAccountsActions";
import Config from "../../Config";

class LinkAccountsManager {
	static getLinkedAccountsStatus = async () => {
		const response = await pelleumClient({
			method: "get",
			url: Config.acGetConnectionsPath,
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

	static accountLogin = async (requestBody) => {
		const response = await pelleumClient({
			method: "post",
			url: `${Config.acLoginBasePath}/${process.env.ROBINHOOD_ID}`,
			data: requestBody,
		});
		return response;
	};

	static unlinkAccount = async () => {
		const response = await pelleumClient({
			method: "delete",
			url: `${Config.acDeactivateBasePath}/${process.env.ROBINHOOD_ID}`,
		});

		if (response.status == 200) {
			store.dispatch(
				updateAccountsStatus([])
			);
		}

		return response;
	};

	static verifyAccount = async (requestBody) => {
		const response = await pelleumClient({
			method: "post",
			url: `${Config.acLoginBasePath}/${process.env.ROBINHOOD_ID}/verify`,
			data: requestBody,
		});
		return response;
	};
}

export default LinkAccountsManager;
