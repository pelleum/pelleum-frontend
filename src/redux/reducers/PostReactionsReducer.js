import { ADD_LIKE, REMOVE_LIKE, RESET_LIKES } from "../actions/PostReactionsActions";

// Declare initial state
const initialState = {
	locallyLikedPosts: [],
	locallyUnlikedPosts: [],
};

function postReactionsReducer(state = initialState, action) {
	switch (action.type) {
		case ADD_LIKE:
			// If post_id is in locallyUnlikedPosts, delete it from there
			const newlyAddedUnlikedPostsCopy = state.locallyUnlikedPosts;
			const unLikeIndex = newlyAddedUnlikedPostsCopy.indexOf(action.payload);
			if (unLikeIndex > -1) {
				newlyAddedUnlikedPostsCopy.splice(unLikeIndex, 1);
			}
			
            // Add post_id to locallyLikedPosts
			const newlyAddedLikedPostsUpdated = [
				...state.locallyLikedPosts,
				action.payload,
			];
			return {
				...state,
				locallyLikedPosts: newlyAddedLikedPostsUpdated,
				locallyUnlikedPosts: newlyAddedUnlikedPostsCopy,
			};
		case REMOVE_LIKE:
			// If post_id is in locallyLikedPosts, delete it from there
			const newlyAddedLikedPostsCopy = state.locallyLikedPosts;
			const likeIndex = newlyAddedLikedPostsCopy.indexOf(action.payload);
			if (likeIndex > -1) {
				newlyAddedLikedPostsCopy.splice(likeIndex, 1);
			}
			
            // Add post_id to locallyUnlikedPosts
			const newlyAddedUnlikedPostsUpdated = [
				...state.locallyUnlikedPosts,
				action.payload,
			];
			return {
				...state,
				locallyUnlikedPosts: newlyAddedUnlikedPostsUpdated,
				locallyLikedPosts: newlyAddedLikedPostsCopy,
			};
		case RESET_LIKES:
			return {
				...state,
				locallyLikedPosts: action.payload,
				locallyUnlikedPosts: action.payload,
			};
		default:
			return state;
	}
}

export default postReactionsReducer;
