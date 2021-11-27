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
import SwitchSelector from "react-native-switch-selector";
import PelleumPublic from "../api/PelleumPublic";

// local file imports
import DismissKeyboard from "../components/DismissKeyboard";
import { MaterialIcons } from "@expo/vector-icons";
import colorScheme from "../components/ColorScheme";

const CreateScreen = ({ navigation }) => {
	const [content, setContent] = useState("");
    const [asset_symbol, setAssetSymbol] = useState("");
    const [sentiment, setSentiment] = useState("Bull");
    const [error, setError] = useState(null);
	const [contentType, setContentType] = useState("post");
    const [inputValidity, setInputValidity] = useState({assetSymbol: false, content: false})
    const [disableStatus, setDisableStatus] = useState(true);


	const contentTypeOptions = [
		{ label: "Post", value: "post" },
		{ label: "Thesis", value: "thesis" },
	];

    const sentimentOptions= [
		{ label: "Bull", value: "Bull" },
		{ label: "Bear", value: "Bear" },
	];

	const shareContent = async ({ content, likedAsset = null } = {}) => {
		let response;

		if (contentType == "post") {
			try {
				response = await PelleumPublic.post("/public/posts", { content, asset_symbol, sentiment });
			} catch (err) {
				console.log(err);
			}
		} else {
			try {
				response = await PelleumPublic.get("/public/theses", { content });
			} catch (err) {
				console.log(err);
			}
		}
        return response
	};


    const shareButtonPressed = async () => {
        var response = await shareContent({content: content});
        if (response.status == 201) {
            setContent("");
            setAssetSymbol("");
            navigation.navigate("Feed");
        } else {
            setError("An unexpected error occured. Your content was not shared.")
        }
    }


    const handleChangeText = ({
        newValue,
        content = false,
        symbol = false,
    } = {}) => {

        setError(null);
        var newInputValidity = inputValidity;

        if (content) {
            setContent(newValue);
            if (newValue.length < 1) {
                newInputValidity["content"] = false
                setInputValidity(newInputValidity)
            } else {
                newInputValidity["content"] = true
                setInputValidity(newInputValidity)
            }
        }

        if (symbol) {
            setAssetSymbol(newValue);
            if (newValue.length < 1) {
                newInputValidity["assetSymbol"] = false
                setInputValidity(newInputValidity)
            } else {
                newInputValidity["assetSymbol"] = true
                setInputValidity(newInputValidity)
            }
        }

        if (Object.values(inputValidity).every((item) => item === true)) {
			setDisableStatus(false);
		} else {
			setDisableStatus(true);
		}
    }

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
                                style={disableStatus ? styles.shareButtonDisabled : styles.shareButtonEnabled}
						        disabled={disableStatus}
								onPress={() => {shareButtonPressed()}}
							>
								<Text style={styles.buttonText}>Share</Text>
							</TouchableOpacity>
						</HStack>
                        <HStack alignItems="center" justifyContent="space-between" marginBottom="15">
                            <Text>Asset Symbol:</Text>
                            <TextInput
                                placeholder="EXAMPLE"
                                placeholderTextColor="#c7c7c7"
                                value={asset_symbol}
                                onChangeText={(newValue) => handleChangeText({newValue: newValue, symbol: true})}
                                style={styles.assetSymbolInput}
                                maxLength={10}
                                autoCapitalize="characters"
                                autoCorrect={true}
                            />
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
                        </HStack>
						<TextInput
							placeholder="What's your valuable insight?"
							multiline={true}
							numberOfLines={contentType == "post" ? 20 : 30}
							style={styles.textArea}
                            maxLength={contentType == "post" ? 512 : 15000}
							value={content}
							onChangeText={(newValue) => handleChangeText({newValue: newValue, content: true})}
						/>
						<HStack style={styles.hStack} alignItems="center">
							<View style={styles.switchSelectorContainer}>
								<SwitchSelector
									options={contentTypeOptions}
									initial={0}
									onPress={(value) => setContentType(value)}
									height={40}
									buttonColor={"#00A8FC"}
									selectedColor={"white"}
									textColor={"#00A8FC"}
									fontSize={16}
									hasPadding
								/>
							</View>
							<TouchableOpacity
								style={styles.iconButton}
								onPress={() => {
									console.log("This button worked.");
									console.log(colorScheme);
								}}
							>
								<MaterialIcons name="add-link" size={40} color="#00A8FC" />
							</TouchableOpacity>
						</HStack>
                        { error ? <Text style={styles.errorText}>{error}</Text> : null }
					</VStack>
				</NativeBaseProvider>
			</View>
		</DismissKeyboard>
	);
};

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
        marginHorizontal: 15
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
        color: "red"
    },
    assetSymbolInput: {
		backgroundColor: "white",
		paddingHorizontal: 15,
		paddingVertical: 10,
		borderRadius: 10,
		marginTop: 5,
	},
});

export default CreateScreen;
