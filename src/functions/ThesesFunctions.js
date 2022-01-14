import { store } from "../redux/Store";
import pelleumClient from "../api/clients/PelleumClient";
import { ReactionType } from "../redux/actions/ThesisReactionsActions";
import {
	removeReaction,
	addReaction,
} from "../redux/actions/ThesisReactionsActions";
import { addToLibrary } from "../redux/actions/RationaleActions";

const getState = () => {
	const storeState = store.getState();
	const state = storeState.thesisReactionsReducer;
	return state;
};

const likeThesis = async (item, reactionType) => {
	const authorizedResponse = await pelleumClient({
		method: "post",
		url: `/public/theses/reactions/${item.thesis_id}`,
		data: { reaction: 1 },
	});
	if (authorizedResponse.status == 201) {
		store.dispatch(addReaction(item.thesis_id, reactionType));
	} else {
		console.log("There was an error liking a post.");
	}
};

const unlikeThesis = async (item, reactionType) => {
	const authorizedResponse = await pelleumClient({
		method: "delete",
		url: `/public/theses/reactions/${item.thesis_id}`,
	});
	if (authorizedResponse.status == 204) {
		store.dispatch(removeReaction(item.thesis_id, reactionType));
	} else {
		console.log("There was an error un-liking a thesis.");
	}
};

const dislikeThesis = async (item, reactionType) => {
	const authorizedResponse = await pelleumClient({
		method: "post",
		url: `/public/theses/reactions/${item.thesis_id}`,
		data: { reaction: -1 },
	});
	if (authorizedResponse.status == 201) {
		store.dispatch(addReaction(item.thesis_id, reactionType));
	} else {
		console.log("There was an error liking a post.");
	}
};

const removeDislikeOnThesis = async (item, reactionType) => {
	const authorizedResponse = await pelleumClient({
		method: "delete",
		url: `/public/theses/reactions/${item.thesis_id}`,
	});
	if (authorizedResponse.status == 204) {
		store.dispatch(removeReaction(item.thesis_id, reactionType));
	} else {
		console.log("There was an error un-liking a thesis.");
	}
};

export const getThesis = async (thesis_id) => {
	const authorizedResponse = await pelleumClient({
		method: "get",
		url: `/public/theses/${thesis_id}`,
	});

	if (authorizedResponse) {
		if (authorizedResponse.status == 200) {
			return authorizedResponse.data;
		}
		// need to display "an unexpected error occured"
		console.log("There was an error obtaining the thesis.");
	}
};

export const addThesisRationale = async (item) => {
	const authorizedResponse = await pelleumClient({
		method: "post",
		url: '/public/theses/rationales',
		data: { thesis_id: item.thesis_id },
	});

	if (authorizedResponse) {
		if (authorizedResponse.status == 201) {
			store.dispatch(addToLibrary(item.thesis_id));
		} else {
			console.log("There was an error adding the thesis to your library.");
		};
	};
};

export const extractThesesIDs = async (theses) => {
	const thesesIDs = [];
	for (const thesis of theses) {
		thesesIDs.push(thesis.thesis_id)
	};
	return thesesIDs;
};

export const sendThesisReaction = async (item, reactionType) => {
	const thesisIsLiked = () => {
		const state = getState();
		return (
			(item.user_reaction_value == 1 &&
				!state.locallyUnlikedTheses.includes(item.thesis_id) &&
				!state.locallyDislikedTheses.includes(item.thesis_id) &&
				!state.locallyRemovedDislikedTheses.includes(item.thesis_id)) ||
			state.locallyLikedTheses.includes(item.thesis_id)
		);
	};

	const thesisIsDisliked = () => {
		const state = getState();
		return (
			(item.user_reaction_value == -1 &&
				!state.locallyRemovedDislikedTheses.includes(item.thesis_id) &&
				!state.locallyLikedTheses.includes(item.thesis_id) &&
				!state.locallyUnlikedTheses.includes(item.thesis_id)) ||
			state.locallyDislikedTheses.includes(item.thesis_id)
		);
	};

	if (reactionType == ReactionType.Like) {
		// See if thesis is already liked
		if (thesisIsLiked()) {
			unlikeThesis(item, reactionType);
		} else {
			likeThesis(item, reactionType);
		}
	} else {
		// See if thesis is already disliked
		if (thesisIsDisliked()) {
			removeDislikeOnThesis(item, reactionType);
		} else {
			dislikeThesis(item, reactionType);
		}
	}
};
