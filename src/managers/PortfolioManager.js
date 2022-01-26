import pelleumClient from "../api/clients/PelleumClient";

class PortfolioManager {

    static retrieveAssets = async (userID) => {
        const authorizedResponse = await pelleumClient({
            method: "get",
            url: `/public/portfolio/${userID}`,
        });
    
        if (authorizedResponse) {
            if (authorizedResponse.status == 200) {
                return authorizedResponse.data;
            } else {
                console.log("There was an error retrieving the assets from the backend.")
            }
        }
	}
}

export default PortfolioManager;