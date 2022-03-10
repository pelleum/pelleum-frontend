import React, { useState, useEffect, useRef } from "react";
import {
	StyleSheet,
	View,
	TouchableOpacity,
	Keyboard,
	FlatList,
	RefreshControl,
	KeyboardAvoidingView,
} from "react-native";
import { VStack, NativeBaseProvider } from "native-base";
import CommentInput from "../components/CommentInput";
import PostButtonPanel from "../components/PostButtonPanel";
import PostBox, { PostBoxType } from "../components/PostBox";
import PostsManager from "../managers/PostsManager";
import ThesesManager from "../managers/ThesesManager";
import ThesisBox from "../components/ThesisBox";
import AppText from "../components/AppText";
import { MAIN_SECONDARY_COLOR, BAD_COLOR, LIGHT_GREY_COLOR } from "../styles/Colors";
import { useAnalytics } from '@segment/analytics-react-native';

// Redux
import { useSelector, useDispatch } from "react-redux";
import { setComments, addComment } from "../redux/actions/PostActions";

const PostDetailScreen = ({ navigation, route }) => {
	// Universal State
	const { comments, deleted } = useSelector((state) => state.postReducer);
	const dispatch = useDispatch();
	// Local State Management
	const [commentContent, setCommentContent] = useState("");
	const [commentContentValidity, setCommentContentValidity] = useState(false);
	const [disableStatus, setDisableStatus] = useState(true);
	const [error, setError] = useState("");
	const [refreshing, setRefreshing] = useState(false);
	const [postCommentedOn, setPostCommentedOn] = useState(null);
	const [thesisCommentedOn, setThesisCommentedOn] = useState(null);
	//We need to set the error message

	// Segment Tracking
	const { track } = useAnalytics();

	const detailedPost = route.params;

	// Determine whether post exists (in the case of deleting while on postDetail page)
	const postExists = !deleted.some(
		(post) => post.post_id === detailedPost.post_id
	);

	// Allows us to scroll up to the top when reply text input is focused
	const listRef = useRef(null);
	const handleScrollToTop = () => {
		listRef.current.scrollToOffset({ offset: 0, animated: false });
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
			is_post_comment_on: detailedPost.post_id,
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
			is_post_comment_on: detailedPost.post_id,
		});
		if (detailedPost.is_post_comment_on) {
			const response = await PostsManager.getPost(
				detailedPost.is_post_comment_on
			);
			if (response.postExists) {
				setPostCommentedOn(response.post);
				setThesisCommentedOn(null);
			} else {
				setPostCommentedOn("deleted");
			}
		} else if (detailedPost.is_thesis_comment_on) {
			const retrievedThesis = await ThesesManager.getThesis(
				detailedPost.is_thesis_comment_on
			);
			setThesisCommentedOn(retrievedThesis);
			setPostCommentedOn(null);
		} else {
			setPostCommentedOn(null);
			setThesisCommentedOn(null);
		}

		if (commentsResponseData) {
			dispatch(setComments(commentsResponseData.records.posts));
		}

		setRefreshing(false);
	};

	useEffect(() => {
		onRefresh();
	}, []);

	if (detailedPost.needsRefresh) {
		onRefresh();
		detailedPost.needsRefresh = false;
	}

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
					<KeyboardAvoidingView
						style={styles.mainContainer}
						behavior="position"
						keyboardVerticalOffset={100}
					>
						{postCommentedOn ? (
							postCommentedOn != "deleted" ? (
								<PostBox
									postBoxType={PostBoxType.PostCommentedOn}
									item={postCommentedOn}
									nav={navigation}
								/>
							) : (
								<AppText style={styles.deletedPost}>
									This post has been deleted.
								</AppText>
							)
						) : null}
						{thesisCommentedOn ? (
							<ThesisBox item={thesisCommentedOn} nav={navigation} />
						) : null}
						{postExists ? (
							<View>
								<View style={styles.postContainer}>
									<PostBox
										postBoxType={PostBoxType.PostDetail}
										item={detailedPost}
										nav={navigation}
									/>
								</View>
								<PostButtonPanel item={detailedPost} nav={navigation} />
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
							</View>
						) : (
							<AppText style={styles.deletedPost}>
								This post has been deleted.
							</AppText>
						)}
					</KeyboardAvoidingView>
				}
			></FlatList>
		</NativeBaseProvider>
	);
};

PostDetailScreen.navigationOptions = () => {
	return {
		headerShown: false,
	};
};

const styles = StyleSheet.create({
	mainContainer: {
		marginHorizontal: 15,
	},
	postContainer: {
		paddingTop: 20,
		borderBottomWidth: 0.5,
		borderBottomColor: LIGHT_GREY_COLOR,
	},
	bullSentimentText: {
		textAlign: "center",
		width: 70,
		borderWidth: 0.5,
		backgroundColor: "#c6edc5",
		borderColor: "#1c7850",
		borderRadius: 15,
		padding: 5,
		marginBottom: 10,
		justifyContent: "center",
		color: "#1c7850",
		fontSize: 16,
		fontWeight: "bold",
		overflow: "hidden",
	},
	bearSentimentText: {
		textAlign: "center",
		width: 70,
		borderWidth: 0.5,
		backgroundColor: "#edcec5",
		borderColor: "#b02802",
		borderRadius: 15,
		padding: 5,
		marginBottom: 10,
		justifyContent: "center",
		color: "#b02802",
		fontSize: 16,
		fontWeight: "bold",
		overflow: "hidden",
	},
	usernameText: {
		padding: 5,
		marginBottom: 10,
		justifyContent: "center",
		color: "#026bd4",
		fontSize: 16,
	},
	assetButton: {
		width: 70,
		borderWidth: 0.5,
		backgroundColor: "white",
		borderColor: "#026bd4",
		borderRadius: 15,
		padding: 5,
		marginBottom: 10,
		color: "#026bd4",
		alignItems: "center",
	},
	assetText: {
		color: "#026bd4",
		fontSize: 16,
		fontWeight: "bold",
	},
	topPostBox: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
	},
	contentText: {
		fontSize: 16,
		marginTop: 20,
		marginHorizontal: 15,
		marginBottom: 30,
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
	buttonTextStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
		fontSize: 15,
	},
	errorText: {
		color: BAD_COLOR,
	},

	comment: {
		width: "100%",
		padding: 25,
		paddingBottom: 0,
		fontSize: 16,
		backgroundColor: "#ebecf0",
		borderBottomWidth: 2,
		borderBottomColor: "#bfc6c9",
		overflow: "hidden",
	},
	deletedPost: {
		alignSelf: "center",
		marginVertical: 15,
	},
});

export default PostDetailScreen;
