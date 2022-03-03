import React from "react";
import { StyleSheet, TouchableOpacity, Alert } from "react-native";
import { HStack, NativeBaseProvider } from "native-base";
import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import ThesesManager from "../managers/ThesesManager";
import RationalesManager from "../managers/RationalesManager";
import { LIGHT_GREY_COLOR, MAIN_SECONDARY_COLOR } from "../styles/Colors";
import { useDebouncedCallback } from 'use-debounce';
import { useAnalytics } from '@segment/analytics-react-native';

// Redux
import { useSelector } from "react-redux";
import { ReactionType } from "../redux/actions/ThesisReactionsActions";
import * as SecureStore from "expo-secure-store";

const ThesisButtonPanel = ({ item, nav }) => {
	const state = useSelector((state) => state.thesisReactionsReducer);
	const { rationaleLibrary } = useSelector((state) => state.rationaleReducer);

	// Segment Tracking
	const { track } = useAnalytics();

	const thesisIsLiked =
		(item.user_reaction_value == 1 &&
			!state.locallyUnlikedTheses.includes(item.thesis_id) &&
			!state.locallyDislikedTheses.includes(item.thesis_id) &&
			!state.locallyRemovedDislikedTheses.includes(item.thesis_id)) ||
		state.locallyLikedTheses.includes(item.thesis_id);

	const thesisIsDisliked =
		(item.user_reaction_value == -1 &&
			!state.locallyRemovedDislikedTheses.includes(item.thesis_id) &&
			!state.locallyLikedTheses.includes(item.thesis_id) &&
			!state.locallyUnlikedTheses.includes(item.thesis_id)) ||
		state.locallyDislikedTheses.includes(item.thesis_id);

	const getUserObject = async () => {
		const userObjectString = await SecureStore.getItemAsync("userObject");
		return JSON.parse(userObjectString);
	};

	const handleAddRationale = async (item) => {
		const response = await RationalesManager.addRationale(item);
		if (response.status == 201) {
			track('Rationale Added', {
				author_user_id: item.user_id,
				asset_symbol: item.asset_symbol,
				sentiment: item.sentiment,
				organic: true,
			});
			Alert.alert(
				`This thesis was added to your ${item.asset_symbol} Rationale Library 🎉`,
				`Use your Rationale Library, accessible in your profile, to keep track of your investment reasoning. You can remove theses anytime by swiping left🙂`,
				[
					{ text: "Got it!", onPress: () => {/* do nothing */ } },
				]
			);
		} else if (response.status == 403) {
			Alert.alert(
				`${item.asset_symbol} ${item.sentiment} Rationale Limit Reached`,
				`To keep your investment research focused, Pelleum allows a maximum of 25 ${item.sentiment} theses per asset. To add this thesis to your ${item.asset_symbol} ${item.sentiment} library, please remove one by swiping left.`,
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
							const userObject = await getUserObject();
							nav.navigate("Rationales", {
								thesisToAddAfterRemoval: item,
								asset: item.asset_symbol,
								userId: userObject.user_id,
							});
						},
					},
				]
			);
		}
	};

	// Prevent user from tapping "Like" or "Dislike" multiple times before API response promise gets fulfilled
	// Debounce callback
	const likeDebounced = useDebouncedCallback(
		// function
		(item) => {
			ThesesManager.sendThesisReaction(item, ReactionType.Like)
		},
		// delay in ms
		1000
	);
	const dislikeDebounced = useDebouncedCallback(
		// function
		(item) => {
			ThesesManager.sendThesisReaction(item, ReactionType.Dislike)
		},
		// delay in ms
		1000
	);

	return (
		<NativeBaseProvider>
			<HStack style={styles.buttonBox}>
				<TouchableOpacity
					style={styles.iconButton}
					onPress={() => likeDebounced(item)}
				>
					<AntDesign
						name={thesisIsLiked ? "like1" : "like2"}
						size={20}
						color={thesisIsLiked ? MAIN_SECONDARY_COLOR : LIGHT_GREY_COLOR}
					/>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.iconButton}
					onPress={() => dislikeDebounced(item)}
				>
					<AntDesign
						name={thesisIsDisliked ? "dislike1" : "dislike2"}
						size={20}
						color={thesisIsDisliked ? MAIN_SECONDARY_COLOR : LIGHT_GREY_COLOR}
					/>
				</TouchableOpacity>
				<TouchableOpacity
					style={
						rationaleLibrary.some(
							(rationale) => rationale.thesisID === item.thesis_id
						)
							? styles.disabledIconButton
							: styles.iconButton
					}
					onPress={() => handleAddRationale(item)}
					disabled={
						rationaleLibrary.some(
							(rationale) => rationale.thesisID === item.thesis_id
						)
							? true
							: false
					}
				>
					<MaterialIcons name="post-add" size={24} color={LIGHT_GREY_COLOR} />
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.iconButton}
					onPress={() => {
						console.log("Share button worked.");
					}}
				>
					<FontAwesome name="send-o" size={16} color={LIGHT_GREY_COLOR} />
				</TouchableOpacity>
			</HStack>
		</NativeBaseProvider>
	);
};

export default ThesisButtonPanel;

const styles = StyleSheet.create({
	buttonBox: {
		paddingTop: 5,
		alignSelf: "center",
		alignItems: "center",
		width: "92%",
		flexDirection: "row",
		justifyContent: "space-between",
	},
	iconButton: {
		paddingHorizontal: 13,
		paddingTop: 8,
	},
	disabledIconButton: {
		paddingHorizontal: 13,
		paddingTop: 8,
		opacity: 0.375,
	},
});
