import { StyleSheet } from "react-native";
import React from "react";
import AppText from "./AppText";
import { LinearGradient } from "expo-linear-gradient";


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
		colors = ["#30D325", "#24a600", "#135900"];
		style = styles.bullSentimentText;
	} else {
		colors = ["#ff0000", "#b50000", "#660000"];
		style = styles.bearSentimentText;
	}

	return (
		<LinearGradient
			colors={colors}
			style={styles.linearGradient}
			start={{ y: 0.0, x: 0.0 }}
			end={{ y: 1.0, x: 1.0 }}
		>
			<AppText style={style}>
				{item.sentiment.toUpperCase()}
			</AppText>
		</LinearGradient>
	);
};

export default SentimentPill;

const styles = StyleSheet.create({
	linearGradient: {
		borderRadius: 15,
		width: 70,
		padding: 5
	},
	bullSentimentText: {
		textAlign: "center",
		justifyContent: "center",
		fontSize: 16,
		fontWeight: "bold",
		overflow: "hidden",
	},
	bearSentimentText: {
		textAlign: "center",
		justifyContent: "center",
		fontSize: 16,
		fontWeight: "bold",
		overflow: "hidden",
	},
});
