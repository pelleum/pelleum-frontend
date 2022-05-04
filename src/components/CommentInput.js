import React from "react";
import { StyleSheet, TextInput, View, Platform } from "react-native";
import { LIGHT_GREY_COLOR, TEXT_COLOR, MAIN_SECONDARY_COLOR, LIST_SEPARATOR_COLOR } from "../styles/Colors";
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
		<View style={styles.inputContainer}>
			<TextInput
				selectionColor={MAIN_SECONDARY_COLOR}
				placeholder="Reply with your thoughts here"
				placeholderTextColor={LIGHT_GREY_COLOR}
				multiline={true}
				style={Platform.OS == "web" ?
					{
						color: TEXT_COLOR,
						padding: 5,
						width: "100%",
						maxHeight: 150,
						outlineStyle: 'none', //removes input outline in web browsers
					}
					: styles.textArea}
				maxLength={MAXIMUM_POST_CHARACTERS}
				value={commentContent}
				onChangeText={(newValue) => handleChangeText(newValue)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	textArea: {
		color: TEXT_COLOR,
		padding: 5,
		width: "100%",
		maxHeight: 150,
	},
	inputContainer: {
		marginTop: 15,
		flexDirection: "row",
		alignSelf: "center",
		alignItems: "center",
		justifyContent: "center",
		width: "96%",
		marginBottom: 15,
		borderRadius: 20,
		borderWidth: 0.5,
		borderColor: LIST_SEPARATOR_COLOR,
		minHeight: 50,
		paddingVertical: 10,
		paddingHorizontal: 15,
	},
});

export default CommentInput;