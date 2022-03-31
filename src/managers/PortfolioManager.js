import pelleumClient from "../api/clients/PelleumClient";
import Config from "../../Config";

class PortfolioManager {
	static retrieveAssets = async (userID) => {
		const authorizedResponse = await pelleumClient({
			method: "get",
			url: `${Config.getAssetsBasePath}/${userID}`,
		});

		if (authorizedResponse) {
			if (authorizedResponse.status == 200) {
				return authorizedResponse.data;
			} else {
				console.log(
					"There was an error retrieving the assets from the backend."
				);
			}
		}
	};
}

export default PortfolioManager;
