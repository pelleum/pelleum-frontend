import React from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { LIGHT_GREY_COLOR, TEXT_COLOR } from "../styles/Colors";

const CommentInput = ({
	commentContent,
	commentContentValidity,
	changeContent,
	changeCommentContentValidity,
}) => {
	const handleChangeText = (newValue) => {
		let newCommentContentValidity = commentContentValidity;

		changeContent(newValue);

		if (newValue.length < 1) {
			newCommentContentValidity = false;
			changeCommentContentValidity(newCommentContentValidity);
		} else {
			newCommentContentValidity = true;
			changeCommentContentValidity(newCommentContentValidity);
		}
	};

	return (
		<View>
			<TextInput
				color={TEXT_COLOR}
				placeholder="Reply with your thoughts here"
				placeholderTextColor={LIGHT_GREY_COLOR}
				multiline={true}
				numberOfLines={20}
				style={styles.textArea}
				maxLength={512}
				value={commentContent}
				onChangeText={(newValue) => handleChangeText(newValue)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	textArea: {
		marginVertical: 30,
	},
});

export default CommentInput;
