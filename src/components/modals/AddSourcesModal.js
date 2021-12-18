import React from "react";
import {
	Alert,
	Modal,
	StyleSheet,
	Text,
	View,
	TextInput,
	KeyboardAvoidingView,
	Platform,
	TouchableOpacity,
} from "react-native";
import { HStack, NativeBaseProvider } from "native-base";
import { FontAwesome5 } from "@expo/vector-icons";

const AddSourcesModal = ({
	modalVisible,
	makeModalDisappear,
	source1,
	source2,
	source3,
	changeSource,
	tallySources,
	sourceInputValidity,
	changeValidity,
}) => {
	validateWebsiteUrl = (websiteUrl) => {
		const urlRegex =
			/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
		return urlRegex.test(websiteUrl);
	};

	const handleChangeText = (newValue, sourceNumber) => {
		let newSourceInputValidity = sourceInputValidity;

		changeSource(newValue, sourceNumber);

		if (newValue.length < 1) {
			newSourceInputValidity[`source${sourceNumber}`] = false;
			changeValidity(newSourceInputValidity);
		} else {
			if (!validateWebsiteUrl(newValue)) {
				newSourceInputValidity[`source${sourceNumber}`] = false;
				changeValidity(newSourceInputValidity);
			} else {
				newSourceInputValidity[`source${sourceNumber}`] = true;
				changeValidity(newSourceInputValidity);
			}
		}
	};

	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={modalVisible}
			onRequestClose={() => {
				Alert.alert("Modal has been closed.");
				makeModalDisappear();
			}}
		>
			<NativeBaseProvider>
				<TouchableOpacity
					style={styles.modalContainer}
					onPress={() => {
						// 1. Change non-valid sources to: ""
						Object.entries(sourceInputValidity).forEach(
							([key, value]) => {
								if (value == false) {
									changeSource("", key);
								}
							}
						);
						// 2. Tally up valid sources
						tallySources();
						// 3. Make Modal Disapper
						makeModalDisappear();
					}}
				>
					<KeyboardAvoidingView
						behavior={"padding"}
						style={styles.centeredView}
					>
						<TouchableOpacity
							onPress={() => {}}
							activeOpacity={1}
						>
							<View style={styles.modalView}>
								<Text style={styles.ModalTitle}>
									Add sources to substantiate your investment thesis!
								</Text>
								<Text>
									Sources are a great way to share some of the information that
									led to your current thinking on investments.
								</Text>
								<HStack alignItems="center" justifyContent="space-between">
									<TextInput
										placeholder="https://www.examplesource1.com"
										placeholderTextColor="#c7c7c7"
										value={source1}
										onChangeText={(newValue) => handleChangeText(newValue, 1)}
										style={styles.titleInput}
										maxLength={256}
										keyboardType={Platform.OS === "ios" ? "url" : "default"}
										autoCapitalize={"none"}
										autoCorrect={false}
									/>
									<FontAwesome5
										name="check"
										size={24}
										color={
											sourceInputValidity["source1"] ? "green" : "transparent"
										}
									/>
								</HStack>
								<HStack alignItems="center" justifyContent="space-between">
									<TextInput
										placeholder="https://www.examplesource2.com"
										placeholderTextColor="#c7c7c7"
										value={source2}
										onChangeText={(newValue) => handleChangeText(newValue, 2)}
										style={styles.titleInput}
										maxLength={256}
										keyboardType={Platform.OS === "ios" ? "url" : "default"}
										autoCapitalize={"none"}
										autoCorrect={false}
									/>
									<FontAwesome5
										name="check"
										size={24}
										color={
											sourceInputValidity["source2"] ? "green" : "transparent"
										}
									/>
								</HStack>
								<HStack alignItems="center" justifyContent="space-between">
									<TextInput
										placeholder="https://www.examplesource3.com"
										placeholderTextColor="#c7c7c7"
										value={source3}
										onChangeText={(newValue) => handleChangeText(newValue, 3)}
										style={styles.titleInput}
										maxLength={256}
										keyboardType={Platform.OS === "ios" ? "url" : "default"}
										autoCapitalize={"none"}
										autoCorrect={false}
									/>
									<FontAwesome5
										name="check"
										size={24}
										color={
											sourceInputValidity["source3"] ? "green" : "transparent"
										}
									/>
								</HStack>
							</View>
						</TouchableOpacity>
					</KeyboardAvoidingView>
				</TouchableOpacity>
			</NativeBaseProvider>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	centeredView: {
		marginTop: 22,
		flex: 1,
		flexDirection: "column",
		justifyContent: "flex-end",
	},
	modalView: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 20,
		padding: 35,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	addButtonEnabled: {
		backgroundColor: "#00A8FC",
		borderRadius: 30,
		padding: 10,
		marginTop: 15,
		width: "50%",
		elevation: 2,
	},
	addButtonDisabled: {
		backgroundColor: "#00A8FC",
		borderRadius: 30,
		padding: 10,
		marginTop: 15,
		width: "50%",
		elevation: 2,
		opacity: 0.33,
	},
	textStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
		fontSize: 20,
	},
	ModalTitle: {
		fontSize: 20,
		textAlign: "center",
		fontWeight: "bold",
		marginBottom: 15,
	},
	titleInput: {
		backgroundColor: "transparent",
		paddingVertical: 5,
		borderBottomWidth: 0.5,
		borderBottomColor: "#00A8FC",
		marginTop: 10,
		marginHorizontal: 10,
		marginBottom: 5,
		width: "100%",
	},
	checkMarkHidden: {
		opacity: 0,
	},
});

export default AddSourcesModal;
