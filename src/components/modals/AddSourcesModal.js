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
import { NativeBaseProvider } from "native-base";
import {
	TEXT_COLOR,
	MAIN_DIFFERENTIATOR_COLOR,
	LIGHT_GREY_COLOR,
	MAIN_SECONDARY_COLOR,
} from "../../styles/Colors";
import AppText from "../AppText";


const NUMBER_OF_SOURCES = [1, 2, 3, 4, 5, 6];

const AddSourcesModal = ({
	modalVisible,
	makeModalDisappear,
	hackValue,  // a "hack" that gets the sources state variabale to update
	sources,
	changeSource,
	tallySources,
}) => {

	// Display thesis source inputs
	let sourceInputs = NUMBER_OF_SOURCES.map((sourceNumber, index) => (
		<TextInput key={index}
			selectionColor={MAIN_SECONDARY_COLOR}
			placeholder="https://www.examplesource.com"
			placeholderTextColor={LIGHT_GREY_COLOR}
			value={sources[index]}
			onChangeText={(newValue) => handleChangeText(newValue, sourceNumber)}
			style={Platform.OS == "web" ?
				{
					color: TEXT_COLOR,
					paddingVertical: 5,
					borderBottomWidth: 0.3,
					borderBottomColor: MAIN_SECONDARY_COLOR,
					marginTop: 10,
					marginBottom: 5,
					outlineStyle: 'none', //removes input outline in web browsers
				}
				: styles.sourceInput}
			maxLength={256}
			keyboardType={Platform.OS === "ios" ? "url" : "default"}
			autoCapitalize={"none"}
			autoCorrect={false}
			clearButtonMode={'while-editing'} //on ios, adds an 'x' to clear all text when editing
			returnKeyType={'done'}
			onSubmitEditing={() => {
				// 1. Tally up valid sources
				tallySources();
				// 2. Make Modal Disapper
				makeModalDisappear();
			}}
		/>
	));


	const handleChangeText = (newValue, sourceNumber) => {
		changeSource(newValue, sourceNumber);

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
						// 1. Tally up valid sources
						tallySources();
						// 2. Make Modal Disapper
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
								<View style={{ width: "100%" }}>
									{sourceInputs}
								</View>
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
		color: TEXT_COLOR,
		paddingVertical: 5,
		borderBottomWidth: 0.3,
		borderBottomColor: MAIN_SECONDARY_COLOR,
		marginTop: 10,
		marginBottom: 5,
	},
	checkMarkHidden: {
		opacity: 0,
	},
});
export default AddSourcesModal;
