import React, { useState, useEffect, useRef } from "react";
import {
	StyleSheet,
	View,
	TouchableOpacity,
	FlatList,
	Keyboard,
	KeyboardAvoidingView,
	Alert,
} from "react-native";
import { HStack, VStack, NativeBaseProvider } from "native-base";
import * as WebBrowser from "expo-web-browser";
import ThesisButtonPanel from "../components/ThesisButtonPanel";
import PostBox, { PostBoxType } from "../components/PostBox";
import PostsManager from "../managers/PostsManager";
import CommentInput from "../components/CommentInput";
import AppText from "../components/AppText";
import SentimentPill, { Sentiment } from "../components/SentimentPill";
import { useAnalytics } from "@segment/analytics-react-native";
import { Entypo } from "@expo/vector-icons";
import ManageContentModal from "../components/modals/ManageContentModal";
import UserManager from "../managers/UserManager";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { setComments, addComment } from "../redux/actions/PostActions";

// Universal Styles
import commonTextStyles from "../styles/CommonText";
import commonButtonStyles from "../styles/CommonButtons";
import {
	MAIN_SECONDARY_COLOR,
	BAD_COLOR,
	LIGHT_GREY_COLOR,
	LIST_SEPARATOR_COLOR,
} from "../styles/Colors";
import ThesesManager from "../managers/ThesesManager";

const ThesisDetailScreen = ({ navigation, route }) => {
	// Universal State
	const dispatch = useDispatch();
	const { userObject } = useSelector((state) => state.authReducer);
	const { comments } = useSelector((state) => state.postReducer);

	// State Management
	const [thesis, setThesis] = useState(route.params);
	const [contentAvailability, setContentAvailability] = useState("available");
	const [commentContent, setCommentContent] = useState("");
	const [commentContentValidity, setCommentContentValidity] = useState(false);
	const [disableStatus, setDisableStatus] = useState(true);
	const [error, setError] = useState("");
	const [refreshing, setRefreshing] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	//We need to set the error message

	// Segment Tracking
	const { track } = useAnalytics();

	// This is necessary to get it show show updated version
	const detailedThesis = route.params;

	const listRef = useRef(null);
	const handleScrollToTop = () => {
		listRef.current.scrollToOffset({ offset: 0, animated: false });
	};

	const dateWritten = new Date(thesis.created_at);

	// Display thesis sources
	const sources = thesis.sources ? thesis.sources : [];
	let sourcesToDisplay = sources.map((source, index) => (
		<TouchableOpacity key={index} onPress={() => handleSourceLink(source)}>
			<AppText style={styles.linkText}>{source}</AppText>
		</TouchableOpacity>
	));

	const handleSourceLink = async (sourceLink) => {
		await WebBrowser.openBrowserAsync(sourceLink);
	};

	// Might not need these separate functions?
	const handleChangeContent = (newContent) => {
		setCommentContent(newContent);
	};

	const handleChangeCommentContentValidity = (newValidity) => {
		setCommentContentValidity(newValidity);
		if (newValidity == true) {
			setDisableStatus(false);
		} else {
			setDisableStatus(true);
		}
	};

	const replyButtonPressed = async () => {
		Keyboard.dismiss();
		const createdComment = await PostsManager.createPost({
			content: commentContent,
			is_thesis_comment_on: thesis.thesis_id,
		});

		if (createdComment) {
			track("Post Created", {
				authorUserId: createdComment.user_id,
				authorUsername: createdComment.username,
				assetSymbol: createdComment.asset_symbol,
				postId: createdComment.post_id,
				sentiment: createdComment.sentiment,
				postType: "comment",
				containsThesis: false,
				organic: true,
			});
			dispatch(addComment(createdComment));
			setCommentContent("");
			setDisableStatus(true);
		}
	};

	const editContent = async (item) => {
		navigation.navigate("CreateThesisScreen", {"thesis": item});
	}

	const deleteContent = async (item) => {
		Alert.alert(
			"Delete Thesis",
			"Are you sure you want to delete this thesis?",
			[
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
						const response = await ThesesManager.deleteThesis(item);
						if (response.status == 200) {
							setContentAvailability("deleted");
						}
					},
				},
			]
		);
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
				`You have successfully blocked @${item.username}. You will no longer see this user's content on Pelleum.`,
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

	const handleThesisResponse = (thesisResponse) => {
		if (thesisResponse.status == 200) {
			setError("");
			setContentAvailability("available");
			setThesis(thesisResponse.data);
		} else if (thesisResponse.status == 400) {
			setError("");
			setContentAvailability("deleted");
		} else if (thesisResponse.status == 403) {
			setError("");
			setContentAvailability("forbidden");
		} else {
			setError(
				"An unexpected error occured retrieving this thesis. Please try again later."
			);
		}
	};

	const onRefresh = async () => {
		setRefreshing(true);
		// 1. Get thesis and set it in state
		const thesisResponse = await ThesesManager.getThesis(
			route.params.thesis_id
		);
		handleThesisResponse(thesisResponse);
		// 2. Retrieve thesis comments
		const commentsResponseData = await PostsManager.getComments({
			is_thesis_comment_on: thesis.thesis_id,
		});
		if (commentsResponseData) {
			dispatch(setComments(commentsResponseData.records.posts));
		}
		setRefreshing(false);
	};

	useEffect(() => {
		onRefresh();
	}, [route]);

	renderItem = ({ item }) => (
		<PostBox postBoxType={PostBoxType.Comment} item={item} nav={navigation} />
	);

	return (
		<NativeBaseProvider>
			<FlatList
				ref={listRef}
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps={"handled"}
				width={"100%"}
				data={comments}
				keyExtractor={(item) => item.post_id}
				renderItem={renderItem}
				refreshing={refreshing}
				onRefresh={onRefresh}
				// Do infinate scroll in the future
				// onEndReached={getMoreComments}
				// onEndReachedThreshold={1}
				ListHeaderComponent={
					<KeyboardAvoidingView
						style={styles.mainContainer}
						behavior="position"
						keyboardVerticalOffset={100}
					>
						{error ? (
							<AppText style={styles.errorText}>{error}</AppText>
						) : contentAvailability == "deleted" ? (
							<AppText style={styles.nonAvailableThesis}>
								This thesis has been deleted.
							</AppText>
						) : contentAvailability == "forbidden" ? (
							<AppText style={styles.nonAvailableThesis}>
								This user's account is blocked.
							</AppText>
						) : (
							<>
							<View style={styles.thesisContainer}>
								<AppText style={styles.thesisTitle}>{thesis.title}</AppText>
								<HStack justifyContent="space-between" marginBottom={5}>
									<AppText style={commonTextStyles.usernameText}>
										@{thesis.username}
									</AppText>
									<AppText style={commonTextStyles.dateText}>
										{dateWritten.toLocaleDateString()}
									</AppText>
								</HStack>
								<HStack style={styles.topThesisBox}>
									<TouchableOpacity
										style={commonButtonStyles.assetButton}
										onPress={() => {
											console.log("Asset button worked.");
										}}
									>
										<AppText style={commonButtonStyles.assetText}>
											#{thesis.asset_symbol}
										</AppText>
									</TouchableOpacity>
									{thesis.sentiment === "Bull" ? (
										<SentimentPill item={thesis} sentiment={Sentiment.Bull} />
									) : (
										<SentimentPill item={thesis} sentiment={Sentiment.Bear} />
									)}
								</HStack>
								<TouchableOpacity
									style={styles.portfolioInsightButton}
									onPress={() =>
										navigation.navigate("PortfolioInsightScreen", {
											username: thesis.username,
											userId: thesis.user_id,
										})
									}
								>
									<AppText style={styles.buttonTextStyle}>
										View Author's Portfolio
									</AppText>
								</TouchableOpacity>
								<ThesisButtonPanel thesis={thesis} nav={navigation} />
								<HStack style={styles.thesisHeaderContainer}>
									<AppText style={styles.thesisLabel}>Thesis</AppText>
									<ManageContentModal
										modalVisible={modalVisible}
										makeModalDisappear={() => setModalVisible(false)}
										item={thesis}
										userId={userObject.userId}
										deleteContent={deleteContent}
										blockUser={blockUser}
										editContent={editContent}
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
								<AppText style={styles.contentText}>{thesis.content}</AppText>
								<AppText style={styles.sourcesLabel}>Sources</AppText>
								{sources.length > 0 ? (
									sourcesToDisplay
								) : (
									<AppText>This thesis has no linked sources😕</AppText>
								)}
							</View>
							<VStack>
								<CommentInput
									scrollToTop={handleScrollToTop}
									commentContent={commentContent}
									commentContentValidity={commentContentValidity}
									changeContent={handleChangeContent}
									changeCommentContentValidity={
										handleChangeCommentContentValidity
									}
								/>
								<TouchableOpacity
									style={
										disableStatus
											? styles.replyButtonDisabled
											: styles.replyButtonEnabled
									}
									onPress={() => replyButtonPressed()}
									disabled={disableStatus}
								>
									<AppText style={styles.buttonTextStyle}>Reply</AppText>
								</TouchableOpacity>
							</VStack>
							</>
						)}
					</KeyboardAvoidingView>
				}
			></FlatList>
		</NativeBaseProvider>
	);
};

