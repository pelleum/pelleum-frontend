import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Pressable,
	FlatList,
	RefreshControl,
	Keyboard
} from "react-native";
import { HStack, VStack, NativeBaseProvider } from "native-base";
import * as WebBrowser from "expo-web-browser";
import ThesisButtonPanel from "../components/ThesisButtonPanel";
import { PostBox, PostBoxType } from "../components/PostBox";
import { getComments } from "../functions/PostFunctions";
import CommentInput from "../components/CommentInput";
import pelleumClient from "../api/clients/PelleumClient";

const ThesisDetailScreen = ({ navigation, route }) => {
	// State Management
	const [result, setResult] = useState(null);
	const [commentContent, setCommentContent] = useState("");
	const [commentContentValidity, setCommentContentValidity] = useState(false);
	const [disableStatus, setDisableStatus] = useState(true);
	const [error, setError] = useState("");
	const [refreshing, setRefreshing] = useState(false);
	const [comments, setComments] = useState([]);

	const detailedThesis = route.params;
	const dateWritten = new Date(detailedThesis.created_at);
	let sources = detailedThesis.sources ? detailedThesis.sources : [];

	let sourcesToDisplay = sources.map((source, index) => (
		<TouchableOpacity key={index} onPress={() => handleSourceLink(source)}>
			<Text style={styles.linkText}>{source}</Text>
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
		const authorizedResponse = await pelleumClient({
			method: "post",
			url: `/public/posts`,
			data: {
				content: commentContent,
				is_thesis_comment_on: detailedThesis.thesis_id,
			},
		});

		if (authorizedResponse) {
			if (authorizedResponse.status == 201) {
				console.log(
					"Need to actually display this to the user (ideally without making an API call), so they know it worked."
				);
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
			is_thesis_comment_on: detailedThesis.thesis_id,
		});
		if (retrievedComments) {
			setComments(retrievedComments);
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
							<Text style={styles.thesisTitle}>{detailedThesis.title}</Text>
							<Text style={styles.usernameText}>
								Investor: @{detailedThesis.username}
							</Text>
							<Text style={styles.usernameText}>
								Written: {dateWritten.toLocaleDateString()}
							</Text>
							<HStack style={styles.topThesisBox}>
								<TouchableOpacity
									style={styles.assetButton}
									onPress={() => {
										console.log("Asset button worked.");
									}}
								>
									<Text style={styles.assetText}>
										{detailedThesis.asset_symbol}
									</Text>
								</TouchableOpacity>
								<Text
									style={
										detailedThesis.sentiment === "Bull"
											? styles.bullSentimentText
											: styles.bearSentimentText
									}
								>
									{detailedThesis.sentiment}
								</Text>
							</HStack>
							<Pressable
								style={styles.portfolioInsightButton}
								onPress={() =>
									navigation.navigate("PortfolioInsight", {
										username: detailedThesis.username,
										userId: detailedThesis.user_id,
									})
								}
							>
								<Text style={styles.buttonTextStyle}>
									View Author's Portfolio
								</Text>
							</Pressable>
							<ThesisButtonPanel item={detailedThesis} />
							<Text style={styles.subTitle}>Thesis</Text>
							<Text style={styles.contentText}>{detailedThesis.content}</Text>
							<Text style={styles.subTitle}>Sources</Text>
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
							<Pressable
								style={
									disableStatus ? styles.replyButtonDisabled : styles.replyButtonEnabled
								}
								onPress={() => replyButtonPressed()}
								disabled={disableStatus}
							>
								<Text style={styles.buttonTextStyle}>Reply</Text>
							</Pressable>
							{error ? <Text style={styles.errorText}>{error}</Text> : null}
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
