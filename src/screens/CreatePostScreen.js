import React, { useState } from "react";
import {
	StyleSheet,
	TextInput,
	Image,
	TouchableOpacity,
	View,
} from "react-native";
import { HStack, VStack, NativeBaseProvider } from "native-base";
import SwitchSelector from "react-native-switch-selector";
import PostsManager from "../managers/PostsManager";
import DismissKeyboard from "../components/DismissKeyboard";
import AppText from "../components/AppText";
import { LIGHT_GREY_COLOR, MAIN_DIFFERENTIATOR_COLOR, MAIN_SECONDARY_COLOR, TEXT_COLOR } from "../styles/Colors";

const CreatePostScreen = ({ navigation }) => {
	const [content, setContent] = useState("");
	const [asset_symbol, setAssetSymbol] = useState("");
	const [sentiment, setSentiment] = useState("Bull");
	const [error, setError] = useState(null); // Migrate this to reusable, universally accessable state
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
			setContent("");
			setAssetSymbol("");
			setDisableStatus(true);
			navigation.navigate("Feed", { newPost: createdPost });
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
			<View style={styles.mainContainer}>
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
								<AppText style={styles.buttonText}>Share</AppText>
							</TouchableOpacity>
						</HStack>
						<TextInput
							color={TEXT_COLOR}
							placeholder="Ex: GOOGL"
							placeholderTextColor={LIGHT_GREY_COLOR}
							autoCapitalize="characters"
							autoCorrect={false}
							maxLength={5}
							value={asset_symbol}
							onChangeText={(newValue) =>
								handleChangeText({ newValue: newValue, checkSymbol: true })
							}
							style={styles.assetSymbolInput}
						/>
						<AppText>Asset Symbol</AppText>
						<TextInput
							color={TEXT_COLOR}
							placeholder="What's your valuable insight?"
							placeholderTextColor={LIGHT_GREY_COLOR}
							multiline={true}
							numberOfLines={20}
							style={styles.textArea}
							maxLength={512}
							value={content}
							onChangeText={(newValue) =>
								handleChangeText({ newValue: newValue, checkContent: true })
							}
						/>

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
								buttonColor={sentiment == "Bull" ? "#46B84B" : "#E24343"}
								backgroundColor={MAIN_DIFFERENTIATOR_COLOR}
								borderColor={MAIN_DIFFERENTIATOR_COLOR}
								selectedColor={"white"}
								textColor={sentiment == "Bull" ? "#E24343" : "#46B84B"}
								bold={true}
								fontSize={16}
								hasPadding
							/>
						</View>
						{error ? <AppText style={styles.errorText}>{error}</AppText> : null}
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
		height: 250,
		marginTop: 20,
		borderBottomWidth: 0.5,
		borderBottomColor: MAIN_SECONDARY_COLOR,
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
		marginTop: 5,
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
		borderBottomColor: MAIN_SECONDARY_COLOR,
		marginBottom: 5,
		marginTop: 10,
		width: "25%",
	},
});

export default CreatePostScreen;
