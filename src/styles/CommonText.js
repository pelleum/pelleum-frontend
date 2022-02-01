import { StyleSheet } from "react-native";
import { TEXT_COLOR, LIGHT_GREY_COLOR } from "./Colors";

const commonTextStyles = StyleSheet.create({
	usernameText: {
		color: TEXT_COLOR,
		fontSize: 16,
		fontWeight: "bold",
	},
	dateText: {
		justifyContent: "center",
		color: LIGHT_GREY_COLOR,
		fontSize: 16,
	},
});

export default commonTextStyles;
