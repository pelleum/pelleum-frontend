// Import Installed Libraries
import React from "react";
import { StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import AppText from "../components/AppText";
import { useDispatch } from "react-redux";
import { logout, dumpUserObject } from "../redux/actions/AuthActions";
import { MAIN_DIFFERENTIATOR_COLOR } from "../styles/Colors";

const SettingsScreen = ({ navigation }) => {
	const handleWebLink = async (webLink) => {
		await WebBrowser.openBrowserAsync(webLink);
	};

	const dispatch = useDispatch();
	const logOut = async () => {
		await SecureStore.deleteItemAsync("userObject");
		dispatch(logout());
        dispatch(dumpUserObject());
	};

	return (
		<SafeAreaView alignItems="center" marginTop={1}>
			<TouchableOpacity
				style={styles.button}
				onPress={() => console.log("\nHelp button worked!\n")}
			>
				<AppText style={styles.buttonText}>Help</AppText>
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.button}
				onPress={() => navigation.navigate("LinkedStatus")}
			>
				<AppText style={styles.buttonText}>Linked Accounts</AppText>
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.button}
				onPress={() => handleWebLink("https://www.pelleum.com/privacy-policy")}
			>
				<AppText style={styles.buttonText}>Privacy Policy</AppText>
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.button}
				onPress={() => handleWebLink("https://www.pelleum.com/terms-and-conditions")}
			>
				<AppText style={styles.buttonText}>Terms & Conditions</AppText>
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.button}
				onPress={() => console.log("\nData button worked!\n")}
			>
				<AppText style={styles.buttonText}>Data</AppText>
			</TouchableOpacity>
			<TouchableOpacity style={styles.button} onPress={logOut}>
				<AppText style={styles.buttonText}>Log Out</AppText>
			</TouchableOpacity>
		</SafeAreaView>
	);
};

export default SettingsScreen;

const styles = StyleSheet.create({
	button: {
		alignItems: "center",
		backgroundColor: MAIN_DIFFERENTIATOR_COLOR,
		borderRadius: 30,
		width: "85%",
		paddingVertical: 6,
		marginTop: 5,
	},
	buttonText: {
		fontSize: 16,
		fontWeight: "bold",
		padding: 8,
	},
});
