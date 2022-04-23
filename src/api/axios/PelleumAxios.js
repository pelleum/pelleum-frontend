// Import Installed Libraries
import axios from "axios";
import LocalStorage from "../../storage/LocalStorage";

const pelleumAxios = axios.create({
	// baseURL: `${process.env.PELLEUM_API_BASE_URL}`,
	// baseURL: "http://localhost:8000"
	baseURL: "http://192.168.1.2:8000"
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
