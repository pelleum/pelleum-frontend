import { ACKNOWLEDGE_NOTIFICATION, REFRESH_NOTIFICATIONS } from "../actions/NotificationActions";

// Declare initial state
const initialState = {
	notifications: [],
	acknowledgedNotifications: [],
};

function notificationsReducer(state = initialState, action) {
	switch (action.type) {
		case ACKNOWLEDGE_NOTIFICATION:
			const updatedAcknowledgeList = [
				...state.acknowledgedNotifications,
				action.payload,
			];
			return {
				...state,
				acknowledgedNotifications: updatedAcknowledgeList,
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