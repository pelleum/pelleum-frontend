import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { HStack, VStack, NativeBaseProvider, Box } from "native-base";
import PostButtonPanel from "./PostButtonPanel";
import { ThesisBox } from "./ThesisBox";

export class PostBoxType {
	static Feed = new PostBoxType("feed");
	static Comment = new PostBoxType("comment");
	static PostDetail = new PostBoxType("postDetail");
	static PostCommentedOn = new PostBoxType("postCommentedOn");
	static ThesisCommentedOn = new PostBoxType("thesisCommentedOn");

	constructor(type) {
		this.type = type;
	}
}

export const PostBox = ({ postBoxType, item, nav }) => {
	// new Date() gives time in device's time zone, but we need it in UTC
	// To do this, we get the ISO string, remove the Z from the end, and create a new date

	const nowIsoString = new Date().toISOString();
	const nowStringWithNoZ = nowIsoString.slice(0, -1);
	const now = new Date(nowStringWithNoZ).getTime();
	const createdAt = new Date(item.created_at).getTime();
	const elapsedTimeMinutes = Math.round((now - createdAt) / (1000 * 60));

	if (
		postBoxType == PostBoxType.Comment ||
		postBoxType == PostBoxType.PostCommentedOn ||
		postBoxType == PostBoxType.ThesisCommentedOn
	) {
		item["needsRefresh"] = true;
	}

	return (
		<NativeBaseProvider>
			<TouchableOpacity
				disabled={postBoxType == PostBoxType.PostDetail ? true : false}
				onPress={() => {
					nav.navigate("Post", item);
				}}
			>
				<Box
					style={postBoxType != PostBoxType.PostDetail ? styles.feedPost : null}
				>
					<VStack>
						<HStack style={styles.topPostBox}>
							<Text style={styles.usernameText}>
								@{item.username} {elapsedTimeMinutes} min
							</Text>
							{postBoxType == PostBoxType.Feed ? (
								item.asset_symbol ? (
									<TouchableOpacity
										style={styles.assetButton}
										onPress={() => {
											console.log("Asset button worked.");
										}}
									>
										<Text style={styles.assetText}>{item.asset_symbol}</Text>
									</TouchableOpacity>
								) : null
							) : null}
							<Text
								style={
									item.sentiment
										? item.sentiment === "Bull"
											? styles.bullSentimentText
											: styles.bearSentimentText
										: null
								}
							>
								{item.sentiment}
							</Text>
						</HStack>
						<Text style={styles.contentText}>{item.content}</Text>
						{item.thesis ? <ThesisBox item={item.thesis} nav={nav} /> : null}
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
								<Text style={styles.buttonTextStyle}>
									View Author's Portfolio
								</Text>
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

const styles = StyleSheet.create({
	topPostBox: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
	},
	feedPost: {
		width: "100%",
		padding: 25,
		paddingBottom: 0,
		fontSize: 16,
		backgroundColor: "#ebecf0",
		borderBottomWidth: 2,
		borderBottomColor: "#bfc6c9",
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
	buttonTextStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
		fontSize: 15,
	},
});
