import {
	ADD_POST,
	REMOVE_POST,
	SET_POSTS,
    SET_AUTHORED_POSTS,
    REMOVE_AUTHORED_POST,
    SET_COMMENTS,
    ADD_COMMENT,
    REMOVE_COMMENT,
} from "../actions/PostActions";

const initialState = {
	posts: [],
    userAuthoredPosts: [],
    comments: [],
    deleted: []
};

function postReducer(state = initialState, action) {
	switch (action.type) {
        // ---------------- FEED POSTS ---------------- //
		case ADD_POST:
			// Add post to state.posts
            const postsWithNewPostAdded = state.posts;
            postsWithNewPostAdded.unshift(action.payload);

			return {
				...state,
				posts: postsWithNewPostAdded,
			};
		case REMOVE_POST:
			// Remove post from state.posts
			let postsAfterRemoval = state.posts;
			postsAfterRemoval = postsAfterRemoval.filter(function( post ) {
                return post.post_id !== action.payload.post_id;
            });

            var deletedCopy = state.deleted;
            deletedCopy.unshift(action.payload);

			return {
				...state,
                deleted: deletedCopy,
				posts: postsAfterRemoval,
			};
		case SET_POSTS:
            // Set state.posts to new array of posts
			return {
				...state,
				posts: action.payload,
			};


        // ----------- USER'S AUTHORED POSTS ----------- //
        case SET_AUTHORED_POSTS:
            // Set state.userAuthoredPosts to new array of user's posts
			return {
				...state,
				userAuthoredPosts: action.payload,
			};
        case REMOVE_AUTHORED_POST:
			// Remove user's post from state.userAuthoredPosts
			let usersPostsAfterRemoval = state.userAuthoredPosts;
			usersPostsAfterRemoval = usersPostsAfterRemoval.filter(function( post ) {
                return post.post_id !== action.payload.post_id;
            });

            var deletedCopy = state.deleted;
            deletedCopy.unshift(action.payload);

			return {
				...state,
                deleted: deletedCopy,
				userAuthoredPosts: usersPostsAfterRemoval,
			};


        // --------------- ALL COMMENTS --------------- //
        case ADD_COMMENT:
            // Add new comment to state.comments
            const commentsWithNewCommentAdded = state.comments;
            commentsWithNewCommentAdded.unshift(action.payload);

			return {
				...state,
				comments: commentsWithNewCommentAdded,
			};
        case REMOVE_COMMENT:
            // Remove comment from state.comments
            let commentsAfterRemoval = state.comments;
			commentsAfterRemoval = commentsAfterRemoval.filter(function( comment ) {
                return comment.post_id !== action.payload.post_id;
            });

            var deletedCopy = state.deleted;
            deletedCopy.unshift(action.payload);

			return {
				...state,
                deleted: deletedCopy,
				comments: commentsAfterRemoval,
			};
        case SET_COMMENTS:
            // Set state.comments to new array of comments
            return {
                ...state,
                comments: action.payload,
            };
		default:
			return state;
	}
}

export default postReducer;