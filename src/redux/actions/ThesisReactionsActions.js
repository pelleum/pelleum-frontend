export const ADD_REACTION = "ADD_REACTION";
export const REMOVE_REACTION = "REMOVE_REACTION";
export const RESET_REACTIONS = "RESET_REACTIONS";

export class ReactionType {
	static Like = new ReactionType("like");
	static Dislike = new ReactionType("dislike");

	constructor(type) {
		this.type = type;
	}
}

export const addReaction = (thesisId, reactionType) => (dispatch) => {
	dispatch({
		type: ADD_REACTION,
		payload: { thesisId: thesisId, reactionType: reactionType },
	});
};

export const removeReaction = (thesisId, reactionType) => (dispatch) => {
	dispatch({
		type: REMOVE_REACTION,
		payload: { thesisId: thesisId, reactionType: reactionType },
	});
};

export const resetReactions = () => (dispatch) => {
	dispatch({
		type: RESET_REACTIONS,
		payload: [],
	});
};
