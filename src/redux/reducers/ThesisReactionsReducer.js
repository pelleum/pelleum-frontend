import {
	ADD_REACTION,
	REMOVE_REACTION,
	RESET_REACTIONS,
	ReactionType,
} from "../actions/ThesisReactionsActions";

// Declare initial state
const initialState = {
	locallyLikedTheses: [],
	locallyUnlikedTheses: [],
	locallyDislikedTheses: [],
	locallyRemovedDislikedTheses: [],
};

function thesisReactionsReducer(state = initialState, action) {
	// This reducer's sole function is to maintain like/dislike state in-between refreshes
	// A thesisId should only be in one of the above 4 arrays a time
	const stateCopy = state;
	let arrayToAddTo;

	switch (action.type) {
		case ADD_REACTION:
			// Add to locallyLikedTheses or locallyDislikedTheses, remove from every other array
			var reactionTypeIsLike = (action.payload.reactionType == ReactionType.Like);
			arrayToAddTo = (reactionTypeIsLike) ? "locallyLikedTheses" : "locallyDislikedTheses";

			Object.entries(state).forEach(([key, value]) => {
				if (key != arrayToAddTo) {
					let stateArrayCopy = value;
					let index = stateArrayCopy.indexOf(action.payload.thesisId);
					if (index > -1) {
						stateArrayCopy.splice(index, 1);
					}
					stateCopy[key] = stateArrayCopy;
				}
			});

			return {
				...state,
				locallyLikedTheses: (reactionTypeIsLike) ? [...state.locallyLikedTheses, action.payload.thesisId] : stateCopy.locallyLikedTheses,
				locallyUnlikedTheses: stateCopy.locallyUnlikedTheses,
				locallyDislikedTheses: (reactionTypeIsLike) ? stateCopy.locallyDislikedTheses : [...state.locallyDislikedTheses, action.payload.thesisId],
				locallyRemovedDislikedTheses: stateCopy.locallyRemovedDislikedTheses,
			};

		case REMOVE_REACTION:
			// Add to locallyUnlikedTheses or locallyRemovedDislikedTheses, remove from every other array
			var reactionTypeIsLike = (action.payload.reactionType == ReactionType.Like);
			arrayToAddTo = (reactionTypeIsLike) ? "locallyUnlikedTheses" : "locallyRemovedDislikedTheses";
			

			Object.entries(state).forEach(([key, value]) => {
				if (key != arrayToAddTo) {
					let stateArrayCopy = value;
					let index = stateArrayCopy.indexOf(action.payload.thesisId);
					if (index > -1) {
						stateArrayCopy.splice(index, 1);
					}
					stateCopy[key] = stateArrayCopy;
				}
			});

			return {
				...state,
				locallyLikedTheses: stateCopy.locallyLikedTheses,
				locallyUnlikedTheses: (reactionTypeIsLike) ? [...state.locallyUnlikedTheses, action.payload.thesisId] : stateCopy.locallyUnlikedTheses,
				locallyDislikedTheses: stateCopy.locallyDislikedTheses,
				locallyRemovedDislikedTheses: (reactionTypeIsLike) ? stateCopy.locallyRemovedDislikedTheses : [...state.locallyRemovedDislikedTheses, action.payload.thesisId],
			};

		case RESET_REACTIONS:
			// Reset all arrays to []
			return {
				...state,
				locallyLikedTheses: action.payload,
				locallyUnlikedTheses: action.payload,
				locallyDislikedTheses: action.payload,
				locallyRemovedDislikedTheses: action.payload,
			};
		default:
			return state;
	}
}

export default thesisReactionsReducer;
