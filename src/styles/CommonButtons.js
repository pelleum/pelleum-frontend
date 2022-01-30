import { StyleSheet } from "react-native";
import { MAIN_SECONDARY_COLOR } from "./Colors";

const commonButtonStyles = StyleSheet.create({
    assetButton: {
		width: 80,
		paddingRight: 5,
        paddingVertical: 10,
		alignItems: "flex-start",
	},
	assetText: {
		color: MAIN_SECONDARY_COLOR,
		fontSize: 16,
		fontWeight: "bold",
	}
});

export default commonButtonStyles;