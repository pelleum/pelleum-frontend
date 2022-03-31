// installed libraries
import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	TextInput,
	Image,
	TouchableOpacity,
	View,
	Alert,
	SafeAreaView,
	KeyboardAvoidingView,
} from "react-native";
import { HStack, VStack, NativeBaseProvider } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import SwitchSelector from "react-native-switch-selector";
import { useAnalytics } from "@segment/analytics-react-native";

// local file imports
import DismissKeyboard from "../components/DismissKeyboard";
import AddSourcesModal from "../components/modals/AddSourcesModal";
import ThesesManager from "../managers/ThesesManager";
import PostsManager from "../managers/PostsManager";
import RationalesManager from "../managers/RationalesManager";
import AppText from "../components/AppText";
import { useDispatch } from "react-redux";
import { addPost } from "../redux/actions/PostActions";
import * as Haptics from "expo-haptics";
import {
	TEXT_COLOR,
	MAIN_DIFFERENTIATOR_COLOR,
	LIGHT_GREY_COLOR,
	MAIN_SECONDARY_COLOR,
	BAD_COLOR,
	BULL_SENTIMENT_BACKGROUND__COLOR,
	BEAR_SENTIMENT_BACKGROUND__COLOR,
	GOOD_COLOR,
	LIST_SEPARATOR_COLOR,
	CREATE_PLACEHOLDER_COLOR,
} from "../styles/Colors";
import {
	MAXIMUM_THESIS_CONTENT_CHARACTERS,
	MAXIMUM_THESIS_TITLE_CHARACTERS,
} from "../constants/ThesesConstants";

