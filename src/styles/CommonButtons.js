import { StyleSheet } from "react-native";
import { MAIN_SECONDARY_COLOR } from "./Colors";

const commonButtonStyles = StyleSheet.create({
    assetButton: {
		width: 70,
		padding: 5,
		alignItems: "center",
	},
	assetText: {
		color: MAIN_SECONDARY_COLOR,
		fontSize: 16,
		fontWeight: "bold",
	},
    linearGradient: {
        borderRadius: 15,
        width: 70,
        //justifyContent: "center",
        padding: 5
      },
    bullSentimentText: {
		textAlign: "center",
		//width: 70,
		//backgroundColor: "#c6edc5",
		//borderColor: "#1c7850",
		//borderRadius: 15,
		//padding: 5,
		justifyContent: "center",
		//color: "#1c7850",
		fontSize: 16,
		fontWeight: "bold",
		overflow: "hidden",
	},
	bearSentimentText: {
		textAlign: "center",
		//width: 70,
		//borderWidth: 0.5,
		//backgroundColor: "#edcec5",
		//borderColor: "#b02802",
		//borderRadius: 15,
		//padding: 5,
		justifyContent: "center",
		//color: "#b02802",
		fontSize: 16,
		fontWeight: "bold",
		overflow: "hidden",
	},
});

export default commonButtonStyles;