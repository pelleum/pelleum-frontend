import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { HStack, VStack, NativeBaseProvider, Box } from "native-base";
import PostButtonPanel from "./PostButtonPanel";
import ThesisBox, { ThesesBoxType } from "./ThesisBox";
import { MAIN_BACKGROUND_COLOR, LIGHT_GREY_COLOR, MAIN_SECONDARY_COLOR } from "../styles/Colors";
import AppText from "./AppText";
import commonTextStyles from "../styles/CommonText";
import commonButtonStyles from "../styles/CommonButtons";

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

const PostBox = ({ postBoxType, item, nav }) => {
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
							<HStack>
								<AppText style={commonTextStyles.usernameText}>
									@{item.username}   
								</AppText>
								<AppText style={styles.timeElapsedText}>
									• {elapsedTimeMinutes} min
								</AppText>
							</HStack>
							<AppText
								style={
									item.sentiment
										? item.sentiment === "Bull"
											? commonButtonStyles.bullSentimentText
											: commonButtonStyles.bearSentimentText
										: null
								}
							>
								{item.sentiment}
							</AppText>
						</HStack>
						{postBoxType == PostBoxType.Feed ? (
							item.asset_symbol ? (  
								<TouchableOpacity
									style={commonButtonStyles.assetButton}
									onPress={() => {
										console.log("Asset button worked.");
									}}
								>
									<AppText style={commonButtonStyles.assetText}>#{item.asset_symbol}</AppText>
								</TouchableOpacity>
							) : null
						) : null}
						<AppText style={styles.contentText}>{item.content}</AppText>
						{item.thesis ? <ThesisBox item={item.thesis} nav={nav} thesisBoxType={ThesesBoxType.Contained}/> : null}
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
		paddingHorizontal: 25,
		paddingBottom: 7,
		paddingTop: 10,
		fontSize: 16,
		backgroundColor: MAIN_BACKGROUND_COLOR,
		borderBottomWidth: 0.17,
		borderBottomColor: LIGHT_GREY_COLOR,
		overflow: "hidden",
	},
	timeElapsedText: {
		color: LIGHT_GREY_COLOR,
		fontSize: 16,
		marginLeft: 5
	},
	contentText: {
		fontSize: 16,
		padding: 15
	},
	buttonEnabled: {
		alignSelf: "center",
		borderRadius: 30,
		padding: 11,
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
});
