export const REFRESH_NOTIFICATIONS = "REFRESH_NOTIFICATIONS";
export const REFRESH_NOTIFICATION_COUNT = "REFRESH_NOTIFICATION_COUNT";

export const refreshNotificationCount = (notificationCount) => (dispatch) => {
	dispatch({
		type: REFRESH_NOTIFICATION_COUNT,
		payload: notificationCount,
	});
};

export const refreshNotifications = (notificationsArray) => (dispatch) => {
	dispatch({
		type: REFRESH_NOTIFICATIONS,
		payload: notificationsArray,
	});
};
