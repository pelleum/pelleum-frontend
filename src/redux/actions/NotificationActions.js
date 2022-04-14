export const ACKNOWLEDGE_NOTIFICATION = "ACKNOWLEDGE_NOTIFICATION";
export const REFRESH_NOTIFICATIONS = "REFRESH_NOTIFICATIONS";

export const acknowledgeNotification = (notificationId) => (dispatch) => {
	dispatch({
		type: ACKNOWLEDGE_NOTIFICATION,
		payload: notificationId,
	});
};

export const refreshNotifications = (notificationsArray) => (dispatch) => {
	dispatch({
		type: REFRESH_NOTIFICATIONS,
		payload: notificationsArray,
	});
};
