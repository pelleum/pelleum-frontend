import React, { useState } from "react";
import {
	StyleSheet,
	TextInput,
	Image,
	TouchableOpacity,
	View,
	KeyboardAvoidingView,
	SafeAreaView

} from "react-native";
import { HStack, NativeBaseProvider } from "native-base";
import SwitchSelector from "react-native-switch-selector";
import PostsManager from "../managers/PostsManager";
import DismissKeyboard from "../components/DismissKeyboard";
import AppText from "../components/AppText";
import {
	LIGHT_GREY_COLOR,
	CREATE_PLACEHOLDER_COLOR,
	MAIN_DIFFERENTIATOR_COLOR,
	MAIN_SECONDARY_COLOR,
	TEXT_COLOR,
	BAD_COLOR,
	GOOD_COLOR,
} from "../styles/Colors";
import { useDispatch } from "react-redux";
import { addPost } from "../redux/actions/PostActions";
import * as Haptics from 'expo-haptics';
import { useAnalytics } from '@segment/analytics-react-native';


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
			dispatch(addPost(createdPost));
			setContent("");
			setAssetSymbol("");
			setDisableStatus(true);
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
			navigation.navigate("Feed");
			track('Post Created')
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

	return (
		<DismissKeyboard>
			<SafeAreaView style={styles.mainContainer}>
				<NativeBaseProvider>
					<KeyboardAvoidingView width={"100%"} behavior={"position"} keyboardVerticalOffset={100}>
						{/* <KeyboardAvoidingView width={"100%"} behavior={"padding"}> */}
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
							selectionColor={TEXT_COLOR}
							placeholder="Ex: GOOGL"
							placeholderTextColor={CREATE_PLACEHOLDER_COLOR}
							autoCapitalize="characters"
							autoCorrect={false}
							maxLength={5}
							textTransform="uppercase"
							value={asset_symbol}
							onChangeText={(newValue) =>
								handleChangeText({ newValue: newValue, checkSymbol: true })
							}
							style={styles.assetSymbolInput}
						/>
						<AppText>Ticker Symbol</AppText>
						<TextInput
							color={TEXT_COLOR}
							selectionColor={TEXT_COLOR}
							placeholder="What's your valuable insight?"
							placeholderTextColor={CREATE_PLACEHOLDER_COLOR}
							multiline={true}
							numberOfLines={20}
							style={styles.textArea}
							maxLength={512}
							value={content}
							onChangeText={(newValue) =>
								handleChangeText({ newValue: newValue, checkContent: true })
							}
						/>
						</KeyboardAvoidingView>

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
								buttonColor={sentiment == "Bull" ? GOOD_COLOR : BAD_COLOR}
								backgroundColor={MAIN_DIFFERENTIATOR_COLOR}
								borderColor={MAIN_DIFFERENTIATOR_COLOR}
								selectedColor={"white"}
								textColor={sentiment == "Bull" ? BAD_COLOR : GOOD_COLOR}
								bold={true}
								fontSize={16}
								hasPadding
							/>
						</View>
						{error ? <AppText style={styles.errorText}>{error}</AppText> : null}
				</NativeBaseProvider>
			</SafeAreaView>
		</DismissKeyboard>
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
		borderBottomColor: LIGHT_GREY_COLOR,
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
		width: "30%",
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
		backgroundColor: "transparent",
		paddingVertical: 5,
		borderBottomWidth: 0.5,
		borderBottomColor: LIGHT_GREY_COLOR,
		marginBottom: 5,
		marginTop: 10,
		width: "25%",
	},
});

export default CreatePostScreen;
