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

// local file imports
import DismissKeyboard from "../components/DismissKeyboard";
import AddSourcesModal from "../components/modals/AddSourcesModal";
import ThesesManager from "../managers/ThesesManager";
import PostsManager from "../managers/PostsManager";
import RationalesManager from "../managers/RationalesManager";
import AppText from "../components/AppText";
import { useDispatch } from "react-redux";
import { addPost } from "../redux/actions/PostActions";
import * as Haptics from 'expo-haptics';
import {
	TEXT_COLOR,
	CREATE_PLACEHOLDER_COLOR,
	MAIN_DIFFERENTIATOR_COLOR,
	LIGHT_GREY_COLOR,
	MAIN_SECONDARY_COLOR,
	BAD_COLOR,
	GOOD_COLOR,
} from "../styles/Colors";

const CreateThesisScreen = ({ navigation }) => {
	// Universal State
	const dispatch = useDispatch();

	// Local State
	const [content, setContent] = useState("");
	const [asset_symbol, setAssetSymbol] = useState("");
	const [title, setTitle] = useState("");
	const [sentiment, setSentiment] = useState("Bull");
	const [source1, setSource1] = useState("");
	const [source2, setSource2] = useState("");
	const [source3, setSource3] = useState("");
	const [inputValidity, setInputValidity] = useState({
		assetSymbolValidity: false,
		contentValidity: false,
		titleValidity: false,
	});
	const [disableStatus, setDisableStatus] = useState(true);
	const [modalVisible, setModalVisible] = useState(false);
	const [sourceInputValidity, setSourceInputValidity] = useState({
		source1: false,
		source2: false,
		source3: false,
	});
	const [validSources, setValidSources] = useState([]);

	const sentimentOptions = [
		{ label: "Bull", value: "Bull" },
		{ label: "Bear", value: "Bear" },
	];

	const countSources = (sources) => {
		// Executed when user exits the AddSourcesModal
		let newValidSources = [];

		sources.forEach((source, i) => {
			let sourceNumber = i + 1;
			if (source && sourceInputValidity[`source${sourceNumber}`]) {
				newValidSources.push(source);
			}
		});
		setValidSources(newValidSources);
	};

	const handleChangeSourceInputValidity = (newSourceInputValidity) => {
		// Executed when a source's validity is changed
		setSourceInputValidity(newSourceInputValidity);
	};

	const handleChangeSource = (newValue, sourceNumber) => {
		// Executed when a source is changed in the (child) Modal
		switch (sourceNumber) {
			case 1:
			case "source1": // This is called a "fall-through" case
				setSource1(newValue);
				break;
			case 2:
			case "source2":
				setSource2(newValue);
				break;
			case 3:
			case "source3":
				setSource3(newValue);
				break;
		}
	};

	const hasUnsavedChanges = (
		Boolean(content) ||
		Boolean(asset_symbol) ||
		Boolean(title) ||
		Boolean(source1) ||
		Boolean(source2) ||
		Boolean(source3)
		);

	// Alert user they have unsaved changes
	// https://reactnavigation.org/docs/preventing-going-back/
	React.useEffect(
		() =>
			navigation.addListener('beforeRemove', (e) => {
				if (!hasUnsavedChanges) {
					// If we don't have unsaved changes, then we don't need to do anything
					return;
				}

				// Prevent default behavior of leaving the screen
				e.preventDefault();

				// Prompt the user before leaving the screen
				Alert.alert(
					'Discard changes?',
					'You have unsaved changes. Are you sure to discard them and leave the screen?',
					[
						{ text: "Don't leave", style: 'cancel', onPress: () => { } },
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
	
	const handleAddRationale = async (createdThesis) => {
		const response = await RationalesManager.addRationale(createdThesis);
		if (response.status == 201) {
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
							navigation.navigate("Rationales", {
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

	const shareButtonPressed = async () => {
		// Executed when the 'share' button is pressed

		const sources = validSources;

		const createdThesis = await ThesesManager.createThesis({
			content,
			title,
			asset_symbol,
			sentiment,
			sources,
		});

		if (createdThesis) {
			handleAddRationale(createdThesis);
			const createdPost = await PostsManager.createPost({
				content: `Just wrote a thesis on #${createdThesis.asset_symbol}! ✍️`,
				thesis_id: createdThesis.thesis_id,
			});
			if (createdPost) {
				createdPost.thesis = createdThesis;
				dispatch(addPost(createdPost));
				setContent("");
				setAssetSymbol("");
				setDisableStatus(true);
				Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
				navigation.navigate("Feed");
			}
		}
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
					source1={source1}
					source2={source2}
					source3={source3}
					changeSource={handleChangeSource}
					sourceInputValidity={sourceInputValidity}
					changeValidity={handleChangeSourceInputValidity}
					tallySources={() => countSources([source1, source2, source3])}
				/>
				<NativeBaseProvider>
					<VStack>
						<KeyboardAvoidingView width={"100%"} behavior={"position"} keyboardVerticalOffset={30}>
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
							<AppText>Ticker Symbol</AppText>
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
								maxLength={256}
								autoCorrect={true}
							/>
							<AppText>Thesis Title</AppText>
							<TextInput
								color={TEXT_COLOR}
								selectionColor={MAIN_SECONDARY_COLOR}
								placeholder={"An investment thesis is a well-thought-out rationale for a particular investment or investment strategy. Share your detailed reasoning for your investments here."}
								placeholderTextColor={CREATE_PLACEHOLDER_COLOR}
								multiline={true}
								numberOfLines={30}
								style={styles.textArea}
								maxLength={30000}
								value={content}
								onChangeText={(newValue) =>
									handleChangeText({ newValue: newValue, checkContent: true })
								}
							/>
						</KeyboardAvoidingView>
						<HStack style={styles.hStack} alignItems="center">
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
							<AppText style={{ marginLeft: 20 }}>
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
		marginTop: 10,
		borderBottomWidth: 0.5,
		borderBottomColor: LIGHT_GREY_COLOR,
		height: 225,
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
	},
	hStack: {
		marginTop: 10,
	},
	assetSymbolInput: {
		backgroundColor: "transparent",
		paddingVertical: 5,
		borderBottomWidth: 0.5,
		borderBottomColor: LIGHT_GREY_COLOR,
		marginBottom: 5,
		width: "25%",
	},
	titleInput: {
		backgroundColor: "transparent",
		paddingVertical: 5,
		borderBottomWidth: 0.5,
		borderBottomColor: LIGHT_GREY_COLOR,
		marginTop: 10,
		marginBottom: 5,
		width: "100%",
	},
});

export default CreateThesisScreen;
