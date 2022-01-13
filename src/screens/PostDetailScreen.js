import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Keyboard,
	FlatList,
	RefreshControl,
} from "react-native";
import { VStack, NativeBaseProvider } from "native-base";
import CommentInput from "../components/CommentInput";
import pelleumClient from "../api/clients/PelleumClient";
import PostButtonPanel from "../components/PostButtonPanel";
import { PostBox, PostBoxType } from "../components/PostBox";
import { getComments, getPost } from "../functions/PostFunctions";
import { getThesis } from "../functions/ThesesFunctions";
import { ThesisBox } from "../components/ThesisBox";


const PostDetailScreen = ({ navigation, route }) => {
	// Local State Management
	const [commentContent, setCommentContent] = useState("");
	const [commentContentValidity, setCommentContentValidity] = useState(false);
	const [disableStatus, setDisableStatus] = useState(true);
	const [error, setError] = useState("");
	const [refreshing, setRefreshing] = useState(false);
	const [postCommentedOn, setPostCommentedOn] = useState(null);
	const [thesisCommentedOn, setThesisCommentedOn] = useState(null);
	const [comments, setComments] = useState([]);

	const detailedPost = route.params;

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
		const authorizedResponse = await pelleumClient({
			method: "post",
			url: `/public/posts`,
			data: {
				content: commentContent,
				is_post_comment_on: detailedPost.post_id,
			},
		});

		if (authorizedResponse) {
			if (authorizedResponse.status == 201) {
				const commentsCopy = comments;
				commentsCopy.splice(0, 0, authorizedResponse.data);
				setComments(commentsCopy);
				setCommentContent("");
				setDisableStatus(true);
				setError("");
			} else {
				setError("An unexpected error occured. Your reply was not shared.");
			}
		}
	};

	const onRefresh = async () => {
		setRefreshing(true);
		const retrievedComments = await getComments({
			is_post_comment_on: detailedPost.post_id,
		});
		if (detailedPost.is_post_comment_on) {
			const retrievedPost = await getPost(detailedPost.is_post_comment_on);
			setPostCommentedOn(retrievedPost);
			setThesisCommentedOn(null);
		} else if (detailedPost.is_thesis_comment_on) {
			const retrievedThesis = await getThesis(detailedPost.is_thesis_comment_on);
			setThesisCommentedOn(retrievedThesis);
			setPostCommentedOn(null);
		} else {
			setPostCommentedOn(null);
			setThesisCommentedOn(null);
		}

		if (retrievedComments) {
			setComments(retrievedComments);
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

	return (
		<NativeBaseProvider>
			<FlatList
				data={comments}
				keyExtractor={(item) => item.post_id.toString()}
				renderItem={({ item }) => {
					return (
						<PostBox
							postBoxType={PostBoxType.Comment}
							item={item}
							nav={navigation}
						/>
					);
				}}
				refreshControl={
					<RefreshControl
						enabled={true}
						colors={["#9Bd35A", "#689F38"]}
						onRefresh={onRefresh}
					/>
				}
				refreshing={refreshing}
				ListHeaderComponent={
					<View style={styles.mainContainer}>
						{postCommentedOn ?
							(
								<PostBox
									postBoxType={PostBoxType.PostCommentedOn}
									item={postCommentedOn}
									nav={navigation}
								/>
							)
							: null}
						{thesisCommentedOn ?
							(
								<ThesisBox
									item={thesisCommentedOn}
									nav={navigation}
								/>
							)
							: null}
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
									disableStatus ? styles.buttonDisabled : styles.buttonEnabled
								}
								onPress={() => replyButtonPressed()}
								disabled={disableStatus}
							>
								<Text style={styles.buttonTextStyle}>Reply</Text>
							</TouchableOpacity>
							{error ? <Text style={styles.errorText}>{error}</Text> : null}
						</VStack>
					</View>
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
		borderBottomColor: "#00A8FC",
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
	buttonEnabled: {
		alignSelf: "center",
		borderRadius: 30,
		padding: 11,
		marginBottom: 5,
		width: "100%",
		backgroundColor: "#00A8FC",
		elevation: 2,
	},
	buttonDisabled: {
		alignSelf: "center",
		borderRadius: 30,
		padding: 11,
		marginBottom: 5,
		width: "100%",
		backgroundColor: "#00A8FC",
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
		color: "red",
	},
	// centeredView: {
	// 	//marginTop:,
	// 	flex: 1,
	// 	flexDirection: "column",
	// 	// justifyContent: "flex-end",
	// },

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
});

export default PostDetailScreen;
