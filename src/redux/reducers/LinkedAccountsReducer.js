// Local action imports
import { UPDATE_ACCOUNTS_STATUS } from "../actions/LinkedAccountsActions";

// Declare initial state
const initialState = {
	linkedAccounts: [],
	institutionLogin: false,
	updatedAt: null,
};

function linkedAccountsReducer(state = initialState, action) {
	switch (action.type) {
		case UPDATE_ACCOUNTS_STATUS:
			const nowIsoString = new Date().toISOString();
			const nowStringWithNoZ = nowIsoString.slice(0, -1);
			const now = new Date(nowStringWithNoZ).getTime();

			return {
				...state,
				linkedAccounts: action.payload,
				updatedAt: now,
			};
		default:
			return state;
	}
}

export default linkedAccountsReducer;
