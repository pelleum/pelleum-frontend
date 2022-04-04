import React from "react";
import { StyleSheet, TouchableOpacity, Platform, View } from "react-native";
import { HStack, NativeBaseProvider, Box } from "native-base";
import {
	MAIN_BACKGROUND_COLOR,
	LIGHT_GREY_COLOR,
	LIST_SEPARATOR_COLOR,
} from "../styles/Colors";
import AppText from "../components/AppText";
import commonTextStyles from "../styles/CommonText";
import commonButtonStyles from "../styles/CommonButtons";
import SentimentPill, { Sentiment } from "./SentimentPill";
import {
	MAXIMUM_THESIS_CONTENT_VISIBLE_LINES,
	MAXIMUM_THESIS_TITLE_VISIBLE_LINES,
	THESIS_BOX_HEIGHT,
} from "../constants/ThesesConstants";

export class ThesesBoxType {
	static Contained = new ThesesBoxType("contained");
	static StandAlone = new ThesesBoxType("standAlone");

	constructor(type) {
		this.type = type;
	};
};

// StandAlone is the default thesisBoxType
const ThesisBox = ({ item, nav, thesisBoxType = ThesesBoxType.StandAlone }) => {
	const dateWritten = new Date(item.created_at);

	return (
		<NativeBaseProvider>
			<TouchableOpacity
				onPress={() => {
					nav.navigate("ThesisDetailScreen", item);
				}}
			>
				<Box
					style={
						thesisBoxType == ThesesBoxType.Contained
							? styles.thesisContainerContained
							: styles.thesisContainerStandAlone
					}
				>
					<HStack justifyContent="space-between" alignItems={"center"}>
						<TouchableOpacity
							style={styles.usernameButton}
							onPress={() =>
								nav.navigate("PortfolioInsightScreen", {
									username: item.username,
									userId: item.user_id,
								})}
						>
							<AppText style={commonTextStyles.usernameText}>
								@{item.username}
							</AppText>
						</TouchableOpacity>
						<View>
							{item.sentiment === "Bull" ? (
								<SentimentPill item={item} sentiment={Sentiment.Bull} />
							) : (
								<SentimentPill item={item} sentiment={Sentiment.Bear} />
							)}
						</View>
					</HStack>
					<AppText
						style={styles.thesisTitleText}
						numberOfLines={MAXIMUM_THESIS_TITLE_VISIBLE_LINES}
					>
						{item.title}</AppText>
					<HStack justifyContent="space-between" alignItems="center">
						{item.asset_symbol ? (
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
						<AppText style={commonTextStyles.dateText}>
							{dateWritten.toLocaleDateString()}
						</AppText>
					</HStack>
					<AppText numberOfLines={MAXIMUM_THESIS_CONTENT_VISIBLE_LINES}>{item.content}</AppText>
				</Box>
			</TouchableOpacity>
		</NativeBaseProvider>
	);
};

export default React.memo(ThesisBox);

const styles = StyleSheet.create({
	thesisContainerStandAlone: {
		width: "100%",
		height: THESIS_BOX_HEIGHT,
		paddingVertical: 10,
		paddingHorizontal: 10,
		fontSize: 16,
		backgroundColor: MAIN_BACKGROUND_COLOR,
		borderBottomWidth: Platform.OS === "ios" ? 0.17 : 0.29,
		borderBottomColor: LIST_SEPARATOR_COLOR,
		overflow: "hidden",
	},
	thesisContainerContained: {
		width: "100%",
		height: 220,
		padding: 10,
		fontSize: 16,
		backgroundColor: MAIN_BACKGROUND_COLOR,
		borderWidth: 0.3,
		borderColor: LIGHT_GREY_COLOR,
		borderRadius: Platform.OS === "ios" ? 25 : 14,
		overflow: "hidden",
	},
	thesisTitleText: {
		marginTop: 5,
		fontWeight: "bold",
		fontSize: 16,
	},
	usernameButton: {
		paddingVertical: 10,
	},
});
