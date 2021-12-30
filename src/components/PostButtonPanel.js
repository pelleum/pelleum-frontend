import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { HStack, NativeBaseProvider } from "native-base";
import {
	MaterialIcons,
	Fontisto,
	SimpleLineIcons,
	Ionicons,
} from "@expo/vector-icons";
import { sendPostReaction } from "../functions/PostFunctions";
import { useSelector } from "react-redux";

const PostButtonPanel = ({ item, nav }) => {
	const { newlyAddedLikedPosts, newlyAddedUnlikedPosts } = useSelector(
		(state) => state.likesReducer
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
						name={((item.is_liked_by_user &&
							!newlyAddedUnlikedPosts.includes(item.post_id)) ||
						newlyAddedLikedPosts.includes(item.post_id))
							? "md-heart"
							: "md-heart-outline"}
						size={24}
						color={
							((item.is_liked_by_user &&
								!newlyAddedUnlikedPosts.includes(item.post_id)) ||
							newlyAddedLikedPosts.includes(item.post_id))
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
					<SimpleLineIcons name="action-redo" size={22} color="#00A8FC" />
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
	// iconButton: {
	// 	//add styles here
	// },
});
