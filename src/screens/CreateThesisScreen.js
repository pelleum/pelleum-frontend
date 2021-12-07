// installed libraries
import React, { useState } from "react";
import {
	Text,
	StyleSheet,
	TextInput,
	Image,
	TouchableOpacity,
	View,
	Keyboard,
	TouchableWithoutFeedback,
	Platform,
	Dimensions,
} from "react-native";
import { HStack, VStack, NativeBaseProvider } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import SwitchSelector from "react-native-switch-selector";

// local file imports
import DismissKeyboard from "../components/DismissKeyboard";
import PelleumPublic from "../api/PelleumPublic";
import AddSourcesModal from "../components/modals/AddSourcesModal";

const CreateThesisScreen = ({ navigation }) => {
	const [content, setContent] = useState("");
	const [asset_symbol, setAssetSymbol] = useState("");
	const [title, setTitle] = useState("");
	const [sentiment, setSentiment] = useState("Bull");
	const [error, setError] = useState(null);
	const [inputValidity, setInputValidity] = useState({
		assetSymbol: false,
		content: false,
		title: false,
	});
	const [disableStatus, setDisableStatus] = useState(true);
	const [modalVisible, setModalVisible] = useState(false);

	const sentimentOptions = [
		{ label: "Bull", value: "Bull" },
		{ label: "Bear", value: "Bear" },
	];

	const shareContent = async ({ content, likedAsset = null } = {}) => {
		let response;
		try {
			response = await PelleumPublic.get("/public/theses", { content });
		} catch (err) {
			console.log(err);
		}
		return response;
	};

	const handleModalNavigate = (screenToNavigateTo) => {
		navigation.navigate(screenToNavigateTo);
	};

	const shareButtonPressed = async () => {
		var response = await shareContent({ content: content });
		if (response.status == 201) {
			setContent("");
			setAssetSymbol("");
			setDisableStatus(true);
			navigation.navigate("Feed");
		} else {
			setError("An unexpected error occured. Your content was not shared.");
		}
	};

	const handleChangeText = ({
		newValue,
		content = false,
		symbol = false,
		title = false,
	} = {}) => {
		setError(null);
		var newInputValidity = inputValidity;

		if (content) {
			setContent(newValue);
			if (newValue.length < 1) {
				newInputValidity["content"] = false;
				setInputValidity(newInputValidity);
			} else {
				newInputValidity["content"] = true;
				setInputValidity(newInputValidity);
			}
		}

		if (symbol) {
			setAssetSymbol(newValue);
			if (newValue.length < 1) {
				newInputValidity["assetSymbol"] = false;
				setInputValidity(newInputValidity);
			} else {
				newInputValidity["assetSymbol"] = true;
				setInputValidity(newInputValidity);
			}
		}

		if (title) {
			setTitle(newValue);
			if (newValue.length < 1) {
				newInputValidity["title"] = false;
				setInputValidity(newInputValidity);
			} else {
				newInputValidity["title"] = true;
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
			<View
				//behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={styles.mainContainer}
			>
				<AddSourcesModal
					modalVisible={modalVisible}
					makeModalDisappear={() => setModalVisible(false)}
					onNavigate={handleModalNavigate}
				/>
				<NativeBaseProvider>
					<VStack>
						<HStack alignItems="center" justifyContent="space-between" my="15">
							<Image
								style={styles.image}
								source={require("../../assets/forest.jpg")}
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
								<Text style={styles.buttonText}>Share</Text>
							</TouchableOpacity>
						</HStack>
						<TextInput
							placeholder="EXAMPLE"
							placeholderTextColor="#c7c7c7"
							value={asset_symbol}
							onChangeText={(newValue) =>
								handleChangeText({ newValue: newValue, symbol: true })
							}
							style={styles.assetSymbolInput}
							maxLength={10}
							autoCapitalize="characters"
							autoCorrect={true}
						/>
						<Text>Asset Symbol</Text>
						<TextInput
							placeholder="My Thesis"
							placeholderTextColor="#c7c7c7"
							value={title}
							onChangeText={(newValue) =>
								handleChangeText({ newValue: newValue, title: true })
							}
							style={styles.titleInput}
							maxLength={256}
							autoCorrect={true}
						/>
						<Text>Thesis Title</Text>
						<TextInput
							placeholder="An investment thesis is a well-thought-out rationale for a particular investment or investment strategy. Share your detailed reasoning for your investments here."
							multiline={true}
							numberOfLines={30}
							style={styles.textArea}
							maxLength={30000}
							value={content}
							onChangeText={(newValue) =>
								handleChangeText({ newValue: newValue, content: true })
							}
						/>
						<HStack style={styles.hStack} alignItems="center">
							<View style={styles.switchSelectorContainer}>
								<SwitchSelector
									options={sentimentOptions}
									initial={0}
									onPress={(value) => setSentiment(value)}
									height={40}
									buttonColor={sentiment == "Bull" ? "#46B84B" : "#E24343"}
									selectedColor={"white"}
									textColor={sentiment == "Bull" ? "#E24343" : "#46B84B"}
									bold={true}
									fontSize={16}
									hasPadding
								/>
							</View>
							<TouchableOpacity
								style={styles.iconButton}
								onPress={() => setModalVisible(true)}
							>
								<MaterialIcons name="add-link" size={40} color="#00A8FC" />
							</TouchableOpacity>
						</HStack>
						{error ? <Text style={styles.errorText}>{error}</Text> : null}
					</VStack>
				</NativeBaseProvider>
			</View>
		</DismissKeyboard>
	);
};

const styles = StyleSheet.create({
	// keyBoardAvoidingContainer: {
	// 	flex: 1,
	// },
	mainContainer: {
		flex: 1,
		marginHorizontal: 15,
	},
	textArea: {
		// flexDirection: "column",
		// flex: 1,
		marginTop: 10,
		borderBottomWidth: 0.5,
		borderBottomColor: "#00A8FC",
		height: 250
	},
	image: {
		width: 44,
		height: 44,
		borderRadius: 44 / 2,
	},
	shareButtonEnabled: {
		backgroundColor: "#00A8FC",
		borderRadius: 30,
		height: 35,
		width: 80,
		justifyContent: "center",
		alignItems: "center",
	},
	shareButtonDisabled: {
		backgroundColor: "#00A8FC",
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
		//marginLeft: 15,
	},
	hStack: {
		marginTop: 5,
	},
	errorText: {
		color: "red",
	},
	assetSymbolInput: {
		backgroundColor: "transparent",
		paddingVertical: 5,
		borderBottomWidth: 0.5,
		borderBottomColor: "#00A8FC",
		width: "25%",
	},
	titleInput: {
		backgroundColor: "transparent",
		paddingVertical: 5,
		borderBottomWidth: 0.5,
		borderBottomColor: "#00A8FC",
		marginTop: 10,
		marginBottom: 5,
		width: "100%",
	},
});

export default CreateThesisScreen;
