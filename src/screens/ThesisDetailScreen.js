import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	View,
	TouchableOpacity,
	FlatList,
	RefreshControl,
	Keyboard
} from "react-native";
import { HStack, VStack, NativeBaseProvider, Box } from "native-base";
import * as WebBrowser from "expo-web-browser";
import ThesisButtonPanel from "../components/ThesisButtonPanel";
import PostBox, { PostBoxType } from "../components/PostBox";
import PostsManager from "../managers/PostsManager";
import CommentInput from "../components/CommentInput";
import AppText from "../components/AppText";

const ThesisDetailScreen = ({ navigation, route }) => {
	// State Management
	const [result, setResult] = useState(null);
	const [commentContent, setCommentContent] = useState("");
	const [commentContentValidity, setCommentContentValidity] = useState(false);
	const [disableStatus, setDisableStatus] = useState(true);
	const [error, setError] = useState("");     //Migrate to redux
	const [refreshing, setRefreshing] = useState(false);
	const [comments, setComments] = useState([]);

	const detailedThesis = route.params;
	const dateWritten = new Date(detailedThesis.created_at);
	let sources = detailedThesis.sources ? detailedThesis.sources : [];

	let sourcesToDisplay = sources.map((source, index) => (
		<TouchableOpacity key={index} onPress={() => handleSourceLink(source)}>
			<AppText style={styles.linkText}>{source}</AppText>
		</TouchableOpacity>
	));

	const handleSourceLink = async (sourceLink) => {
		let webResult = await WebBrowser.openBrowserAsync(sourceLink);
		setResult(webResult);
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
			const commentsCopy = comments;
			commentsCopy.splice(0, 0, authorizedResponse.data);
			setComments(commentsCopy);
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
			setComments(commentsResponseData.records.posts);
		}

		setRefreshing(false);
	};

	useEffect(() => {
		onRefresh();
	}, []);

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
						<View style={styles.thesisContainer}>
							<AppText style={styles.thesisTitle}>{detailedThesis.title}</AppText>
							<HStack justifyContent="space-between" marginBottom={5}>
								<AppText style={styles.usernameText}>
									Investor: @{detailedThesis.username}
								</AppText>
								<AppText style={styles.usernameText}>
									Written: {dateWritten.toLocaleDateString()}
								</AppText>
							</HStack>
							<HStack style={styles.topThesisBox}>
								<TouchableOpacity
									style={styles.assetButton}
									onPress={() => {
										console.log("Asset button worked.");
									}}
								>
									<AppText style={styles.assetText}>
										{detailedThesis.asset_symbol}
									</AppText>
								</TouchableOpacity>
								<AppText
									style={
										detailedThesis.sentiment === "Bull"
											? styles.bullSentimentText
											: styles.bearSentimentText
									}
								>
									{detailedThesis.sentiment}
								</AppText>
							</HStack>
							<TouchableOpacity
								style={styles.portfolioInsightButton}
								onPress={() =>
									navigation.navigate("PortfolioInsight", {
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
							<AppText style={styles.contentText}>{detailedThesis.content}</AppText>
							<AppText style={styles.subTitle}>Sources</AppText>
							{sourcesToDisplay}
						</View>
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
									disableStatus ? styles.replyButtonDisabled : styles.replyButtonEnabled
								}
								onPress={() => replyButtonPressed()}
								disabled={disableStatus}
							>
								<AppText style={styles.buttonTextStyle}>Reply</AppText>
							</TouchableOpacity>
							{error ? <AppText style={styles.errorText}>{error}</AppText> : null}
						</VStack>
					</View>
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
		borderBottomColor: "#00A8FC",
	},
	buttonBox: {
		paddingTop: 5,
		alignSelf: "center",
		alignItems: "center",
		width: "85%",
		flexDirection: "row",
		justifyContent: "space-between",
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
		backgroundColor: "#00A8FC",
		elevation: 2,
	},
	buttonTextStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
		fontSize: 15,
	},
	linkText: {
		color: "blue",
		marginTop: 10,
	},
	subTitle: {
		fontSize: 16,
		fontWeight: "bold",
		marginTop: 20,
	},
	thesisTitle: {
		fontSize: 25,
		fontWeight: "bold",
		marginBottom: 20,
		alignSelf: "center",
	},
	replyButtonEnabled: {
		alignSelf: "center",
		borderRadius: 30,
		padding: 11,
		marginBottom: 5,
		width: "100%",
		backgroundColor: "#00A8FC",
		elevation: 2,
	},
	replyButtonDisabled: {
		alignSelf: "center",
		borderRadius: 30,
		padding: 11,
		marginBottom: 5,
		width: "100%",
		backgroundColor: "#00A8FC",
		elevation: 2,
		opacity: 0.33,
	},
	errorText: {
		color: "red",
	},
});
