import React, { useState, useEffect, useRef } from "react";
import {
	StyleSheet,
	View,
	TouchableOpacity,
	FlatList,
	RefreshControl,
	Keyboard,
	KeyboardAvoidingView,
} from "react-native";
import { HStack, VStack, NativeBaseProvider } from "native-base";
import * as WebBrowser from "expo-web-browser";
import ThesisButtonPanel from "../components/ThesisButtonPanel";
import PostBox, { PostBoxType } from "../components/PostBox";
import PostsManager from "../managers/PostsManager";
import CommentInput from "../components/CommentInput";
import AppText from "../components/AppText";
import SentimentPill, { Sentiment } from "../components/SentimentPill";
import { useAnalytics } from '@segment/analytics-react-native';

// Redux
import { useSelector, useDispatch } from "react-redux";
import { setComments, addComment } from "../redux/actions/PostActions";

// Universal Styles
import commonTextStyles from "../styles/CommonText";
import commonButtonStyles from "../styles/CommonButtons";
import { MAIN_SECONDARY_COLOR, BAD_COLOR, LIGHT_GREY_COLOR } from "../styles/Colors";

const ThesisDetailScreen = ({ navigation, route }) => {
	// Universal State
	const { comments } = useSelector((state) => state.postReducer);
	const dispatch = useDispatch();

	// State Management
	const [commentContent, setCommentContent] = useState("");
	const [commentContentValidity, setCommentContentValidity] = useState(false);
	const [disableStatus, setDisableStatus] = useState(true);
	const [error, setError] = useState("");
	const [refreshing, setRefreshing] = useState(false);
	//We need to set the error message

	// Segment Tracking
	const { track } = useAnalytics();

	const listRef = useRef(null);
	const handleScrollToTop = () => {
		listRef.current.scrollToOffset({ offset: 0, animated: false });
	};

	const detailedThesis = route.params;
	const dateWritten = new Date(detailedThesis.created_at);

	const sources = detailedThesis.sources ? detailedThesis.sources : [];
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
		// Think about adding sentiment, symbol, theses, etc to theses comments.
		Keyboard.dismiss();
		const createdComment = await PostsManager.createPost({
			content: commentContent,
			is_thesis_comment_on: detailedThesis.thesis_id,
		});

		if (createdComment) {
			track('Post Created', {
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

	const onRefresh = async () => {
		setRefreshing(true);
		const commentsResponseData = await PostsManager.getComments({
			is_thesis_comment_on: detailedThesis.thesis_id,
		});
		if (commentsResponseData) {
			dispatch(setComments(commentsResponseData.records.posts));
		}

		setRefreshing(false);
	};

	useEffect(() => {
		onRefresh();
	}, []);

	renderItem = ({ item }) => (<PostBox postBoxType={PostBoxType.Comment} item={item} nav={navigation} />);

	return (
		<NativeBaseProvider>
			<FlatList
				ref={listRef}
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps={'handled'}
				width={"100%"}
				data={comments}
				keyExtractor={(item) => item.post_id}
				renderItem={renderItem}
				refreshControl={
					<RefreshControl
						enabled={true}
						colors={["#9Bd35A", "#689F38"]}
						onRefresh={onRefresh}
					/>
				}
				refreshing={refreshing}
				ListHeaderComponent={
					<KeyboardAvoidingView style={styles.mainContainer} behavior='position' keyboardVerticalOffset={100}>
						<View style={styles.thesisContainer}>
							<AppText style={styles.thesisTitle}>
								{detailedThesis.title}
							</AppText>
							<HStack justifyContent="space-between" marginBottom={5}>
								<AppText style={commonTextStyles.usernameText}>
									@{detailedThesis.username}
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
										#{detailedThesis.asset_symbol}
									</AppText>
								</TouchableOpacity>
								{detailedThesis.sentiment === "Bull" ? (
									<SentimentPill
										item={detailedThesis}
										sentiment={Sentiment.Bull}
									/>
								) : (
									<SentimentPill
										item={detailedThesis}
										sentiment={Sentiment.Bear}
									/>
								)}
							</HStack>
							<TouchableOpacity
								style={styles.portfolioInsightButton}
								onPress={() =>
									navigation.navigate("PortfolioInsightScreen", {
										username: detailedThesis.username,
										userId: detailedThesis.user_id,
									})
								}
							>
								<AppText style={styles.buttonTextStyle}>
									View Author's Portfolio
								</AppText>
							</TouchableOpacity>
							<ThesisButtonPanel item={detailedThesis} nav={navigation} />
							<AppText style={styles.subTitle}>Thesis</AppText>
							<AppText style={styles.contentText}>
								{detailedThesis.content}
							</AppText>
							<AppText style={styles.subTitle}>Sources</AppText>
							{sources.length > 0 ? sourcesToDisplay : <AppText>This thesis has no linked sources😕</AppText>}
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
							{error ? (
								<AppText style={styles.errorText}>{error}</AppText>
							) : null}
						</VStack>
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
		borderBottomWidth: 0.5,
		borderBottomColor: LIGHT_GREY_COLOR,
	},
	buttonBox: {
		paddingTop: 5,
		alignSelf: "center",
		alignItems: "center",
		width: "85%",
		flexDirection: "row",
		justifyContent: "space-between",
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
	subTitle: {
		fontSize: 16,
		fontWeight: "bold",
		marginTop: 20,
		marginBottom: 10,
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
});
