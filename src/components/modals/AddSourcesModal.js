import React, { useState } from "react";
import {
	Alert,
	Modal,
	StyleSheet,
	Text,
	Pressable,
	View,
	TextInput,
} from "react-native";
import { Feather } from "@expo/vector-icons";

const AddSourcesModal = ({ modalVisible, makeModalDisappear, onNavigate }) => {
	const [urls, setUrls] = useState({
		source1: null,
		source2: null,
		source3: null,
	});
	const [inputValidity, setInputValidity] = useState({
		source1: false,
		source2: false,
		source2: false,
	});
	const [disableStatus, setDisableStatus] = useState(true);

	validateWebsiteUrl = (websiteUrl) => {
		let urlRegex =
			/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
		return urlRegex.test(websiteUrl);
	};

	const handleChangeText = (newValue, sourceNumber) => {
		var newInputValidity = inputValidity;
		var newUrls = urls;

		newUrls[`source${sourceNumber}`] = newValue;
		setUrls(newUrls);

		if (newValue.length < 1 || !validateWebsiteUrl(newValue)) {
			newInputValidity[`source${sourceNumber}`] = false;
			setInputValidity(newInputValidity);
		} else {
			newInputValidity[`source${sourceNumber}`] = true;
			setInputValidity(newInputValidity);
		}

		if (Object.values(inputValidity).every((item) => item === true)) {
			setDisableStatus(false);
		} else {
			setDisableStatus(true);
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
			<View style={styles.centeredView}>
				<View style={styles.modalView}>
					<Text>
						Add sources to substantiate your investment thesis. Sources are
						great way to share some of the information that led to your current
						thinking on investments.
					</Text>
					<Pressable
						onPress={() => {
							makeModalDisappear();
						}}
					>
						<Feather name="x-circle" size={30} color="black" />
					</Pressable>
					<TextInput
						placeholder="https://www.examplesource1.com"
						placeholderTextColor="#c7c7c7"
						value={urls["source1"]}
						onChangeText={(newValue) => handleChangeText(newValue, 1)}
						style={styles.titleInput}
						maxLength={256}
						autoCorrect={true}
					/>
					<TextInput
						placeholder="https://www.examplesource2.com"
						placeholderTextColor="#c7c7c7"
						value={urls["source2"]}
						onChangeText={(newValue) => handleChangeText(newValue, 2)}
						style={styles.titleInput}
						maxLength={256}
						autoCorrect={true}
					/>
					<TextInput
						placeholder="https://www.examplesource3.com"
						placeholderTextColor="#c7c7c7"
						value={urls["source3"]}
						onChangeText={(newValue) => handleChangeText(newValue, 3)}
						style={styles.titleInput}
						maxLength={256}
						autoCorrect={true}
					/>
					<Pressable
						style={
							disableStatus ? styles.addButtonDisabled : styles.addButtonEnabled
						}
						disabled={disableStatus}
						onPress={() => {
							makeModalDisappear();
							console.log("Add button pressed");
						}}
					>
						<Text style={styles.textStyle}>Add</Text>
					</Pressable>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
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

export default AddSourcesModal;
