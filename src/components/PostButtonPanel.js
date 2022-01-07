import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { HStack, NativeBaseProvider } from "native-base";
import {
	MaterialIcons,
	Fontisto,
	Ionicons,
	FontAwesome,
} from "@expo/vector-icons";
import { sendPostReaction } from "../functions/PostFunctions";
import { useSelector } from "react-redux";

const PostButtonPanel = ({ item, nav }) => {
	const { locallyLikedPosts, locallyUnlikedPosts } = useSelector(
		(state) => state.postReactionsReducer
	);

	return (
		<NativeBaseProvider>
			<HStack style={styles.buttonBox}>
				<TouchableOpacity
					style={styles.iconButton}
					onPress={() => {
						nav.navigate("Post", item);
					}}
				>
					<Fontisto name="comment" size={19} color="#00A8FC" />
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.iconButton}
					onPress={() => sendPostReaction(item)}
				>
					<Ionicons
						name={
							(item.user_reaction_value == 1 &&
								!locallyUnlikedPosts.includes(item.post_id)) ||
							locallyLikedPosts.includes(item.post_id)
								? "md-heart"
								: "md-heart-outline"
						}
						size={24}
						color={
							(item.user_reaction_value == 1 &&
								!locallyUnlikedPosts.includes(item.post_id)) ||
							locallyLikedPosts.includes(item.post_id)
								? "#F82057"
								: "#00A8FC"
						}
					/>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.iconButton}
					onPress={() => {
						console.log("Link button worked.");
					}}
				>
					<MaterialIcons name="add-link" size={29} color="#00A8FC" />
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.iconButton}
					onPress={() => {
						console.log("Share button worked.");
					}}
				>
					<FontAwesome name="send-o" size={19} color="#00A8FC" />
				</TouchableOpacity>
			</HStack>
		</NativeBaseProvider>
	);
};

export default PostButtonPanel;

const styles = StyleSheet.create({
	buttonBox: {
		paddingTop: 5,
		alignSelf: "center",
		alignItems: "center",
		width: "92%",
		flexDirection: "row",
		justifyContent: "space-between",
	},
	iconButton: {
		paddingHorizontal: 13,
		paddingTop: 8,
	},
});
