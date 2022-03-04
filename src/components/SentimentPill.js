import { StyleSheet } from "react-native";
import React from "react";
import AppText from "./AppText";
import { LinearGradient } from "expo-linear-gradient";
import { BAD_COLOR, GOOD_COLOR } from "../styles/Colors";

export class Sentiment {
	static Bull = new Sentiment("bull");
	static Bear = new Sentiment("bear");

	constructor(type) {
		this.type = type;
	}
}

const SentimentPill = ({ item, sentiment }) => {
	let colors;
	let style;

	if (sentiment == Sentiment.Bull) {
		colors = ["#195c01", "#195c01", "#195c01"];
		style = styles.bullSentimentText;
	} else {
		colors = ["#5c0101", "#5c0101", "#5c0101"];
		style = styles.bearSentimentText;
	}

	return (
		// <LinearGradient
		// 	colors={colors}
		// 	style={styles.linearGradient}
		// 	start={{ y: 0.0, x: 0.0 }}
		// 	end={{ y: 1.0, x: 1.0 }}
		// >
			<AppText style={style}>{item.sentiment.toUpperCase()}</AppText>
		// </LinearGradient>
	);
};

export default SentimentPill;

const styles = StyleSheet.create({
	linearGradient: {
		borderRadius: 15,
		width: 70,
		padding: 5,
		opacity: 0.7,
	},
	bullSentimentText: {
		color: GOOD_COLOR,
		borderWidth: 0.5,
		borderColor: GOOD_COLOR,
		backgroundColor: "#003308",
		borderRadius: 15,
		width: 70,
		padding: 5,
		textAlign: "center",
		justifyContent: "center",
		fontSize: 16,
		fontWeight: "bold",
		overflow: "hidden",
		opacity: 0.5,
	},
	bearSentimentText: {
		color: BAD_COLOR,
		borderWidth: 0.5,
		borderColor: BAD_COLOR,
		backgroundColor: "#330000",
		borderRadius: 15,
		width: 70,
		padding: 5,
		textAlign: "center",
		justifyContent: "center",
		fontSize: 16,
		fontWeight: "bold",
		overflow: "hidden",
		opacity: 0.5,
	},
});
