// Import Installed Libraries
import React from "react";
import { StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import * as SecureStore from "expo-secure-store";
import AppText from "../components/AppText";
import { useDispatch } from "react-redux";
import { logout, dumpUserObject } from "../redux/actions/AuthActions";
import { MAIN_DIFFERENTIATOR_COLOR } from "../styles/Colors";

const SettingsScreen = ({ navigation }) => {

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
				onPress={() => navigation.navigate("LinkedStatus")}
			>
				<AppText style={styles.buttonText}>Linked Accounts</AppText>
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
