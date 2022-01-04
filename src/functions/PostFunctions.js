import * as SecureStore from "expo-secure-store";
import { store } from "../redux/Store";
import pelleumClient from "../api/clients/PelleumClient";
import { addLike, removeLike } from "../redux/actions/PostReactionsActions";

export const getPosts = async () => {
	const authorizedResponse = await pelleumClient({
		method: "get",
		url: "/public/posts/retrieve/many",
	});

	if (authorizedResponse) {
		if (authorizedResponse.status == 200) {
			const retrievedPosts = authorizedResponse.data.records.posts;
			return retrievedPosts;
		}
		// need to display "an unexpected error occured"
		console.log("There was an error obtianing feed posts.");
	}
};

export const getComments = async ({
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
		url: "/public/posts/retrieve/many",
		queryParams: params,
	});

	if (authorizedResponse) {
		if (authorizedResponse.status == 200) {
			const retrievedComments = authorizedResponse.data.records.posts;
			return retrievedComments;
		}
		// need to display "an unexpected error occured"
		console.log("There was an error obtianing feed posts.");
	}
};

// Do we even still need this function? Leaving it here just in case.
export const getUserLikes = async (timeRange) => {
	const userObjectString = await SecureStore.getItemAsync("userObject");
	const userObject = JSON.parse(userObjectString);

	const authorizedResponse = await pelleumClient({
		method: "get",
		url: "/public/posts/reactions/retrieve/many",
		queryParams: {
			user_id: userObject.user_id,
			start_time: timeRange.oldestPostCreatedAt,
			end_time: timeRange.newestPostCreatedAt,
		},
	});

	if (authorizedResponse) {
		if (authorizedResponse.status == 200) {
			const likedPosts = [];
			const usersPostReactions =
				authorizedResponse.data.records.posts_reactions;
			Object.values(usersPostReactions).forEach((value) =>
				likedPosts.push(value.post_id)
			);
			return likedPosts;
		}
		// need to display "an unexpected error occured"
		console.log("There was an error obtianing user's liked posts.");
	}
};

export const sendPostReaction = async (item) => {

	const state = store.getState();
    const locallyLikedPosts = state.postReactionsReducer.locallyLikedPosts
    const locallyUnlikedPosts = state.postReactionsReducer.locallyUnlikedPosts
	
	// Like or un-like a post
	if (
		(item.user_reaction_value == 1 && !locallyUnlikedPosts.includes(item.post_id)) ||
		locallyLikedPosts.includes(item.post_id)
	) {
		const authorizedResponse = await pelleumClient({
			method: "delete",
			url: `/public/posts/reactions/${item.post_id}`,
		});
		if (authorizedResponse.status == 204) {
            store.dispatch(removeLike(item.post_id));
		} else {
			console.log("There was an error un-liking a post.");
		}
	} else {
		const authorizedResponse = await pelleumClient({
			method: "post",
			url: `/public/posts/reactions/${item.post_id}`,
			data: { reaction: 1 },
		});
		if (authorizedResponse.status == 201) {
			store.dispatch(addLike(item.post_id));
		} else {
			console.log("There was an error liking a post.");
		}
	}
};
