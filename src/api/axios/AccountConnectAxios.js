// Import Installed Libraries
import { REACT_APP_ACCOUNT_CONNECTIONS_BASE_URL, REACT_APP_ACCOUNT_CONNECTIONS_PORT } from "@env";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const accountConnectAxios = axios.create({
	baseURL: `${REACT_APP_ACCOUNT_CONNECTIONS_BASE_URL}:${REACT_APP_ACCOUNT_CONNECTIONS_PORT}`,
});

accountConnectAxios.interceptors.request.use(
	async (config) => {
		const userObjectString = await SecureStore.getItemAsync("userObject");
		const userObject = JSON.parse(userObjectString);
		if (userObject) {
			config.headers.Authorization = `Bearer ${userObject.access_token}`;
		}
		return config;
	},
	(err) => {
		return Promise.reject(err);
	}
);

export default accountConnectAxios;
