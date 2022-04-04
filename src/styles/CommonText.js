import { StyleSheet } from "react-native";
import { TEXT_COLOR, LIGHT_GREY_COLOR } from "./Colors";

const commonTextStyles = StyleSheet.create({
	usernameText: {
		color: TEXT_COLOR,
		fontSize: 16,
		fontWeight: "bold",
		opacity: 0.77,
	},
	dateText: {
		justifyContent: "center",
		color: LIGHT_GREY_COLOR,
		fontSize: 15,
	},
	timeElapsedText: {
		color: LIGHT_GREY_COLOR,
		fontSize: 15,
		marginLeft: 5,
	},
});

export default commonTextStyles;
