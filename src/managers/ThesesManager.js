import pelleumClient from "../api/clients/PelleumClient";
import * as Haptics from "expo-haptics";
import Config from "../../Config";

// Redux
import { ReactionType } from "../redux/actions/ThesisReactionsActions";
import { removeReaction, addReaction } from "../redux/actions/ThesisReactionsActions";
import { store } from "../redux/Store";

class ThesesManager {
	static getState = () => {
		const storeState = store.getState();
		const state = storeState.thesisReactionsReducer;
		return state;
	};

	static likeThesis = async (item, reactionType) => {
		const authorizedResponse = await pelleumClient({
			method: "post",
			url: `${Config.thesesReactionsPath}/${item.thesis_id}`,
			data: { reaction: 1 },
		});
		if (authorizedResponse) {
			if (authorizedResponse.status == 201) {
				store.dispatch(addReaction(item.thesis_id, reactionType));
				Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
			} else {
				console.log("There was an error liking a thesis.");
			}
		}
	};

	static unlikeThesis = async (item, reactionType) => {
		const authorizedResponse = await pelleumClient({
			method: "delete",
			url: `${Config.thesesReactionsPath}/${item.thesis_id}`,
		});
		if (authorizedResponse) {
			if (authorizedResponse.status == 200) {
				store.dispatch(removeReaction(item.thesis_id, reactionType));
				Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
			} else {
				console.log("There was an error un-liking a thesis.");
			}
		}
	};

	static dislikeThesis = async (item, reactionType) => {
		const authorizedResponse = await pelleumClient({
			method: "post",
			url: `${Config.thesesReactionsPath}/${item.thesis_id}`,
			data: { reaction: -1 },
		});
		if (authorizedResponse) {
			if (authorizedResponse.status == 201) {
				store.dispatch(addReaction(item.thesis_id, reactionType));
				Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
			} else {
				console.log("There was an error disliking a thesis.");
			}
		}
	};

	static removeDislikeOnThesis = async (item, reactionType) => {
		const authorizedResponse = await pelleumClient({
			method: "delete",
			url: `${Config.thesesReactionsPath}/${item.thesis_id}`,
		});
		if (authorizedResponse) {
			if (authorizedResponse.status == 200) {
				store.dispatch(removeReaction(item.thesis_id, reactionType));
				Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
			} else {
				console.log("There was an error un-disliking a thesis.");
			}
		}
	};

	static getThesisReaction = async (thesis) => {
		const authorizedResponse = await pelleumClient({
			method: "get",
			url: `${Config.thesesReactionsPath}/${thesis.thesis_id}`,
		});
		if (authorizedResponse) {
			if (authorizedResponse.status == 200) {
				return authorizedResponse.data
			} else {
				console.log("There was an error retrieving a thesis reaction.");
			}
		}
	}

	static getThesis = async (thesis_id) => {
		const authorizedResponse = await pelleumClient({
			method: "get",
			url: `${Config.thesesBasePath}/${thesis_id}`,
		});

		if (authorizedResponse) {
			return authorizedResponse;
		}
	};

	static sendThesisReaction = async (item, reactionType) => {
		const thesisIsLiked = () => {
			const state = this.getState();
			return (
				(item.user_reaction_value == 1 &&
					!state.locallyUnlikedTheses.includes(item.thesis_id) &&
					!state.locallyDislikedTheses.includes(item.thesis_id) &&
					!state.locallyRemovedDislikedTheses.includes(item.thesis_id)) ||
				state.locallyLikedTheses.includes(item.thesis_id)
			);
		};

		const thesisIsDisliked = () => {
			const state = this.getState();
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
				this.unlikeThesis(item, reactionType);
			} else {
				this.likeThesis(item, reactionType);
			}
		} else {
			// See if thesis is already disliked
			if (thesisIsDisliked()) {
				this.removeDislikeOnThesis(item, reactionType);
			} else {
				this.dislikeThesis(item, reactionType);
			}
		}
	};

	static getTheses = async (queryParams) => {
		const authorizedResponse = await pelleumClient({
			method: "get",
			url: Config.getManyThesesPath,
			queryParams: queryParams,
		});
		if (authorizedResponse) {
			if (authorizedResponse.status == 200) {
				return authorizedResponse.data;
			} else {
				console.log("There was an error retrieving theses from the backend.");
			}
		}
	};

	static createThesis = async (data) => {
		const authorizedResponse = await pelleumClient({
			method: "post",
			url: Config.thesesBasePath,
			data: data,
		});

		if (authorizedResponse) {
			return authorizedResponse;
		};
	};
}
export default ThesesManager;
