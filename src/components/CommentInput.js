import React from "react";
import { StyleSheet, TextInput } from "react-native";
import { LIGHT_GREY_COLOR, TEXT_COLOR } from "../styles/Colors";

const CommentInput = ({
	scrollToTop,
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
			onFocus={scrollToTop}
			color={TEXT_COLOR}
			selectionColor={TEXT_COLOR}
			placeholder="Reply with your thoughts here"
			placeholderTextColor={LIGHT_GREY_COLOR}
			multiline={true}
			numberOfLines={20}
			style={styles.textArea}
			maxLength={512}
			value={commentContent}
			onChangeText={(newValue) => handleChangeText(newValue)}
		/>
	);
};

const styles = StyleSheet.create({
	textArea: {
		marginVertical: 30,
		maxHeight: 100,
		textAlignVertical: 'top',
	},
});

export default CommentInput;
