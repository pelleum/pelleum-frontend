import React from "react";
import {
	Modal,
	StyleSheet,
	View,
	TextInput,
	KeyboardAvoidingView,
	Platform,
	TouchableOpacity,
} from "react-native";
import { HStack, NativeBaseProvider } from "native-base";
import { FontAwesome5 } from "@expo/vector-icons";
import {
	TEXT_COLOR,
	MAIN_DIFFERENTIATOR_COLOR,
	LIGHT_GREY_COLOR,
	MAIN_SECONDARY_COLOR,
	GOOD_COLOR,
} from "../../styles/Colors";
import AppText from "../AppText";

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
				makeModalDisappear();
			}}
		>
			<NativeBaseProvider>
				<TouchableOpacity
					style={styles.modalContainer}
					onPress={() => {
						// 1. Change non-valid sources to: ""
						Object.entries(sourceInputValidity).forEach(([key, value]) => {
							if (value == false) {
								changeSource("", key);
							}
						});
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
						<TouchableOpacity onPress={() => { }} activeOpacity={1}>
							<View style={styles.modalView}>
								<AppText style={styles.ModalTitle}>
									Add sources to substantiate your investment thesis!🎉
								</AppText>
								<AppText style={styles.descriptionText}>
									Sources are a great way to share some of the information that
									led to your current thinking on investments.
								</AppText>
								<HStack alignItems="center" justifyContent="space-between">
									<TextInput
										color={TEXT_COLOR}
										selectionColor={MAIN_SECONDARY_COLOR}
										placeholder="https://www.examplesource1.com"
										placeholderTextColor={LIGHT_GREY_COLOR}
										value={source1}
										onChangeText={(newValue) => handleChangeText(newValue, 1)}
										style={styles.sourceInput}
										maxLength={256}
										keyboardType={Platform.OS === "ios" ? "url" : "default"}
										autoCapitalize={"none"}
										autoCorrect={false}
									/>
									<FontAwesome5
										name="check"
										size={24}
										color={
											sourceInputValidity["source1"] ? GOOD_COLOR : "transparent"
										}
									/>
								</HStack>
								<HStack alignItems="center" justifyContent="space-between">
									<TextInput
										color={TEXT_COLOR}
										selectionColor={MAIN_SECONDARY_COLOR}
										placeholder="https://www.examplesource2.com"
										placeholderTextColor={LIGHT_GREY_COLOR}
										value={source2}
										onChangeText={(newValue) => handleChangeText(newValue, 2)}
										style={styles.sourceInput}
										maxLength={256}
										keyboardType={Platform.OS === "ios" ? "url" : "default"}
										autoCapitalize={"none"}
										autoCorrect={false}
									/>
									<FontAwesome5
										name="check"
										size={24}
										color={
											sourceInputValidity["source2"] ? GOOD_COLOR : "transparent"
										}
									/>
								</HStack>
								<HStack alignItems="center" justifyContent="space-between">
									<TextInput
										color={TEXT_COLOR}
										selectionColor={MAIN_SECONDARY_COLOR}
										placeholder="https://www.examplesource3.com"
										placeholderTextColor={LIGHT_GREY_COLOR}
										value={source3}
										onChangeText={(newValue) => handleChangeText(newValue, 3)}
										style={styles.sourceInput}
										maxLength={256}
										keyboardType={Platform.OS === "ios" ? "url" : "default"}
										autoCapitalize={"none"}
										autoCorrect={false}
									/>
									<FontAwesome5
										name="check"
										size={24}
										color={
											sourceInputValidity["source3"] ? GOOD_COLOR : "transparent"
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
	descriptionText: {
		marginBottom: 20,
	},
	modalView: {
		margin: 20,
		backgroundColor: MAIN_DIFFERENTIATOR_COLOR,
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
	ModalTitle: {
		fontSize: 20,
		textAlign: "center",
		fontWeight: "bold",
		marginBottom: 15,
	},
	sourceInput: {
		backgroundColor: "transparent",
		paddingVertical: 5,
		borderBottomWidth: 0.3,
		borderBottomColor: MAIN_SECONDARY_COLOR,
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
