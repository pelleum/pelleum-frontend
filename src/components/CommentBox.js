import { Entypo } from "@expo/vector-icons";
import { useAnalytics } from "@segment/analytics-react-native";
import { HStack, NativeBaseProvider, Box } from "native-base";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, Alert, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { MAXIMUM_POST_VISIBLE_LINES } from "../constants/PostsConstants";
import PostsManager from "../managers/PostsManager";
import UserManager from "../managers/UserManager";
import { removePost, removeComment } from "../redux/actions/PostActions";
import { LIGHT_GREY_COLOR, LIST_SEPARATOR_COLOR } from "../styles/Colors";
import AppText from "./AppText";
import PostButtonPanel from "./PostButtonPanel";
import commonTextStyles from "../styles/CommonText";
import ManageContentModal from "./modals/ManageContentModal";


// Redux

const getTimeElapsed = (item) => {
	// new Date() gives time in device's time zone, but we need it in UTC
	// To do this, we get the ISO string, remove the Z from the end, and create a new date
	const nowIsoString = new Date().toISOString();
	const nowStringWithNoZ = nowIsoString.slice(0, -1);
	const now = new Date(nowStringWithNoZ).getTime();
	const createdAt = new Date(item.created_at).getTime();
	const elapsedTimeMinutes = Math.round((now - createdAt) / (1000 * 60));

	// Calculate elapsed time figure to present
	if (elapsedTimeMinutes > 60 && elapsedTimeMinutes <= 60 * 24) {
		const elapsedHours = Math.round(elapsedTimeMinutes / 60);
		return `${elapsedHours}h`;
	} else if (elapsedTimeMinutes > 60 * 24) {
		const elapsedDays = Math.round(elapsedTimeMinutes / (60 * 24));
		return `${elapsedDays}d`;
	} else {
		return `${elapsedTimeMinutes} min`;
	}
};

const CommentBox = ({ item, nav, commentLevel }) => {
	// Local State
	const [modalVisible, setModalVisible] = useState(false);

	// Universal State
	const dispatch = useDispatch();
	const { userObject } = useSelector((state) => state.authReducer);

	// Segment Tracking
	const { track } = useAnalytics();

	// Get the time elapsed since post was created
	elapsedTime = getTimeElapsed(item);

	// Tell PostDetail to refresh when a comment is clicked on
	item["needsRefresh"] = true;

	// Display nested PostBoxes for comments
	var commentBoxes = item.replies ? (item.replies.map((reply, index) => (
		<CommentBox
			item={reply}
			nav={nav}
			commentLevel={commentLevel + 1}
			key={index}
		/>
	))) : null;


	const deleteContent = async (item) => {
		Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
			{
				text: "Cancel",
				onPress: () => {
					/* Do nothing */
				},
			},
			{
				text: "Delete",
				style: "destructive",
				onPress: async () => {
					const response = await PostsManager.deletePost(item.post_id);
					if (response.status == 200) {
						dispatch(removeComment(item));
						dispatch(removePost(item));
					}
				},
			},
		]);
	};

	const blockUser = async (item) => {
		const response = await UserManager.blockUser(item.user_id);
		if (response.status == 201) {
			track("User Blocked", {
				blockedUserId: item.user_id,
				blockedUsername: item.username,
			});
			Alert.alert(
				"Success",
				`You have successfully blocked @${item.username}. You will no longer see this user's content on Pelleum. Please pull down to refresh the screen.`,
				[
					{
						text: "OK",
						onPress: () => {
							/* Do nothing */
						},
					},
				]
			);
		} else {
			Alert.alert(
				"Error",
				`An unexpected error occurred when attempting to block @${item.username}. Please try again later.`,
				[
					{
						text: "OK",
						onPress: () => {
							/* Do nothing */
						},
					},
				]
			);
		}
	};

	return (
		<NativeBaseProvider>
			<TouchableOpacity
				onPress={() => {
					nav.navigate("PostDetailScreen", item);
				}}
			>
				<Box
					style={
						commentLevel == 1
							? styles.firstOrderComment
							: commentLevel == 2
								? styles.secondOrderComment
								: commentLevel == 3
									? styles.thirdOrderComment
									: commentLevel == 4
										? styles.fourthOrderComment
										: null
					}
				>
					<View>
						<HStack style={styles.commentBox}>
							<HStack alignItems={"center"}>
								<TouchableOpacity
									style={styles.usernameButton}
									onPress={() =>
										nav.navigate("PortfolioInsightScreen", {
											username: item.username,
											userId: item.user_id,
										})
									}
								>
									<AppText style={commonTextStyles.usernameText}>
										@{item.username}
									</AppText>
								</TouchableOpacity>
								<AppText style={commonTextStyles.timeElapsedText}>
									• {elapsedTime}
								</AppText>
							</HStack>
							<ManageContentModal
								modalVisible={modalVisible}
								makeModalDisappear={() => setModalVisible(false)}
								item={item}
								userId={userObject.userId}
								deleteContent={deleteContent}
								blockUser={blockUser}
							/>
							<TouchableOpacity
								style={styles.dotsButton}
								onPress={() => {
									setModalVisible(true);
								}}
							>
								<Entypo
									name="dots-three-horizontal"
									size={18}
									color={LIGHT_GREY_COLOR}
								/>
							</TouchableOpacity>
						</HStack>
						<AppText
							numberOfLines={MAXIMUM_POST_VISIBLE_LINES}
							style={styles.contentText}
						>
							{item.content}
						</AppText>
						<View style={styles.buttonPanelContainer}>
							<PostButtonPanel item={item} nav={nav} />
						</View>
						{commentBoxes}
					</View>
				</Box>
			</TouchableOpacity>
		</NativeBaseProvider>
	);
};

export default React.memo(CommentBox);

const styles = StyleSheet.create({
	firstOrderComment: {
		marginLeft: 20,
		borderLeftColor: LIST_SEPARATOR_COLOR,
		borderWidth: 1
	},
	secondOrderComment: {
		marginLeft: 20,
		borderLeftColor: LIST_SEPARATOR_COLOR,
		borderWidth: 1
	},
	thirdOrderComment: {
		marginLeft: 20,
		borderLeftColor: LIST_SEPARATOR_COLOR,
		borderWidth: 1
	},
	fourthOrderComment: {
		marginLeft: 20,
		borderLeftColor: LIST_SEPARATOR_COLOR,
		borderWidth: 1
	},
	commentBox: {
		marginLeft: 15,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	contentText: {
		fontSize: 16,
		padding: 15,
	},
	dotsButton: {
		paddingVertical: 15,
		paddingLeft: 20,
		paddingRight: 14,
	},
	usernameButton: {
		paddingVertical: 10,
	},
	buttonPanelContainer: {
		width: 220,
		alignItems: "center",
		justifyContent: "center",
		alignSelf: "flex-end",
	}
});