const CreateThesisScreen = ({ navigation, route }) => {
	// Universal State
	const dispatch = useDispatch();
	// Local State
	// Determine whether or not this screen is being used to create
	// or update a thesis. If it receives route params, it's used to update, else create
	const updatingThesis = route.params ? true : false;
	if (updatingThesis) {
		var [content, setContent] = useState(route.params.thesis.content);
		var [asset_symbol, setAssetSymbol] = useState(route.params.thesis.asset_symbol);
		var [title, setTitle] = useState(route.params.thesis.title);
		var [sentiment, setSentiment] = useState(route.params.thesis.sentiment);
		var [sources, setSources] = useState(route.params.thesis.sources);
		var [validSources, setValidSources] = useState(route.params.thesis.sources.filter((e) => e));
		var [inputValidity, setInputValidity] = useState({
			assetSymbolValidity: true,
			contentValidity: true,
			titleValidity: true,
		});
	} else {
		var [content, setContent] = useState("");
		var [asset_symbol, setAssetSymbol] = useState("");
		var [title, setTitle] = useState("");
		var [sentiment, setSentiment] = useState("Bull");
		var [sources, setSources] = useState(["", "", "", "", "", ""]);
		var [validSources, setValidSources] = useState([]);
		var [inputValidity, setInputValidity] = useState({
			assetSymbolValidity: false,
			contentValidity: false,
			titleValidity: false,
		});
	}
	const [hackValue, setHackValue] = useState(""); // A hack that gets the sources state variable to update
	const [disableStatus, setDisableStatus] = useState(true);
	const [modalVisible, setModalVisible] = useState(false);
	const sentimentOptions = [
		{ label: "Bull", value: "Bull" },
		{ label: "Bear", value: "Bear" },
	];

	// Segment Tracking
	const { track } = useAnalytics();
	
	const countSources = () => {
		// Executed when user exits the AddSourcesModal
		let newValidSources = [];
		sources.forEach((source, i) => {
			if (source) {
				newValidSources.push(source);
			}
		});
		setValidSources(newValidSources);
	};

	const handleChangeSource = (newValue, sourceNumber) => {
		// Executed when a source is changed in the (child) Modal
		const newSources = sources;
		newSources[sourceNumber - 1] = newValue;
		setSources(newSources);
		setHackValue(newValue);
	};

	const hasUnsavedChanges =
		Boolean(content) ||
		Boolean(asset_symbol) ||
		Boolean(title) ||
		sources.includes(!"");

	// Alert user they have unsaved changes
	// https://reactnavigation.org/docs/preventing-going-back/
	useEffect(
		() =>
			navigation.addListener("beforeRemove", (e) => {
				if (!hasUnsavedChanges) {
					// If we don't have unsaved changes, then we don't need to do anything
					return;
				}
				// Prevent default behavior of leaving the screen
				e.preventDefault();
				// Prompt the user before leaving the screen
				Alert.alert(
					"You are about to exit this screen.",
					"Your thesis draft will not be saved. Are you sure you want to exit and discard your thesis draft?",
					[
						{ text: "Cancel", style: "cancel", onPress: () => {} },
						{
							text: "Discard",
							style: "destructive",
							// If the user confirmed, then we dispatch the action we blocked earlier
							// This will continue the action that had triggered the removal of the screen
							onPress: () => navigation.dispatch(e.data.action),
						},
					]
				);
			}),
		[navigation, hasUnsavedChanges]
	);

	const handleAddRationale = async (createdThesis) => {
		const response = await RationalesManager.addRationale(createdThesis);
		if (response.status == 201) {
			track("Rationale Added", {
				authorUserId: createdThesis.user_id,
				authorUsername: createdThesis.username,
				thesisId: createdThesis.thesis_id,
				assetSymbol: createdThesis.asset_symbol,
				sentiment: createdThesis.sentiment,
				sourcesQuantity: createdThesis.sources.length,
				organic: false,
			});
			Alert.alert(
				`Your thesis was added to your ${createdThesis.asset_symbol} Rationale Library 🎉`,
				`Use your Rationale Library, accessible in your profile, to keep track of your investment reasoning. You can remove theses anytime by swiping left🙂`,
				[
					{
						text: "Got it!",
						onPress: () => {
							/* do nothing */
						},
					},
				]
			);
		} else if (response.status == 403) {
			Alert.alert(
				`${createdThesis.asset_symbol} ${createdThesis.sentiment} Rationale Limit Reached`,
				`In order to keep your investment research focused, Pelleum allows a maximum of 25 ${createdThesis.sentiment} theses per asset. To add this thesis to your ${createdThesis.asset_symbol} ${createdThesis.sentiment} library, please remove one.`,
				[
					{
						text: "Got it!",
						onPress: () => {
							/* do nothing */
						},
					},
					{
						text: "Remove now",
						onPress: async () => {
							navigation.navigate("RationaleScreen", {
								thesisToAddAfterRemoval: createdThesis,
								asset: createdThesis.asset_symbol,
								userId: createdThesis.user_id,
							});
						},
					},
				]
			);
		}
	};


	const createThesis = async () => {

		const createThesisResponse = await ThesesManager.createThesis({
			content,
			title,
			asset_symbol,
			sentiment,
			sources,
		});

		let createdThesis;

		if (createThesisResponse.status == 201) {
			createdThesis = createThesisResponse.data;
		} else if (createThesisResponse.status == 409) {
			Alert.alert(
				"You already have a thesis with this title.",
				"You cannot create multiple theses with the same title. Please update the title of this thesis.",
				[
					{
						text: "OK",
						onPress: () => {
							/* do nothing */
						},
					},
				]
			);
		} else {
			Alert.alert(
				"An unexpected error occured.",
				"We apologize for the inconvenience. Your content was not shared. Please try again later.",
				[
					{
						text: "OK",
						onPress: () => {
							/* do nothing */
						},
					},
				]
			);
		}

		if (createdThesis) {
			track("Thesis Created", {
				authorUserId: createdThesis.user_id,
				authorUsername: createdThesis.username,
				assetSymbol: createdThesis.asset_symbol,
				thesisId: createdThesis.thesis_id,
				sentiment: createdThesis.sentiment,
				sourcesQuantity: createdThesis.sources.length,
				organic: true,
			});
			handleAddRationale(createdThesis);
			const createdPost = await PostsManager.createPost({
				content: `Just wrote a thesis on #${createdThesis.asset_symbol}! ✍️`,
				thesis_id: createdThesis.thesis_id,
			});
			if (createdPost) {
				createdPost.thesis = createdThesis;
				dispatch(addPost(createdPost));
				track("Post Created", {
					authorUserId: createdPost.user_id,
					authorUsername: createdPost.username,
					assetSymbol: createdPost.asset_symbol,
					postId: createdPost.post_id,
					sentiment: createdPost.sentiment,
					postType: "feedPost",
					containsThesis: true,
					organic: false,
				});
				setContent("");
				setAssetSymbol("");
				setTitle("");
				setSources(["", "", "", "", "", ""]);
				setDisableStatus(true);
				navigation.navigate("FeedScreen");
			}
		}
	}

	const updateThesis = async (thesis) => {
		const updateThesisResponse = await ThesesManager.updateThesis({
			content,
			title,
			asset_symbol,
			sentiment,
			sources,
		}, thesis.thesis_id);

		if (updateThesisResponse.status == 200) {
			const updatedThesis = updateThesisResponse.data;
			setContent("");
			setAssetSymbol("");
			setTitle("");
			setSources(["", "", "", "", "", ""]);
			setDisableStatus(true);
			navigation.navigate("ThesisDetailScreen", updatedThesis);
		} else {
			Alert.alert(
				"An unexpected error occured.",
				"We apologize for the inconvenience. Your content was not updated. Please try again later.",
				[
					{
						text: "OK",
						onPress: () => {
							/* do nothing */
						},
					},
				]
			);
		}
	}


	const submitButtonPressed = async () => {
		// Executed when the 'Share' or 'Update' button is pressed

		// Remove empty strings from sources array
		const sources = validSources.filter((e) => e);

		if (updatingThesis) {
			await updateThesis(route.params.thesis);
		} else {
			await createThesis();
		}
		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
	};

	const handleChangeText = ({
		newValue,
		checkContent = false,
		checkSymbol = false,
		checkTitle = false,
	} = {}) => {
		const newInputValidity = inputValidity;

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

		if (checkTitle) {
			setTitle(newValue);
			if (newValue.length < 1) {
				newInputValidity["titleValidity"] = false;
				setInputValidity(newInputValidity);
			} else {
				newInputValidity["titleValidity"] = true;
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
				<AddSourcesModal
					modalVisible={modalVisible}
					makeModalDisappear={() => setModalVisible(false)}
					hackValue={hackValue}
					sources={sources}
					changeSource={handleChangeSource}
					tallySources={countSources}
				/>
				<NativeBaseProvider>
					<VStack>
						<KeyboardAvoidingView
							width={"100%"}
							behavior={"position"}
							keyboardVerticalOffset={30}
						>
							<HStack
								alignItems="center"
								justifyContent="space-between"
								my="15"
							>
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
										submitButtonPressed();
									}}
								>
									{route.params ? (
										<AppText style={styles.buttonText}>Update</AppText>
									) : (
										<AppText style={styles.buttonText}>Share</AppText>
									)}
								</TouchableOpacity>
							</HStack>
							<TextInput
								color={TEXT_COLOR}
								selectionColor={MAIN_SECONDARY_COLOR}
								placeholder="Ex: GOOGL"
								placeholderTextColor={CREATE_PLACEHOLDER_COLOR}
								autoCapitalize="characters"
								textTransform="uppercase"
								autoCorrect={false}
								maxLength={5}
								value={asset_symbol}
								onChangeText={(newValue) =>
									handleChangeText({ newValue: newValue, checkSymbol: true })
								}
								style={styles.assetSymbolInput}
							/>
							<AppText style={styles.labelText}>Ticker Symbol</AppText>
							<TextInput
								color={TEXT_COLOR}
								selectionColor={MAIN_SECONDARY_COLOR}
								placeholder="Your Thesis Title"
								placeholderTextColor={CREATE_PLACEHOLDER_COLOR}
								value={title}
								onChangeText={(newValue) =>
									handleChangeText({ newValue: newValue, checkTitle: true })
								}
								style={styles.titleInput}
								maxLength={MAXIMUM_THESIS_TITLE_CHARACTERS}
								autoCorrect={true}
							/>
							<AppText style={styles.labelText}>Thesis Title</AppText>
							<TextInput
								color={TEXT_COLOR}
								selectionColor={MAIN_SECONDARY_COLOR}
								placeholder={
									"An investment thesis is a well-thought-out rationale for a particular investment or investment strategy. In essence, why are you buying (or not buying) this asset?"
								}
								placeholderTextColor={CREATE_PLACEHOLDER_COLOR}
								multiline={true}
								numberOfLines={30}
								style={styles.textArea}
								maxLength={MAXIMUM_THESIS_CONTENT_CHARACTERS}
								value={content}
								onChangeText={(newValue) => {
									handleChangeText({ newValue: newValue, checkContent: true });
								}}
							/>
						</KeyboardAvoidingView>
						<HStack style={styles.hStack} alignItems="center">
							<View style={styles.switchSelectorContainer}>
								<SwitchSelector
									options={sentimentOptions}
									initial={sentiment == "Bull" ? 0 : 1}
									onPress={(value) => {
										if (value === sentiment) {
											//do nothing
										} else {
											setSentiment(value);
										}
									}}
									height={40}
									buttonColor={
										sentiment === "Bull"
											? BULL_SENTIMENT_BACKGROUND__COLOR
											: BEAR_SENTIMENT_BACKGROUND__COLOR
									}
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
							<TouchableOpacity
								style={styles.iconButton}
								onPress={() => setModalVisible(true)}
							>
								<MaterialIcons
									name="add-link"
									size={40}
									color={MAIN_SECONDARY_COLOR}
								/>
							</TouchableOpacity>
							<AppText style={{ color: LIGHT_GREY_COLOR, marginLeft: 20 }}>
								{validSources.length} linked sources
							</AppText>
						</HStack>
					</VStack>
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
		marginTop: 20,
		borderBottomWidth: 0.5,
		borderBottomColor: LIST_SEPARATOR_COLOR,
		height: 225,
		textAlignVertical: "top",
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
		marginLeft: 15,
	},
	switchSelectorContainer: {
		width: "40%",
		height: 45,
		alignSelf: "flex-start",
		justifyContent: "center",
	},
	hStack: {
		marginTop: 10,
	},
	assetSymbolInput: {
		backgroundColor: "transparent",
		paddingVertical: 5,
		borderBottomWidth: 0.5,
		borderBottomColor: LIST_SEPARATOR_COLOR,
		marginBottom: 5,
		width: "25%",
	},
	titleInput: {
		backgroundColor: "transparent",
		paddingVertical: 5,
		borderBottomWidth: 0.5,
		borderBottomColor: LIST_SEPARATOR_COLOR,
		marginTop: 10,
		marginBottom: 5,
		width: "100%",
	},
	labelText: {
		color: LIGHT_GREY_COLOR,
	},
	sentimentToggle: {
		opacity: 0.65,
	},
});

export default CreateThesisScreen;
