// Import Installed Libraries
import axios from "axios";
import LocalStorage from "../../storage/LocalStorage";

const pelleumAxios = axios.create({
	baseURL: `${process.env.REACT_APP_PELLEUM_API_BASE_URL}`,
});

pelleumAxios.interceptors.request.use(
	async (config) => {
		const userObjectString = await LocalStorage.getItem("userObject");
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
