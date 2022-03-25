// Import Installed Libraries
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const pelleumAxios = axios.create({
	baseURL: `${process.env.PELLEUM_API_BASE_URL}`,
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
