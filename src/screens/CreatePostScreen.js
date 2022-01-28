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
import { MaterialIcons } from "@expo/vector-icons";
import AppText from "../components/AppText";
import { TEXT_COLOR } from "../styles/ComponentStyles";

const CreatePostScreen = ({ navigation }) => {
	const [content, setContent] = useState("");
	const [asset_symbol, setAssetSymbol] = useState("");
	const [sentiment, setSentiment] = useState("Bull");
	const [error, setError] = useState(null);     // Migrate this to reusable, universally accessable state
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
		const createdPost = await PostsManager.createPost({ content, asset_symbol, sentiment });
		if (createdPost) {
			setContent("");
			setAssetSymbol("");
			setDisableStatus(true);
			navigation.navigate("Feed", {newPost: createdPost});
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
						<HStack
							alignItems="center"
							justifyContent="space-between"
							marginBottom="15"
						>
							<AppText>Asset Symbol:</AppText>
							<TextInput
								color = {TEXT_COLOR}
								placeholder="Ex: GOOGL"
								placeholderTextColor={TEXT_COLOR}
								autoCapitalize="characters"
								autoCorrect={false}
								maxLength={5}
								value={asset_symbol}
								onChangeText={(newValue) =>
									handleChangeText({ newValue: newValue, checkSymbol: true })
								}
								style={styles.assetSymbolInput}
							/>
						</HStack>
						<TextInput
							color={TEXT_COLOR}
							placeholder="What's your valuable insight?"
							placeholderTextColor={TEXT_COLOR}
							multiline={true}
							numberOfLines={20}
							style={styles.textArea}
							maxLength={512}
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
								onPress={() => {
									console.log(
										"This worked. Maybe remove this button from posts (or add sources capability on backend)."
									);
								}}
							>
								<MaterialIcons name="add-link" size={40} color="#00A8FC" />
							</TouchableOpacity>
						</HStack>
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
		borderBottomWidth: 0.5,
		borderBottomColor: "#00A8FC",
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
		paddingHorizontal: 15,
		paddingVertical: 10,
		borderRadius: 10,
		marginTop: 5,
	},
});

export default CreatePostScreen;
