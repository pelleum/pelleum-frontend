export const ADD_LIKE = "ADD_LIKE";
export const REMOVE_LIKE = "REMOVE_LIKE";
export const RESET_LIKES = "RESET_LIKES";

export const addLike = (postId) => (dispatch) => {
	dispatch({
		type: ADD_LIKE,
		payload: postId,
	});
};

export const removeLike = (postId) => (dispatch) => {
	dispatch({
		type: REMOVE_LIKE,
		payload: postId,
	});
};

export const resetLikes = () => (dispatch) => {
	dispatch({
		type: RESET_LIKES,
		payload: [],
	});
};
