// installed libraries
import React, { useState } from "react";
import {
	Text,
	StyleSheet,
	TextInput,
	Image,
	TouchableOpacity,
	View,
} from "react-native";
import { HStack, VStack, NativeBaseProvider } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import SwitchSelector from "react-native-switch-selector";

// local file imports
import DismissKeyboard from "../components/DismissKeyboard";
import AddSourcesModal from "../components/modals/AddSourcesModal";
import ThesesManager from "../managers/ThesesManager";
import PostsManager from "../managers/PostsManager";

const CreateThesisScreen = ({ navigation }) => {
	const [content, setContent] = useState("");
	const [asset_symbol, setAssetSymbol] = useState("");
	const [title, setTitle] = useState("");
	const [sentiment, setSentiment] = useState("Bull");
	const [source1, setSource1] = useState("");
	const [source2, setSource2] = useState("");
	const [source3, setSource3] = useState("");
	const [error, setError] = useState(null);    // Migrate to Redux
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
			const createdPost = await PostsManager.createPost({
				content: `Just wrote a thesis on ${createdThesis.asset_symbol}!`,
				thesis_id: createdThesis.thesis_id
			});
			if (createdPost) {
				setContent("");
				setAssetSymbol("");
				setDisableStatus(true);
				navigation.navigate("Feed", {newPost: createdPost, newThesis: createdThesis});
			}
		}		
	};

	const handleChangeText = ({
		newValue,
		checkContent = false,
		checkSymbol = false,
		checkTitle = false,
	} = {}) => {
		// Executed asset symbol, thesis title, or content's text is changed
		setError(null);
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
			<View style={styles.mainContainer}>
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
							placeholder="Ex: GOOGL"
							placeholderTextColor="#c7c7c7"
							autoCapitalize="characters"
							autoCorrect={false}
							maxLength={5}
							value={asset_symbol}
							onChangeText={(newValue) =>
								handleChangeText({ newValue: newValue, checkSymbol: true })
							}
							style={styles.assetSymbolInput}
						/>
						<Text>Asset Symbol</Text>
						<TextInput
							placeholder="Your Thesis Title"
							placeholderTextColor="#c7c7c7"
							value={title}
							onChangeText={(newValue) =>
								handleChangeText({ newValue: newValue, checkTitle: true })
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
								handleChangeText({ newValue: newValue, checkContent: true })
							}
						/>
						<HStack style={styles.hStack} alignItems="center">
							<View style={styles.switchSelectorContainer}>
								<SwitchSelector
									options={sentimentOptions}
									initial={0}
									onPress={(value) => {
										if (value === sentiment) {
											//do nothing
										} else {
											setSentiment(value)
										}
									}}
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
							<Text style={{ marginLeft: 20 }}>
								{validSources.length} linked sources
							</Text>
						</HStack>
						{error ? <Text style={styles.errorText}>{error}</Text> : null}
					</VStack>
				</NativeBaseProvider>
			</View>
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
		borderBottomColor: "#00A8FC",
		height: 250,
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
		marginBottom: 5,
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
