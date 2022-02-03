export const ADD_POST = "ADD_POST";
export const REMOVE_POST = "REMOVE_POST";
export const SET_POSTS = "SET_POSTS";

export const addPost = (post) => (dispatch) => {
	dispatch({
		type: ADD_POST,
		payload: post,
	});
};

export const removePost = (post) => (dispatch) => {
	dispatch({
		type: REMOVE_POST,
		payload: post,
	});
};

export const setPosts = (posts) => (dispatch) => {
	dispatch({
		type: SET_POSTS,
		payload: posts,
	});
};