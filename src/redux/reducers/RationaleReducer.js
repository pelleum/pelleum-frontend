import { ADD_TO_LIBRARY, REMOVE_FROM_LIBRARY, REFRESH_LIBRARY } from "../actions/RationaleActions";

// Declare initial state
const initialState = {
    rationaleLibrary: [],
    updatedAt: null,
};

function rationaleReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_TO_LIBRARY:
            const addedToRationaleLibrary = [
                ...state.rationaleLibrary,
                action.payload,
            ];
            return {
                ...state,
                rationaleLibrary: addedToRationaleLibrary,
            };
        case REMOVE_FROM_LIBRARY:
            const rationaleLibraryCopy = state.rationaleLibrary;
            const index = rationaleLibraryCopy.indexOf(action.payload);
            if (index > -1) {
                rationaleLibraryCopy.splice(index, 1);
            };
            return {
                ...state,
                rationaleLibrary: rationaleLibraryCopy,
            };
        case REFRESH_LIBRARY:
            const nowIsoString = new Date().toISOString();
            const nowStringWithNoZ = nowIsoString.slice(0, -1);
            const now = new Date(nowStringWithNoZ).getTime();
            
            return {
                ...state,
                rationaleLibrary: action.payload,
                updatedAt: now,
                
			};
        default:
            return state;
    }
}


export default rationaleReducer;