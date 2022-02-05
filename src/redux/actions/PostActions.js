export const ADD_POST = "ADD_POST";
export const REMOVE_POST = "REMOVE_POST";
export const SET_POSTS = "SET_POSTS";
export const SET_AUTHORED_POSTS = "SET_USERS_POSTS";
export const REMOVE_AUTHORED_POST = "REMOVE_USERS_POST";
export const SET_COMMENTS = "SET_COMMENTS";
export const ADD_COMMENT = "ADD_COMMENT";
export const REMOVE_COMMENT = "REMOVE_COMMENT";

// FEED POSTS
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

// USER'S AUTHORED POSTS
export const setAuthoredPosts = (posts) => (dispatch) => {
	dispatch({
		type: SET_AUTHORED_POSTS,
		payload: posts,
	});
};

export const removeAuthoredPost = (post) => (dispatch) => {
	dispatch({
		type: REMOVE_AUTHORED_POST,
		payload: post,
	});
};

// COMMENTS
export const setComments = (comments) => (dispatch) => {
	dispatch({
		type: SET_COMMENTS,
		payload: comments,
	});
};

export const addComment = (comment) => (dispatch) => {
	dispatch({
		type: ADD_COMMENT,
		payload: comment,
	});
};

export const removeComment = (comment) => (dispatch) => {
	dispatch({
		type: REMOVE_COMMENT,
		payload: comment,
	});
};