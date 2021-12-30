import React from "react";
import { View, StyleSheet, TextInput } from "react-native";


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
				placeholder="Reply with your thoughts here"
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
		// height: 250,
		paddingVertical: 20,
	},
});

export default CommentInput;
