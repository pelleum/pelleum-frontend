import { StyleSheet } from "react-native";
import React from "react";
import AppText from "./AppText";
import { BAD_COLOR, GOOD_COLOR } from "../styles/Colors";

export class Sentiment {
	static Bull = new Sentiment("bull");
	static Bear = new Sentiment("bear");

	constructor(type) {
		this.type = type;
	}
}

const SentimentPill = ({ item, sentiment }) => {
	let style;

	if (sentiment == Sentiment.Bull) {
		style = styles.bullSentimentText;
	} else {
		style = styles.bearSentimentText;
	}

	return (
		<AppText style={style}>{item.sentiment.toUpperCase()}</AppText>
	);
};

export default SentimentPill;

const styles = StyleSheet.create({
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
		opacity: 0.65,
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
		opacity: 0.65,
	},
});
