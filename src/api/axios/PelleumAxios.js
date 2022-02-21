// Import Installed Libraries
import { REACT_APP_PELLEUM_API_BASE_URL, REACT_APP_PELLEUM_API_PORT } from "@env";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const pelleumAxios = axios.create({
	baseURL: `${REACT_APP_PELLEUM_API_BASE_URL}:${REACT_APP_PELLEUM_API_PORT}`,
	// baseURL: `http://192.168.1.8:8000`,
});

pelleumAxios.interceptors.request.use(
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

export default pelleumAxios;
