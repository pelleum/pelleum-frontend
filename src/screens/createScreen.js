import React, { useState } from "react";
import {
	Text,
	StyleSheet,
	TextInput,
	Image,
	TouchableOpacity,
	Keyboard,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { HStack, VStack, NativeBaseProvider } from "native-base";
import DismissKeyboard from "../components/DismissKeyboard";

const CreatePostScreen = () => {
	const [post, setPost] = useState("");

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
								style={styles.button}
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
		height: 200,
		marginHorizontal: 15,
		borderBottomWidth: 0.5,
		borderBottomColor: "#0782F9"
	},
	image: {
		width: 44,
		height: 44,
		borderRadius: 44 / 2,
		margin: 15,
	},
	button: {
		backgroundColor: "#0782F9",
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
});

export default CreatePostScreen;
