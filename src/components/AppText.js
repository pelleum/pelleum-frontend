// CustomText.js
import React from "react";
import { Text, StyleSheet } from "react-native";

export default class AppText extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Text
				numberOfLines={
					this.props.numberOfLines ? this.props.numberOfLines : null
				}
				style={[styles.defaultStyle, this.props.style]}
			>
				{this.props.children}
			</Text>
		);
	}
}

const styles = StyleSheet.create({
	// ... add your default style here
	defaultStyle: {
		color: "white",
	},
});
