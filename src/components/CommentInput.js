import React from "react";
import { StyleSheet, TextInput } from "react-native";
import { LIGHT_GREY_COLOR, TEXT_COLOR, MAIN_SECONDARY_COLOR } from "../styles/Colors";
import { MAXIMUM_POST_CHARACTERS } from "../constants/PostsConstants";

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
		<TextInput
			color={TEXT_COLOR}
			selectionColor={MAIN_SECONDARY_COLOR}
			placeholder="Reply with your thoughts here"
			placeholderTextColor={LIGHT_GREY_COLOR}
			multiline={true}
			numberOfLines={20}
			style={styles.textArea}
			maxLength={MAXIMUM_POST_CHARACTERS}
			value={commentContent}
			onChangeText={(newValue) => handleChangeText(newValue)}
		/>
	);
};

const styles = StyleSheet.create({
	textArea: {
		marginVertical: 30,
		height: 100,
		textAlignVertical: 'top',
		borderWidth: 1,
		borderColor: "red",
	},
});

export default CommentInput;
