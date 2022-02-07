// Import Installed Libraries
import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	TextInput,
	View,
	KeyboardAvoidingView,
	TouchableOpacity,
	SafeAreaView,
	Platform,
	StatusBar,
} from "react-native";

// Import Local Files
import DismissKeyboard from "../components/DismissKeyboard";
import { useSelector, useDispatch } from "react-redux";
import { clearAuthError } from "../redux/actions/AuthActions";
import UserManager from "../managers/UserManager";
import AppText from "../components/AppText";
import {
	TEXT_COLOR,
	MAIN_DIFFERENTIATOR_COLOR,
	LIGHT_GREY_COLOR,
	MAIN_SECONDARY_COLOR,
	BAD_COLOR,
} from "../styles/Colors";

// Login Screen Functional Component
const LoginScreen = ({ navigation }) => {
	// State Management
	const { errorMessage } = useSelector((state) => state.authReducer);
	const dispatch = useDispatch();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [disableStatus, setDisableStatus] = useState(true);
	const [inputValidity, setInputValidity] = useState({
		usernameValidity: false,
		passwordValidity: false,
	});

	useEffect(() => {
		const unsubscribe = navigation.addListener("focus", () => {
			const clearErrorMessage = () => dispatch(clearAuthError());
			clearErrorMessage();
		});
		return unsubscribe;
	}, [navigation]);

	// Input Validation
	const handleChangeText = ({
		newValue,
		checkUsername = false,
		checkPassword = false,
	} = {}) => {
		var newInputValidity = inputValidity;
		if (checkUsername) {
			setUsername(newValue);
			if (newValue.length > 0) {
				// username is valid
				newInputValidity["usernameValidity"] = true;
				setInputValidity(newInputValidity);
			} else {
				// username is NOT valid
				newInputValidity["usernameValidity"] = false;
				setInputValidity(newInputValidity);
			}
		}
		if (checkPassword) {
			setPassword(newValue);
			if (newValue.length > 0) {
				// password is valid
				newInputValidity["passwordValidity"] = true;
				setInputValidity(newInputValidity);
			} else {
				// password is NOT valid
				newInputValidity["passwordValidity"] = false;
				setInputValidity(newInputValidity);
			}
		}
		// If BOTH username and passwod are valid, enable button. Else, disbale button.
		if (Object.values(inputValidity).every((item) => item === true)) {
			setDisableStatus(false);
		} else {
			setDisableStatus(true);
		}
	};

	return (
		<DismissKeyboard>
			<SafeAreaView style={styles.container}>
				<KeyboardAvoidingView width={"100%"} alignItems={"center"} behavior={"padding"}>
					<AppText style={styles.titleText}>Log In</AppText>
					<View style={styles.inputContainer}>
						<TextInput
							placeholder="Username"
							placeholderTextColor={LIGHT_GREY_COLOR}
							value={username}
							onChangeText={(newValue) =>
								handleChangeText({ newValue: newValue, checkUsername: true })
							}
							style={styles.input}
							autoCapitalize="none"
							autoCorrect={false}
						/>
						<TextInput
							placeholder="Password"
							placeholderTextColor={LIGHT_GREY_COLOR}
							value={password}
							onChangeText={(newValue) =>
								handleChangeText({ newValue: newValue, checkPassword: true })
							}
							style={styles.input}
							autoCapitalize="none"
							autoCorrect={false}
							secureTextEntry={true}
						/>
						{errorMessage ? (
							<AppText style={styles.errorMessage}>{errorMessage}</AppText>
						) : null}
					</View>
					<TouchableOpacity
						onPress={() => UserManager.login({ username, password })}
						style={disableStatus ? styles.buttonDisabled : styles.buttonEnabled}
						disabled={disableStatus}
					>
						<AppText style={styles.buttonText}>Log In</AppText>
					</TouchableOpacity>
				</KeyboardAvoidingView>
				<View style={styles.signupInsteadContainer}>
					<AppText style={styles.signupInsteadText}>Don't have an account?</AppText>
					<TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
						<AppText style={styles.signupInsteadButton}>Sign up</AppText>
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		</DismissKeyboard>
	);
};

export default LoginScreen;

//-----     Styles     -----/
//--------------------------/
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
	},
	inputContainer: {
		width: "80%",
	},
	input: {
		color: TEXT_COLOR,
		backgroundColor: MAIN_DIFFERENTIATOR_COLOR,
		height: 37,
		paddingHorizontal: 15,
		borderRadius: 10,
		marginTop: 5,
	},
	buttonEnabled: {
		backgroundColor: MAIN_SECONDARY_COLOR,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 30,
		height: 50,
		width: 170,
		marginTop: 20,
	},
	buttonDisabled: {
		backgroundColor: MAIN_SECONDARY_COLOR,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 30,
		height: 50,
		width: 170,
		marginTop: 20,
		opacity: 0.33,
	},
	buttonText: {
		color: TEXT_COLOR,
		fontWeight: "700",
		fontSize: 16,
	},
	errorMessage: {
		fontSize: 16,
		marginTop: 20,
		alignSelf: "center",
		color: BAD_COLOR,
	},
	signupInsteadContainer: {
		marginTop: 75,
		justifyContent: "space-evenly",
		width: "100%",
		flexDirection: "row",
	},
	signupInsteadText: {
		fontSize: 16,
		color: LIGHT_GREY_COLOR,
	},
	signupInsteadButton: {
		fontSize: 16,
		color: MAIN_SECONDARY_COLOR,
		marginLeft: 10,
	},
	titleText: {
		alignSelf: "center",
		color: TEXT_COLOR,
		fontSize: 22,
		padding: 5,
		marginBottom: 15,
	},
});
