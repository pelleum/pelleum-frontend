import pelleumClient from "../api/clients/PelleumClient";
import Config from "../../Config";

// Redux
import { store } from "../redux/Store";
import {
	refreshNotifications
} from "../redux/actions/NotificationActions";

class NotificationManager {
	static getNotifications = async () => {
		const authorizedResponse = await pelleumClient({
			method: "get",
			url: `${Config.notificationsBasePath}`,
		});

		if (authorizedResponse) {
			if (authorizedResponse.status == 200) {
                store.dispatch(refreshNotifications(authorizedResponse.data));
			} else {
				console.log(
					"There was an error retrieving the notifications from the backend."
				);
			}
		}
	};

    static acknowledge = async (notificationId) => {
		const authorizedResponse = await pelleumClient({
			method: "patch",
			url: `${Config.notificationsBasePath}/${notificationId}`,
		});

		if (authorizedResponse) {
			if (authorizedResponse.status == 200) {
				return authorizedResponse.data;
			} else {
				console.log(
					"There was an error acknowledging a notification."
				);
			}
		}
	};
}

export default NotificationManager;