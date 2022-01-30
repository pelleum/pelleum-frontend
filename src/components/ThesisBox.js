import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { HStack, NativeBaseProvider, Box } from "native-base";
import {
	MAIN_BACKGROUND_COLOR,
	LIGHT_GREY_COLOR,
	MAIN_DIFFERENTIATOR_COLOR,
} from "../styles/Colors";
import AppText from "../components/AppText";
import commonTextStyles from "../styles/CommonText";
import commonButtonStyles from "../styles/CommonButtons";

export class ThesesBoxType {
	static Contained = new ThesesBoxType("contained");
	static StandAlone = new ThesesBoxType("standAlone");

	constructor(type) {
		this.type = type;
	}
}

export const THESIS_BOX_HEIGHT = 200;

// StandAlone is the default thesisBoxType
const ThesisBox = ({ item, nav, thesisBoxType = ThesesBoxType.StandAlone }) => {
	const dateWritten = new Date(item.created_at);

	return (
		<NativeBaseProvider>
			<TouchableOpacity
				onPress={() => {
					nav.navigate("Thesis", item);
				}}
			>
				<Box
					style={
						thesisBoxType == ThesesBoxType.Contained
							? styles.thesisContainerContained
							: styles.thesisContainerStandAlone
					}
				>
					<HStack justifyContent="space-between">
						<AppText style={commonTextStyles.usernameText}>@{item.username}</AppText>
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
						<AppText style={styles.thesisTitleText}>{item.title}</AppText>
					<HStack justifyContent="space-between">
						{item.asset_symbol ? (
							<TouchableOpacity
								style={commonButtonStyles.assetButton}
								onPress={() => {
									console.log("Asset button worked.");
								}}
							>
								<AppText style={commonButtonStyles.assetText}>#{item.asset_symbol}</AppText>
							</TouchableOpacity>
						) : null}
						<AppText style={commonTextStyles.dateText}>
							{dateWritten.toLocaleDateString()}
						</AppText>
					</HStack>
					<AppText numberOfLines={5}>{item.content}...</AppText>
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
		paddingHorizontal: 25,
		fontSize: 16,
		backgroundColor: MAIN_BACKGROUND_COLOR,
		borderBottomWidth: 0.17,
		borderBottomColor: LIGHT_GREY_COLOR,
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
		borderRadius: 25,
		overflow: "hidden",
	},
	thesisTitleText: {
		marginTop: 5,
		fontWeight: "bold",
		fontSize: 16,
	},
});
