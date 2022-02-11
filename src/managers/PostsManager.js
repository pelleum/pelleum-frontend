import * as SecureStore from "expo-secure-store";
import pelleumClient from "../api/clients/PelleumClient";
import {
	REACT_APP_POSTS_BASE_PATH,
	REACT_APP_GET_MANY_POSTS_PATH,
	REACT_APP_GET_MANY_POST_REACTIONS_PATH,
	REACT_APP_POST_REACTIONS_BASE_PATH,
} from "@env";
import * as Haptics from "expo-haptics";

import { store } from "../redux/Store";
import { addLike, removeLike } from "../redux/actions/PostReactionsActions";

class PostsManager {
	static createPost = async (data) => {
		const authorizedResponse = await pelleumClient({
			method: "post",
			url: REACT_APP_POSTS_BASE_PATH,
			data: data,
		});

		if (authorizedResponse) {
			if (authorizedResponse.status == 201) {
				return authorizedResponse.data;
			} else {
				console.log(
					"An unexpected error occured. Your content was not shared."
				);
			}
		}
	};

	static deletePost = async (postId) => {
		const authorizedResponse = await pelleumClient({
			method: "delete",
			url: `${REACT_APP_POSTS_BASE_PATH}/${postId}`,
		});

		if (authorizedResponse) {
			return authorizedResponse;
		}
	};

	static getPosts = async (queryParams) => {
		const authorizedResponse = await pelleumClient({
			method: "get",
			url: REACT_APP_GET_MANY_POSTS_PATH,
			queryParams: queryParams,
		});

		if (authorizedResponse) {
			if (authorizedResponse.status == 200) {
				return authorizedResponse.data;
			}
			// need to display "an unexpected error occured"
			console.log("There was an error obtaining posts.");
		}
	};

	static getPost = async (post_id) => {
		const authorizedResponse = await pelleumClient({
			method: "get",
			url: `${REACT_APP_POSTS_BASE_PATH}/${post_id}`,
		});

		if (authorizedResponse) {
			if (authorizedResponse.status == 200) {
				return { postExists: true, post: authorizedResponse.data };
			} else if (authorizedResponse.status == 400) {
				return { postExists: false, post: null }
			}
			// need to display "an unexpected error occured"
			console.log("There was an error obtaining the post.");
		}
	};

	static getComments = async ({
		is_post_comment_on = null,
		is_thesis_comment_on = null,
	} = {}) => {
		const params = {};

		if (is_post_comment_on) {
			params["is_post_comment_on"] = is_post_comment_on;
		}

		if (is_thesis_comment_on) {
			params["is_thesis_comment_on"] = is_thesis_comment_on;
		}

		const authorizedResponse = await pelleumClient({
			method: "get",
			url: REACT_APP_GET_MANY_POSTS_PATH,
			queryParams: params,
		});

		if (authorizedResponse) {
			if (authorizedResponse.status == 200) {
				return authorizedResponse.data;
			}
			// need to display "an unexpected error occured"
			console.log("There was an error obtaining feed posts.");
		}
	};
	// Do we even still need this function? Leaving it here just
	// in case we switch back to frontend computation
	static getUserLikes = async (timeRange) => {
		const userObjectString = await SecureStore.getItemAsync("userObject");
		const userObject = JSON.parse(userObjectString);

		const authorizedResponse = await pelleumClient({
			method: "get",
			url: REACT_APP_GET_MANY_POST_REACTIONS_PATH,
			queryParams: {
				user_id: userObject.user_id,
				start_time: timeRange.oldestPostCreatedAt,
				end_time: timeRange.newestPostCreatedAt,
			},
		});
	};

	static sendPostReaction = async (item) => {
		const state = store.getState();
		const locallyLikedPosts = state.postReactionsReducer.locallyLikedPosts;
		const locallyUnlikedPosts = state.postReactionsReducer.locallyUnlikedPosts;

		// Like or un-like a post
		if (
			(item.user_reaction_value == 1 &&
				!locallyUnlikedPosts.includes(item.post_id)) ||
			locallyLikedPosts.includes(item.post_id)
		) {
			const authorizedResponse = await pelleumClient({
				method: "delete",
				url: `${REACT_APP_POST_REACTIONS_BASE_PATH}/${item.post_id}`,
			});

			if (authorizedResponse) {
				if (authorizedResponse.status == 204) {
					store.dispatch(removeLike(item.post_id));
					Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
				} else {
					console.log("There was an error un-liking a post.");
				}
			}
		} else {
			const authorizedResponse = await pelleumClient({
				method: "post",
				url: `${REACT_APP_POST_REACTIONS_BASE_PATH}/${item.post_id}`,
				data: { reaction: 1 },
			});
			if (authorizedResponse) {
				if (authorizedResponse.status == 201) {
					store.dispatch(addLike(item.post_id));
					Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
				} else {
					console.log("There was an error liking a post.");
				}
			}
		}
	};
}

export default PostsManager;
