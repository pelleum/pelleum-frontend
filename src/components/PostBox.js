import React from "react";
import { StyleSheet, TouchableOpacity, Alert } from "react-native";
import { HStack, VStack, NativeBaseProvider, Box } from "native-base";
import PostButtonPanel from "./PostButtonPanel";
import ThesisBox, { ThesesBoxType } from "./ThesisBox";
import { Entypo } from "@expo/vector-icons";
import {
	MAIN_BACKGROUND_COLOR,
	LIGHT_GREY_COLOR,
	MAIN_SECONDARY_COLOR,
} from "../styles/Colors";
import PostsManager from "../managers/PostsManager";
import AppText from "./AppText";
import commonTextStyles from "../styles/CommonText";
import commonButtonStyles from "../styles/CommonButtons";
import SentimentPill, { Sentiment } from "./SentimentPill";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { removePost, removeAuthoredPost, removeComment } from "../redux/actions/PostActions";


export class PostBoxType {
	static Feed = new PostBoxType("feed");
	static Comment = new PostBoxType("comment");
	static PostDetail = new PostBoxType("postDetail");
	static PostCommentedOn = new PostBoxType("postCommentedOn");
	static ThesisCommentedOn = new PostBoxType("thesisCommentedOn");
	static UserAuthored = new PostBoxType("userAuthored");

	constructor(type) {
		this.type = type;
	}
}

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
}


const PostBox = ({ postBoxType, item, nav }) => {
	// Universal State
	const dispatch = useDispatch();
	const { userObject } = useSelector((state) => state.authReducer);

	// Get the time elapsed since post was created
	elapsedTime = getTimeElapsed(item);

	// Determine whether a refresh is needed
	if (
		postBoxType == PostBoxType.Comment ||
		postBoxType == PostBoxType.PostCommentedOn ||
		postBoxType == PostBoxType.ThesisCommentedOn
	) {
		item["needsRefresh"] = true;
	}

	const alertBeforeDelete = async (item) => {
		Alert.alert(
			"Delete Post",
			"Are you sure you want to delete this post?",
			[
				{
					text: "Cancel", onPress: () => { /* Do nothing */ }
				},
				{
					text: "Delete", style: 'destructive', onPress: async () => {
						const response = await PostsManager.deletePost(item.post_id);
						if (response.status == 204) {
							if (postBoxType.type == "userAuthored") {
								dispatch(removeAuthoredPost(item));
							} else if (postBoxType.type == "comment") {
								dispatch(removeComment(item));
							}
							dispatch(removePost(item));
						}
					}
				}
			]
		);
	};

	return (
		<NativeBaseProvider>
			<TouchableOpacity
				disabled={postBoxType == PostBoxType.PostDetail ? true : false}
				onPress={() => {
					nav.navigate("Post", item);
				}}
			>
				<Box
					style={postBoxType == PostBoxType.PostCommentedOn ? styles.postCommentedOn : (postBoxType != PostBoxType.PostDetail ? styles.feedPost : null) }
				>
					<VStack>
						<HStack style={styles.topPostBox}>
							<HStack>
								<AppText style={commonTextStyles.usernameText}>
									@{item.username}
								</AppText>
								<AppText style={styles.timeElapsedText}>
									• {elapsedTime}
								</AppText>
							</HStack>
							<HStack justifyContent="space-between" alignItems="center">
								{item.sentiment ? (
									item.sentiment === "Bull" ? (
										<SentimentPill item={item} sentiment={Sentiment.Bull} />
									) : (
										<SentimentPill item={item} sentiment={Sentiment.Bear} />
									)
								) : null}
								<TouchableOpacity
									disabled={userObject.userId == item.user_id ? false : true}
									style={userObject.userId == item.user_id ? styles.enabledDotsButton : styles.disabledDotsButton}
									onPress={() => {
										alertBeforeDelete(item);
									}}
								>
									<Entypo name="dots-three-horizontal" size={18} color={LIGHT_GREY_COLOR} />
								</TouchableOpacity>
							</HStack>
						</HStack>
						{((postBoxType == PostBoxType.PostDetail || postBoxType == PostBoxType.PostCommentedOn) && !item.thesis && !item.is_post_comment_on) ? (
							<TouchableOpacity
								style={commonButtonStyles.assetButton}
								onPress={() => {
									console.log("Asset button worked.");
								}}
							>
								<AppText style={commonButtonStyles.assetText}>
									#{item.asset_symbol}
								</AppText>
							</TouchableOpacity>
						) : null}
						{postBoxType == PostBoxType.Feed ? (
							item.asset_symbol ? (
								<TouchableOpacity
									style={commonButtonStyles.assetButton}
									onPress={() => {
										console.log("Asset button worked.");
									}}
								>
									<AppText style={commonButtonStyles.assetText}>
										#{item.asset_symbol}
									</AppText>
								</TouchableOpacity>
							) : null
						) : null}
						<AppText style={styles.contentText}>{item.content}</AppText>
						{item.thesis ? (
							<ThesisBox
								item={item.thesis}
								nav={nav}
								thesisBoxType={ThesesBoxType.Contained}
							/>
						) : null}
						{postBoxType == PostBoxType.PostDetail ? (
							<TouchableOpacity
								style={styles.buttonEnabled}
								onPress={() =>
									nav.navigate("PortfolioInsight", {
										username: item.username,
										userId: item.user_id,
									})
								}
							>
								<AppText style={styles.buttonTextStyle}>
									View Author's Portfolio
								</AppText>
							</TouchableOpacity>
						) : (
							<PostButtonPanel item={item} nav={nav} />
						)}
					</VStack>
				</Box>
			</TouchableOpacity>
		</NativeBaseProvider>
	);
};

export default React.memo(PostBox);

const styles = StyleSheet.create({
	topPostBox: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	feedPost: {
		width: "100%",
		paddingLeft: 25,
		paddingRight: 10,
		paddingBottom: 7,
		paddingTop: 5,
		fontSize: 16,
		backgroundColor: MAIN_BACKGROUND_COLOR,
		borderBottomWidth: 0.17,
		borderBottomColor: LIGHT_GREY_COLOR,
		overflow: "hidden",
	},
	postCommentedOn: {
		width: "100%",
		borderBottomColor: LIGHT_GREY_COLOR, 
		borderBottomWidth: 0.17,
		paddingBottom: 7,
	},
	timeElapsedText: {
		color: LIGHT_GREY_COLOR,
		fontSize: 16,
		marginLeft: 5,
	},
	contentText: {
		fontSize: 16,
		padding: 15,
	},
	buttonEnabled: {
		alignSelf: "center",
		borderRadius: 30,
		padding: 11,
		marginTop: 5,
		marginBottom: 5,
		width: "100%",
		backgroundColor: MAIN_SECONDARY_COLOR,
		elevation: 2,
	},
	buttonTextStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
		fontSize: 15,
	},
	enabledDotsButton: {
		paddingVertical: 15,
		paddingLeft: 20,
		paddingRight: 10
	},
	disabledDotsButton: {
		paddingVertical: 15,
		paddingLeft: 20,
		paddingRight: 10,
		opacity: 0.3
	}
});
