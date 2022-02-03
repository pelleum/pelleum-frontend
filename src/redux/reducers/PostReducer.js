import {
	ADD_POST,
	REMOVE_POST,
	SET_POSTS,
} from "../actions/PostActions";

const initialState = {
	posts: []
};

function postReducer(state = initialState, action) {
	switch (action.type) {
		case ADD_POST:
			// Add post to posts
            const postsWithNewPostAdded = state.posts;
            postsWithNewPostAdded.unshift(action.payload);

			return {
				...state,
				posts: postsWithNewPostAdded,
			};
		case REMOVE_POST:
			// Remove post from posts
			let postsAfterRemoval = state.posts;
			postsAfterRemoval = postsAfterRemoval.filter(function( post ) {
                return post.post_id !== action.payload.post_id;
            });

			return {
				...state,
				posts: postsAfterRemoval,
			};
		case SET_POSTS:
            // Set posts to new array of posts
			return {
				...state,
				posts: action.payload,
			};
		default:
			return state;
	}
}

export default postReducer;