export default ThesisDetailScreen;

const styles = StyleSheet.create({
	mainContainer: {
		marginHorizontal: 15,
	},
	thesisContainer: {
		paddingVertical: 20,
		marginBottom: 15,
		borderBottomWidth: 1,
		borderBottomColor: LIST_SEPARATOR_COLOR,
	},
	topThesisBox: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	contentText: {
		fontSize: 16,
		marginTop: 20,
		marginHorizontal: 15,
		marginBottom: 30,
	},
	portfolioInsightButton: {
		alignSelf: "center",
		borderRadius: 30,
		padding: 11,
		marginTop: 15,
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
	linkText: {
		color: MAIN_SECONDARY_COLOR,
		marginTop: 10,
	},
	sourcesLabel: {
		fontSize: 16,
		fontWeight: "bold",
		marginTop: 20,
		marginBottom: 10,
	},
	thesisLabel: {
		paddingVertical: 15,
		fontSize: 16,
		fontWeight: "bold",
	},
	thesisTitle: {
		fontSize: 25,
		fontWeight: "bold",
		marginBottom: 20,
		alignSelf: "center",
	},
	replyButtonEnabled: {
		alignSelf: "flex-end",
		borderRadius: 30,
		paddingVertical: 8,
		paddingHorizontal: 11,
		marginBottom: 5,
		width: "22%",
		backgroundColor: MAIN_SECONDARY_COLOR,
		elevation: 2,
	},
	replyButtonDisabled: {
		alignSelf: "flex-end",
		borderRadius: 30,
		paddingVertical: 8,
		paddingHorizontal: 11,
		marginBottom: 5,
		width: "22%",
		backgroundColor: MAIN_SECONDARY_COLOR,
		elevation: 2,
		opacity: 0.33,
	},
	errorText: {
		color: BAD_COLOR,
	},
	dotsButton: {
		paddingVertical: 15,
		paddingLeft: 20,
		paddingRight: 10,
	},
	thesisHeaderContainer: {
		width: "100%",
		alignItems: "center",
		justifyContent: "space-between",
		marginTop: 5,
	},
	nonAvailableThesis: {
		alignSelf: "center",
		marginVertical: 15,
	},
});
