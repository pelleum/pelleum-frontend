import pelleumAxios from "../axios/PelleumAxios";
import LocalStorage from "../../storage/LocalStorage";
import { store } from "../../redux/Store";
import { logout } from "../../redux/actions/AuthActions";

async function pelleumClient({
	method,
	url,
	headers = null,
	data = null,
	queryParams = null,
	onLogin = false,
} = {}) {
	const requestConfig = { method: method, url: url };

	if (headers) {
		requestConfig["headers"] = headers;
	};
	if (data) {
		requestConfig["data"] = data;
	};
	if (queryParams) {
		requestConfig["params"] = queryParams;
	};

	let response;

	try {
		response = await pelleumAxios(requestConfig);
	} catch (err) {
		response = await err.response;
	}

	if (response.status == 401) {
		// Unauthorized responses
		if (onLogin) {
			return response;
		}
		await LocalStorage.deleteItem("userObject");
		store.dispatch(logout());
	} else {
		// Authorized responses
		return response;
	}
}

export default pelleumClient;
