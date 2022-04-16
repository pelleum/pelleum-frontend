import { REFRESH_NOTIFICATIONS, REFRESH_NOTIFICATION_COUNT } from "../actions/NotificationActions";

// Declare initial state
const initialState = {
	notifications: [],
	notificationCount: 0,
};

function notificationsReducer(state = initialState, action) {
	switch (action.type) {
		case REFRESH_NOTIFICATION_COUNT:
			return {
				...state,
				notificationCount: action.payload,
			};
		case REFRESH_NOTIFICATIONS:
			return {
				...state,
				notifications: action.payload,
			};
		default:
			return state;
	}
}

export default notificationsReducer;