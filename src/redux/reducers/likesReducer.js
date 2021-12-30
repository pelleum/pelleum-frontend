import { ADD_LIKE, REMOVE_LIKE, RESET_LIKES } from "../actions/likesActions";

// Declare initial state
const initialState = {
	newlyAddedLikedPosts: [],
	newlyAddedUnlikedPosts: [],
};

function likesReducer(state = initialState, action) {
	switch (action.type) {
		case ADD_LIKE:
			// If post_id is in newlyAddedUnlikedPosts, delete it from there
			const newlyAddedUnlikedPostsCopy = state.newlyAddedUnlikedPosts;
			const unLikeIndex = newlyAddedUnlikedPostsCopy.indexOf(action.payload);
			if (unLikeIndex > -1) {
				newlyAddedUnlikedPostsCopy.splice(unLikeIndex, 1);
			}
			
            // Add post_id to newlyAddedLikedPosts
			const newlyAddedLikedPostsUpdated = [
				...state.newlyAddedLikedPosts,
				action.payload,
			];
			return {
				...state,
				newlyAddedLikedPosts: newlyAddedLikedPostsUpdated,
				newlyAddedUnlikedPosts: newlyAddedUnlikedPostsCopy,
			};
		case REMOVE_LIKE:
			// If post_id is in newlyAddedLikedPosts, delete it from there
			const newlyAddedLikedPostsCopy = state.newlyAddedLikedPosts;
			const likeIndex = newlyAddedLikedPostsCopy.indexOf(action.payload);
			if (likeIndex > -1) {
				newlyAddedLikedPostsCopy.splice(likeIndex, 1);
			}
			
            // Add post_id to newlyAddedUnlikedPosts
			const newlyAddedUnlikedPostsUpdated = [
				...state.newlyAddedUnlikedPosts,
				action.payload,
			];
			return {
				...state,
				newlyAddedUnlikedPosts: newlyAddedUnlikedPostsUpdated,
				newlyAddedLikedPosts: newlyAddedLikedPostsCopy,
			};
		case RESET_LIKES:
			return {
				...state,
				newlyAddedLikedPosts: action.payload,
				newlyAddedUnlikedPosts: action.payload,
			};
		default:
			return state;
	}
}

export default likesReducer;
