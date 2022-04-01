import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	TextInput,
	Image,
	TouchableOpacity,
	View,
	SafeAreaView,
	Alert,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { HStack, NativeBaseProvider } from "native-base";
import SwitchSelector from "react-native-switch-selector";
import PostsManager from "../managers/PostsManager";
import DismissKeyboard from "../components/DismissKeyboard";
import AppText from "../components/AppText";
import {
	LIGHT_GREY_COLOR,
	MAIN_DIFFERENTIATOR_COLOR,
	MAIN_SECONDARY_COLOR,
	TEXT_COLOR,
	BAD_COLOR,
	BULL_SENTIMENT_BACKGROUND__COLOR,
	BEAR_SENTIMENT_BACKGROUND__COLOR,
	GOOD_COLOR,
	LIST_SEPARATOR_COLOR,
	CREATE_PLACEHOLDER_COLOR,
} from "../styles/Colors";
import { useDispatch } from "react-redux";
import { addPost } from "../redux/actions/PostActions";
import * as Haptics from 'expo-haptics';
import { useAnalytics } from '@segment/analytics-react-native';
import { MAXIMUM_POST_CHARACTERS } from "../constants/PostsConstants";


const CreatePostScreen = ({ navigation }) => {
	// Universal state
	const dispatch = useDispatch();

	// Segment Tracking
	const { track } = useAnalytics();

	// Local state
	const [content, setContent] = useState("");
	const [asset_symbol, setAssetSymbol] = useState("");
	const [sentiment, setSentiment] = useState("Bull");
	const [error, setError] = useState(null);
	const [inputValidity, setInputValidity] = useState({
		assetSymbolValidity: false,
		contentValidity: false,
	});
	const [disableStatus, setDisableStatus] = useState(true);

	const sentimentOptions = [
		{ label: "Bull", value: "Bull" },
		{ label: "Bear", value: "Bear" },
	];

	const shareButtonPressed = async () => {
		const createdPost = await PostsManager.createPost({
			content,
			asset_symbol,
			sentiment,
		});
		if (createdPost) {
			const containsThesis = createdPost.thesis ? true : false;
			dispatch(addPost(createdPost));
			track('Post Created', {
				authorUserId: createdPost.user_id,
				authorUsername: createdPost.username,
				assetSymbol: createdPost.asset_symbol,
				postId: createdPost.post_id,
				sentiment: createdPost.sentiment,
				postType: "feedPost",
				containsThesis: containsThesis,
				organic: true,
			});
			setContent("");
			setAssetSymbol("");
			setDisableStatus(true);
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
			navigation.navigate("FeedScreen");
		}
	};

	const handleChangeText = ({
		newValue,
		checkContent = false,
		checkSymbol = false,
	} = {}) => {
		setError(null);
		var newInputValidity = inputValidity;

		if (checkContent) {
			setContent(newValue);
			if (newValue.length < 1) {
				newInputValidity["contentValidity"] = false;
				setInputValidity(newInputValidity);
			} else {
				newInputValidity["contentValidity"] = true;
				setInputValidity(newInputValidity);
			}
		}

		if (checkSymbol) {
			setAssetSymbol(newValue);
			if (newValue.length < 1) {
				newInputValidity["assetSymbolValidity"] = false;
				setInputValidity(newInputValidity);
			} else {
				newInputValidity["assetSymbolValidity"] = true;
				setInputValidity(newInputValidity);
			}
		}

		if (Object.values(inputValidity).every((item) => item === true)) {
			setDisableStatus(false);
		} else {
			setDisableStatus(true);
		}
	};

	const hasUnsavedChanges = (
		Boolean(content) ||
		Boolean(asset_symbol)
	);

	// Alert user they have unsaved changes
	// https://reactnavigation.org/docs/preventing-going-back/
	useEffect(() => navigation.addListener('beforeRemove', (e) => {
		if (!hasUnsavedChanges) {
			// If we don't have unsaved changes, then we don't need to do anything
			return;
		}
		// Prevent default behavior of leaving the screen
		e.preventDefault();
		// Prompt the user before leaving the screen
		Alert.alert(
			'You are about to exit this screen.',
			'Your post draft will not be saved. Are you sure you want to exit and discard your post draft?',
			[
				{ text: "Cancel", style: 'cancel', onPress: () => { } },
				{
					text: 'Discard',
					style: 'destructive',
					// If the user confirmed, then we dispatch the action we blocked earlier
					// This will continue the action that had triggered the removal of the screen
					onPress: () => navigation.dispatch(e.data.action),
				},
			]
		);
	}),
		[navigation, hasUnsavedChanges]
	);

	return (
		<KeyboardAwareScrollView
			showsVerticalScrollIndicator={false}
			enableAutomaticScroll={true}
			enableOnAndroid={true} 		          //enable Android native softwareKeyboardLayoutMode
			extraHeight={185}					  //when keyboard comes up, scroll up
			keyboardShouldPersistTaps={'handled'} //scroll or tap buttons without dismissing the keyboard first
		>
			<DismissKeyboard>
				<SafeAreaView style={styles.mainContainer}>
					<NativeBaseProvider>
						<View width={"100%"}>
							<HStack alignItems="center" justifyContent="space-between" my="15">
								<Image
									style={styles.image}
									source={require("../../assets/defaultProfileImage.png")}
								/>
								<TouchableOpacity
									style={
										disableStatus
											? styles.shareButtonDisabled
											: styles.shareButtonEnabled
									}
									disabled={disableStatus}
									onPress={() => {
										shareButtonPressed();
									}}
								>
									<AppText style={styles.buttonText}>Share</AppText>
								</TouchableOpacity>
							</HStack>
							<TextInput
								color={TEXT_COLOR}
								selectionColor={MAIN_SECONDARY_COLOR}
								placeholder="Ex: GOOGL"
								placeholderTextColor={CREATE_PLACEHOLDER_COLOR}
								autoCorrect={false}
								maxLength={5}
								value={asset_symbol}
								onChangeText={(newValue) =>
									//toUpperCase has a bug on Android
									//https://github.com/facebook/react-native/issues/27449
									//https://github.com/facebook/react-native/issues/11068
									//replace(/\s/g, "") forbids spaces
									handleChangeText({ newValue: newValue.replace(/\s/g, "").toUpperCase(), checkSymbol: true })
								}
								autoCapitalize="characters"
								style={styles.assetSymbolInput}
							/>
							<AppText style={styles.inputLabel}>Ticker Symbol</AppText>
							<TextInput
								color={TEXT_COLOR}
								selectionColor={MAIN_SECONDARY_COLOR}
								placeholder="What's your valuable insight?"
								placeholderTextColor={CREATE_PLACEHOLDER_COLOR}
								multiline={true}
								maxHeight={190}
								numberOfLines={10}
								style={styles.textArea}
								maxLength={MAXIMUM_POST_CHARACTERS}
								value={content}
								onChangeText={(newValue) =>
									handleChangeText({ newValue: newValue, checkContent: true })
								}
							/>
						</View>
						<View style={styles.switchSelectorContainer}>
							<SwitchSelector
								options={sentimentOptions}
								initial={0}
								onPress={(value) => {
									if (value === sentiment) {
										//do nothing
									} else {
										setSentiment(value);
									}
								}}
								height={40}
								buttonColor={sentiment === "Bull" ? BULL_SENTIMENT_BACKGROUND__COLOR : BEAR_SENTIMENT_BACKGROUND__COLOR}
								textColor={sentiment === "Bull" ? BAD_COLOR : GOOD_COLOR}
								borderColor={MAIN_DIFFERENTIATOR_COLOR}
								backgroundColor={MAIN_DIFFERENTIATOR_COLOR}
								selectedColor={sentiment === "Bull" ? GOOD_COLOR : BAD_COLOR}
								fontSize={16}
								bold={true}
								hasPadding
								style={styles.sentimentToggle}
							/>
						</View>
						{error ? <AppText style={styles.errorText}>{error}</AppText> : null}
					</NativeBaseProvider>
				</SafeAreaView>
			</DismissKeyboard>
		</KeyboardAwareScrollView>
	);
};

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		marginHorizontal: 15,
	},
	textArea: {
		height: 190,
		marginTop: 20,
		borderBottomWidth: 0.5,
		borderBottomColor: LIST_SEPARATOR_COLOR,
		textAlignVertical: 'top',
	},
	image: {
		width: 44,
		height: 44,
		borderRadius: 44 / 2,
	},
	shareButtonEnabled: {
		backgroundColor: MAIN_SECONDARY_COLOR,
		borderRadius: 30,
		height: 35,
		width: 80,
		justifyContent: "center",
		alignItems: "center",
	},
	shareButtonDisabled: {
		backgroundColor: MAIN_SECONDARY_COLOR,
		borderRadius: 30,
		height: 35,
		width: 80,
		justifyContent: "center",
		alignItems: "center",
		opacity: 0.33,
	},
	buttonText: {
		color: "white",
	},
	iconButton: {
		marginLeft: 5,
	},
	switchSelectorContainer: {
		width: "40%",
		height: 45,
		alignSelf: "flex-start",
		justifyContent: "center",
		marginTop: 10,
	},
	hStack: {
		marginTop: 5,
	},
	errorText: {
		color: BAD_COLOR,
	},
	assetSymbolInput: {
		paddingVertical: 5,
		borderBottomWidth: 0.5,
		borderBottomColor: LIST_SEPARATOR_COLOR,
		marginBottom: 5,
		marginTop: 10,
		width: "25%",
	},
	sentimentToggle: {
		opacity: 0.65,
	},
	inputLabel: {
		color: LIGHT_GREY_COLOR,
	},
});

export default CreatePostScreen;
