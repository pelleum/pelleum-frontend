import pelleumClient from "../api/clients/PelleumClient";
import Config from "../../Config";

// Redux
import { store } from "../redux/Store";
import {
	refreshNotificationCount,
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
				const notifications = authorizedResponse.data.notifications;
				store.dispatch(refreshNotifications(notifications));

				let unacknowledgedCount = 0;
				for (const notification of notifications) {
					if (!notification.acknowledged) {
						unacknowledgedCount += 1;
					}
				};
				store.dispatch(refreshNotificationCount(unacknowledgedCount));
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
			if (authorizedResponse.status == 204) {
				return;
			} else {
				console.log(
					"There was an error acknowledging a notification."
				);
			}
		}
	};
}

export default NotificationManager;