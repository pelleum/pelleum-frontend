import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	View,
	TouchableOpacity,
	Keyboard,
} from "react-native";
import { VStack, NativeBaseProvider } from "native-base";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import CommentInput from "../components/CommentInput";
import PostButtonPanel from "../components/PostButtonPanel";
import PostBox, { PostBoxType } from "../components/PostBox";
import PostsManager from "../managers/PostsManager";
import ThesesManager from "../managers/ThesesManager";
import ThesisBox from "../components/ThesisBox";
import AppText from "../components/AppText";
import { MAIN_SECONDARY_COLOR, BAD_COLOR, LIST_SEPARATOR_COLOR } from "../styles/Colors";
import { useAnalytics } from '@segment/analytics-react-native';
import DismissKeyboard from "../components/DismissKeyboard";

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

	const processRetrievedPost = (postResponse) => {
		if (postResponse.status == 200) {
			setPostCommentedOn(postResponse.data);
			setThesisCommentedOn(null);
		} else if (postResponse.status == 400) {
			setPostCommentedOn("deleted");
		} else if (postResponse.status == 403) {
			setPostCommentedOn("forbidden");
		}
	};

	const processRetrievedThesis = (thesisResponse) => {
		if (thesisResponse.status == 200) {
			setThesisCommentedOn(thesisResponse.data);
			setPostCommentedOn(null);
		} else if (thesisResponse.status == 400) {
			setThesisCommentedOn("deleted");
		} else if (thesisResponse.status == 403) {
			setThesisCommentedOn("forbidden");
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
			processRetrievedPost(response);
		} else if (detailedPost.is_thesis_comment_on) {
			const response = await ThesesManager.getThesis(
				detailedPost.is_thesis_comment_on
			);
			processRetrievedThesis(response);
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
			<KeyboardAwareFlatList
				showsVerticalScrollIndicator={false}
				enableAutomaticScroll={true}
				enableOnAndroid={true} 				  //enable Android native softwareKeyboardLayoutMode
				extraHeight={185}					  //when keyboard comes up, scroll enough to see the Reply button
				keyboardShouldPersistTaps={'handled'} //scroll or tap the Reply button without dismissing the keyboard first
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
					<DismissKeyboard>
						<View style={styles.mainContainer}>
							{postCommentedOn ? (
								postCommentedOn == "deleted" ? (
									<AppText style={styles.nonAvailablePost}>
										This post has been deleted.
									</AppText>
								) : postCommentedOn == "forbidden" ? (
									<AppText style={styles.nonAvailablePost}>
										This user's account is blocked.
									</AppText>
								) : (
									<PostBox
										postBoxType={PostBoxType.PostCommentedOn}
										item={postCommentedOn}
										nav={navigation}
									/>
								)
							) : null}
							{thesisCommentedOn ? (
								thesisCommentedOn == "deleted" ? (
									<AppText style={styles.nonAvailablePost}>
										This thesis has been deleted.
									</AppText>
								) : thesisCommentedOn == "forbidden" ? (
									<AppText style={styles.nonAvailablePost}>
										This user's account is blocked.
									</AppText>
								) : (
									<ThesisBox item={thesisCommentedOn} nav={navigation} />
								)
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
								<AppText style={styles.nonAvailablePost}>
									This post has been deleted.
								</AppText>
							)}
						</View>
					</DismissKeyboard>
				}
			></KeyboardAwareFlatList>

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
		borderBottomWidth: 1,
		borderBottomColor: LIST_SEPARATOR_COLOR,
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
	nonAvailablePost: {
		alignSelf: "center",
		marginVertical: 15,
	},
});

export default PostDetailScreen;
