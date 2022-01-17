import pelleumClient from "../api/clients/PelleumClient";
import { store } from "../redux/Store";
import { addToLibrary, removeFromLibrary } from "../redux/actions/RationaleActions";

class RationalesManager {

    static retrieveRationales = async (queryParams) => {
        const authorizedResponse = await pelleumClient({
			method: "get",
			url: '/public/theses/rationales/retrieve/many',
			queryParams: queryParams
		});

		if (authorizedResponse) {
			if (authorizedResponse.status == 200) {
                return authorizedResponse.data;
			} else {
                console.log("There was an error obtaining rationales from the backend.");
			};
		};
	}

    static addRationale = async (item) => {
		const authorizedResponse = await pelleumClient({
			method: "post",
			url: '/public/theses/rationales',
			data: { thesis_id: item.thesis_id },
		});
	
		if (authorizedResponse) {
			if (authorizedResponse.status == 201) {
				store.dispatch(addToLibrary({ thesisID: item.thesis_id, asset: item.asset_symbol }));
			} else {
				console.log("There was an error adding the thesis to your library.");
			};
		};
	};

    static removeRationale = async (item) => {
		const authorizedResponse = await pelleumClient({
			method: "delete",
			url: `/public/theses/rationales/${item.rationale_id}`,
		});

		if (authorizedResponse) {
			if (authorizedResponse.status == 204) {
				store.dispatch(removeFromLibrary({ thesisID: item.thesis_id, asset: item.asset_symbol }));
				return authorizedResponse.status;
			} else {
				console.log("There was an error removing the thesis from your library.");
			};
		};
    };

    static extractRationaleInfo = async (theses) => {
		const rationaleInfo = [];
		for (const thesis of theses) {
			rationaleInfo.push({thesisID: thesis.thesis_id, asset: thesis.asset_symbol});
		};
		return rationaleInfo;
	};
}

export default RationalesManager;