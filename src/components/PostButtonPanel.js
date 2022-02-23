import React from "react";
import { StyleSheet, TouchableOpacity, Share } from "react-native";
import { HStack, NativeBaseProvider } from "native-base";
import { EvilIcons, Fontisto, Ionicons, FontAwesome } from "@expo/vector-icons";
import PostsManager from "../managers/PostsManager";
import { LIGHT_GREY_COLOR, MAIN_SECONDARY_COLOR } from "../styles/Colors";

// Redux
import { useSelector } from "react-redux";

const PostButtonPanel = ({ item, nav }) => {
	const { locallyLikedPosts, locallyUnlikedPosts } = useSelector(
		(state) => state.postReactionsReducer
	);

	const onShare = async () => {
		try {
			const result = await Share.share({
				message:
					"React Native | A framework for building native apps using React",
			});
			if (result.action === Share.sharedAction) {
				if (result.activityType) {
					// shared with activity type of result.activityType
				} else {
					// shared
				}
			} else if (result.action === Share.dismissedAction) {
				// dismissed
			}
		} catch (error) {
			alert(error.message);
		}
	};

	return (
		<NativeBaseProvider>
			<HStack style={styles.buttonBox}>
				<TouchableOpacity
					style={styles.iconButton}
					onPress={() => {
						nav.navigate("Post", item);
					}}
				>
					<Fontisto name="comment" size={16} color={LIGHT_GREY_COLOR} />
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.iconButton}
					onPress={() => {
						console.log("Retweet button worked.");
					}}
				>
					<EvilIcons name="retweet" size={30} color={LIGHT_GREY_COLOR} />
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.iconButton}
					onPress={() => PostsManager.sendPostReaction(item)}
				>
					<Ionicons
						name={
							(item.user_reaction_value == 1 &&
								!locallyUnlikedPosts.includes(item.post_id)) ||
							locallyLikedPosts.includes(item.post_id)
								? "md-heart"
								: "md-heart-outline"
						}
						size={21}
						color={
							(item.user_reaction_value == 1 &&
								!locallyUnlikedPosts.includes(item.post_id)) ||
							locallyLikedPosts.includes(item.post_id)
								? MAIN_SECONDARY_COLOR
								: LIGHT_GREY_COLOR
						}
					/>
				</TouchableOpacity>
				<TouchableOpacity style={styles.iconButton} onPress={onShare}>
					<FontAwesome name="send-o" size={16} color={LIGHT_GREY_COLOR} />
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
		alignItems: "center",
		justifyContent: "center",
		height: 36,
		width: 58,
	},
});
