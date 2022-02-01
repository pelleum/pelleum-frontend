import { store } from "../redux/Store";
import pelleumClient from "../api/clients/PelleumClient";
import { ReactionType } from "../redux/actions/ThesisReactionsActions";
import {
	removeReaction,
	addReaction,
} from "../redux/actions/ThesisReactionsActions";
import {
	THESES_BASE_PATH,
	THESES_REACTIONS_BASE_PATH,
	GET_MANY_THESES_PATH,
} from "@env";

class ThesesManager {
	static getState = () => {
		const storeState = store.getState();
		const state = storeState.thesisReactionsReducer;
		return state;
	};

	static likeThesis = async (item, reactionType) => {
		const authorizedResponse = await pelleumClient({
			method: "post",
			url: `${THESES_REACTIONS_BASE_PATH}/${item.thesis_id}`,
			data: { reaction: 1 },
		});
		if (authorizedResponse) {
			if (authorizedResponse.status == 201) {
				store.dispatch(addReaction(item.thesis_id, reactionType));
			} else {
				console.log("There was an error liking a post.");
			}
		}
	};

	static unlikeThesis = async (item, reactionType) => {
		const authorizedResponse = await pelleumClient({
			method: "delete",
			url: `${THESES_REACTIONS_BASE_PATH}/${item.thesis_id}`,
		});
		if (authorizedResponse) {
			if (authorizedResponse.status == 204) {
				store.dispatch(removeReaction(item.thesis_id, reactionType));
			} else {
				console.log("There was an error un-liking a thesis.");
			}
		}
	};

	static dislikeThesis = async (item, reactionType) => {
		const authorizedResponse = await pelleumClient({
			method: "post",
			url: `${THESES_REACTIONS_BASE_PATH}/${item.thesis_id}`,
			data: { reaction: -1 },
		});
		if (authorizedResponse) {
			if (authorizedResponse.status == 201) {
				store.dispatch(addReaction(item.thesis_id, reactionType));
			} else {
				console.log("There was an error liking a post.");
			}
		}
	};

	static removeDislikeOnThesis = async (item, reactionType) => {
		const authorizedResponse = await pelleumClient({
			method: "delete",
			url: `${THESES_REACTIONS_BASE_PATH}/${item.thesis_id}`,
		});
		if (authorizedResponse) {
			if (authorizedResponse.status == 204) {
				store.dispatch(removeReaction(item.thesis_id, reactionType));
			} else {
				console.log("There was an error un-liking a thesis.");
			}
		}
	};

	static getThesis = async (thesis_id) => {
		const authorizedResponse = await pelleumClient({
			method: "get",
			url: `${THESES_BASE_PATH}/${thesis_id}`,
		});

		if (authorizedResponse) {
			if (authorizedResponse.status == 200) {
				return authorizedResponse.data;
			}
			// need to display "an unexpected error occured"
			console.log("There was an error obtaining the thesis.");
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
			url: GET_MANY_THESES_PATH,
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
			url: THESES_BASE_PATH,
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
}
export default ThesesManager;
