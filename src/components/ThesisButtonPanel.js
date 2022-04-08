import React from "react";
import { StyleSheet, TouchableOpacity, Alert, Share, View } from "react-native";
import { HStack, NativeBaseProvider } from "native-base";
import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import ThesesManager from "../managers/ThesesManager";
import RationalesManager from "../managers/RationalesManager";
import { LIGHT_GREY_COLOR, MAIN_SECONDARY_COLOR } from "../styles/Colors";
import { useAnalytics } from '@segment/analytics-react-native';
import AppText from "./AppText";

// Redux
import { useSelector } from "react-redux";
import { ReactionType } from "../redux/actions/ThesisReactionsActions";

const ThesisButtonPanel = ({ thesis, nav }) => {
	// State Management
	const state = useSelector((state) => state.thesisReactionsReducer);
	const { rationaleLibrary } = useSelector((state) => state.rationaleReducer);
	const { userObject } = useSelector((state) => state.authReducer);

	// Segment Tracking
	const { track } = useAnalytics();

	const thesisIsLiked =
		(thesis.user_reaction_value == 1 &&
			!state.locallyUnlikedTheses.includes(thesis.thesis_id) &&
			!state.locallyDislikedTheses.includes(thesis.thesis_id) &&
			!state.locallyRemovedDislikedTheses.includes(thesis.thesis_id)) ||
		state.locallyLikedTheses.includes(thesis.thesis_id);

	const thesisIsDisliked =
		(thesis.user_reaction_value == -1 &&
			!state.locallyRemovedDislikedTheses.includes(thesis.thesis_id) &&
			!state.locallyLikedTheses.includes(thesis.thesis_id) &&
			!state.locallyUnlikedTheses.includes(thesis.thesis_id)) ||
		state.locallyDislikedTheses.includes(thesis.thesis_id);

	const extractSources = (sources) => {
		let sourceText = "";
		for (const source of sources) { sourceText += `${source}\n` }
		if (sources.length == 0) { return "This thesis has no linked sources😕" }
		return sourceText;
	};

	const onShare = async (thesis) => {
		const sourceText = extractSources(thesis.sources);
		try {
			const result = await Share.share(
				{
					message: `@${thesis.username} wrote the following ${thesis.asset_symbol} thesis on Pelleum💥:\n\n"${thesis.title}\n\n${thesis.content}"\n\nSources:\n${sourceText}\n\nPut your money where your mouth is — join Pelleum today:\nhttps://www.pelleum.com/download`,
				},
				{
					excludedActivityTypes: [
						'com.apple.UIKit.activity.AirDrop',
					]
				},
			);
			if (result.action === Share.sharedAction) {
				if (result.activityType) {
					// shared with activity type of result.activityType
					// iOS
					track('Thesis Shared', {
						authorUserId: thesis.user_id,
						authorUsername: thesis.username,
						thesisId: thesis.thesis_id,
						assetSymbol: thesis.asset_symbol,
						sentiment: thesis.sentiment,
						sourcesQuantity: thesis.sources.length,
					});
				} else {
					// Shared on Android
					// This does not take into account a user dismissing the Share modal
					// We should only track the event if it is ACTUALLY shared
					// Consider using https://react-native-share.github.io/react-native-share/
					track('Thesis Shared', {
						authorUserId: thesis.user_id,
						authorUsername: thesis.username,
						thesisId: thesis.thesis_id,
						assetSymbol: thesis.asset_symbol,
						sentiment: thesis.sentiment,
						sourcesQuantity: thesis.sources.length,
					});
				}
			} else if (result.action === Share.dismissedAction) {
				// dismissed
			}
		} catch (error) {
			alert(error.message);
		}
	};

	const handleAddRationale = async (thesis) => {
		const response = await RationalesManager.addRationale(thesis);
		const sourcesQuantity = thesis.sources ? thesis.sources.length : 0;
		if (response.status == 201) {
			track('Rationale Added', {
				authorUserId: thesis.user_id,
				authorUsername: thesis.username,
				thesisId: thesis.thesis_id,
				assetSymbol: thesis.asset_symbol,
				sentiment: thesis.sentiment,
				sourcesQuantity: sourcesQuantity,
				organic: true,
			});
			Alert.alert(
				`This thesis was added to your ${thesis.asset_symbol} Rationale Library 🎉`,
				`Use your Rationale Library, accessible in your profile, to keep track of your investment reasoning. You can remove theses anytime by swiping left🙂`,
				[
					{ text: "Got it!", onPress: () => {/* do nothing */ } },
				]
			);
		} else if (response.status == 403) {
			Alert.alert(
				`${thesis.asset_symbol} ${thesis.sentiment} Rationale Limit Reached`,
				`To keep your investment research focused, Pelleum allows a maximum of 25 ${thesis.sentiment} theses per asset. To add this thesis to your ${thesis.asset_symbol} ${thesis.sentiment} library, please remove one by swiping left.`,
				[
					{
						text: "Remove later",
						onPress: () => {
							/* do nothing */
						},
					},
					{
						text: "Remove now",
						onPress: async () => {
							nav.navigate("RationaleScreen", {
								thesisToAddAfterRemoval: thesis,
								asset: thesis.asset_symbol,
								userId: userObject.userId,
							});
						},
					},
				]
			);
		}
	};

	return (
		<NativeBaseProvider>
			<View style={styles.mainContainer}>
				<HStack style={styles.buttonBox}>
					<View alignItems="center">
						<TouchableOpacity
							style={styles.iconButton}
							onPress={() => ThesesManager.sendThesisReaction(thesis, ReactionType.Like)}
						>
							<HStack alignItems={"center"}>
								<View style={styles.iconContainer}>
									<AntDesign
										name={thesisIsLiked ? "like1" : "like2"}
										size={20}
										color={thesisIsLiked ? MAIN_SECONDARY_COLOR : LIGHT_GREY_COLOR}
									/>
								</View>
								{thesis.like_count > 0 ? (
									state.locallyLikedTheses.includes(thesis.thesis_id) ? (
										<AppText style={styles.countStyle}>
											{thesis.like_count + 1}
										</AppText>
									) : (
										<AppText style={styles.countStyle}>{thesis.like_count}</AppText>
									)
								) : state.locallyLikedTheses.includes(thesis.thesis_id) ? (
									<AppText style={styles.countStyle}>
										{thesis.like_count + 1}
									</AppText>
								) : null}
							</HStack>
						</TouchableOpacity>
						<AppText style={styles.buttonDescription}>Like</AppText>
					</View>
					<View alignItems="center">
						<TouchableOpacity
							style={styles.iconButton}
							onPress={() => ThesesManager.sendThesisReaction(thesis, ReactionType.Dislike)}
						>
							<HStack alignItems={"center"}>
								<View style={styles.iconContainer}>
									<AntDesign
										name={thesisIsDisliked ? "dislike1" : "dislike2"}
										size={20}
										color={thesisIsDisliked ? MAIN_SECONDARY_COLOR : LIGHT_GREY_COLOR}
									/>
								</View>
								{thesis.dislike_count > 0 ? (
									state.locallyDislikedTheses.includes(thesis.thesis_id) ? (
										<AppText style={styles.countStyle}>
											{thesis.dislike_count + 1}
										</AppText>
									) : (
										<AppText style={styles.countStyle}>{thesis.dislike_count}</AppText>
									)
								) : state.locallyDislikedTheses.includes(thesis.thesis_id) ? (
									<AppText style={styles.countStyle}>
										{thesis.dislike_count + 1}
									</AppText>
								) : null}
							</HStack>
						</TouchableOpacity>
						<AppText style={styles.buttonDescription}>Dislike</AppText>
					</View>
					<View alignItems="center">
						<TouchableOpacity
							style={
								rationaleLibrary.some(
									(rationale) => rationale.thesisID === thesis.thesis_id
								)
									? styles.disabledIconButton
									: styles.iconButton
							}
							onPress={() => handleAddRationale(thesis)}
							disabled={
								rationaleLibrary.some(
									(rationale) => rationale.thesisID === thesis.thesis_id
								)
									? true
									: false
							}
						>
							<HStack alignItems={"center"}>
								<View style={styles.iconContainer}>
									<MaterialIcons name="post-add" size={24} color={LIGHT_GREY_COLOR} />
								</View>
								{thesis.save_count > 0 ? (
									<AppText style={styles.countStyle}>{thesis.save_count}</AppText>
								) : null}
							</HStack>
						</TouchableOpacity>
						<AppText style={styles.buttonDescription}>Save</AppText>
					</View>
					<View alignItems="center">
						<TouchableOpacity
							style={styles.iconButton}
							onPress={() => onShare(thesis)}
						>
							<View style={styles.iconContainer}>
								<FontAwesome name="send-o" size={16} color={LIGHT_GREY_COLOR} />
							</View>
						</TouchableOpacity>
						<AppText style={styles.buttonDescription}>Share</AppText>
					</View>
				</HStack>
			</View>
		</NativeBaseProvider>
	);
};

export default ThesisButtonPanel;

const styles = StyleSheet.create({
	mainContainer: {
		alignItems: "center",
	},
	buttonBox: {
		marginTop: 5,
		justifyContent: "space-between",
		width: "92%",
	},
	iconContainer: {
		alignItems: "center",
		justifyContent: "center",
		height: 30,
		width: 30,
	},
	iconButton: {
		height: "70%",
		paddingHorizontal: 13,
		paddingVertical: 8,
	},
	disabledIconButton: {
		height: "70%",
		paddingHorizontal: 13,
		paddingVertical: 8,
		opacity: 0.375,
	},
	countStyle: {
		color: LIGHT_GREY_COLOR,
		marginLeft: 6,
	},
	buttonDescription: {
		color: LIGHT_GREY_COLOR,
		height: "30%",
	}
});
