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


// local file imports
import DismissKeyboard from "../components/DismissKeyboard";
import { MaterialIcons } from '@expo/vector-icons';
import colorScheme from "../components/ColorScheme";

const CreatePostScreen = () => {
	const [post, setPost] = useState("");
	const options = [
		{ label: "Post", value: "post" },
		{ label: "Thesis", value: "thesis" },
	];

    

	return (
		<DismissKeyboard>
			<View style={styles.mainContainer}>
				<NativeBaseProvider>
					<VStack>
						<HStack alignItems="center" justifyContent="space-between">
							<Image
								style={styles.image}
								source={require("../../assets/forest.jpg")}
							/>
							<TouchableOpacity
								style={styles.shareButton}
								onPress={() => {
									console.log("This button worked.");
								}}
							>
								<Text style={styles.buttonText}>Share</Text>
							</TouchableOpacity>
						</HStack>
						<TextInput
							placeholder="What's your valuable insight?"
							multiline={true}
							numberOfLines={20}
							style={styles.textArea}
							value={post}
							onChangeText={(newValue) => setPost(newValue)}
						/>
						<HStack style={styles.hStack} alignItems="center">
							<View style={styles.switchSelectorContainer}>
								<SwitchSelector
									options={options}
									initial={0}
									onPress={(value) => console.log({ value })}
									height={40}
									buttonColor={"#00A8FC"}
									borderColor={"#00A8FC"}
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
                                    console.log(colorScheme)
								}}
							>
                                <MaterialIcons name="add-link" size={40} color="#00A8FC" />
							</TouchableOpacity>
						</HStack>
					</VStack>
				</NativeBaseProvider>
			</View>
		</DismissKeyboard>
	);
};

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
	},
	textArea: {
		height: 250,
		marginHorizontal: 15,
		borderBottomWidth: 0.5,
		borderBottomColor: "#00A8FC",
	},
	image: {
		width: 44,
		height: 44,
		borderRadius: 44 / 2,
		margin: 15,
	},
	shareButton: {
		backgroundColor: "#00A8FC",
		borderRadius: 30,
		height: 35,
		width: 80,
		margin: 15,
		justifyContent: "center",
		alignItems: "center",
	},
	buttonText: {
		color: "white",
	},
    iconButton: {
        marginLeft: 5
    },
	switchSelectorContainer: {
		width: "30%",
		height: 45,
		alignSelf: "flex-start",
		justifyContent: "center",
		marginLeft: 15,
	},
    hStack: {
        marginTop: 5,
    }
});

export default CreatePostScreen;
