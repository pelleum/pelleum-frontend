// Import Installed Libraries
import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	TextInput,
	View,
	KeyboardAvoidingView,
	TouchableOpacity,
} from "react-native";

// Import Local Files
import DismissKeyboard from "../components/DismissKeyboard";
import { useSelector, useDispatch } from 'react-redux';
import { clearAuthError } from "../redux/actions/AuthActions";
import UserManager from "../managers/UserManager";
import AppText from "../components/AppText";
import { TEXT_COLOR, MAIN_DIFFERENTIATOR_COLOR, LIGHT_GREY_COLOR } from "../styles/Colors";

// Login Screen Functional Component
const LoginScreen = ({ navigation }) => {
	// State Management
    const { errorMessage } = useSelector(state => state.authReducer);
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
			<KeyboardAvoidingView
				style={styles.container}
				//behavior="padding"       //ensures text fields do not get blocked by keyboard
			>
				<AppText style={styles.titleText}>Welcome to Pelleum!</AppText>
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
				<View style={styles.buttonContainer}>
					<TouchableOpacity
						onPress={() => UserManager.login({ username, password })}
						style={disableStatus ? styles.buttonDisabled : styles.buttonEnabled}
						disabled={disableStatus}
					>
						<AppText style={styles.buttonText}>Log In</AppText>
					</TouchableOpacity>
					<View style={styles.loginContainer}>
						<AppText style={styles.already}>Don't have an account?</AppText>
						<TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
							<AppText style={styles.logInNow}>Sign up</AppText>
						</TouchableOpacity>
					</View>
				</View>
			</KeyboardAvoidingView>
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
	},
	inputContainer: {
		width: "80%",
	},
	input: {
		color: TEXT_COLOR,
		backgroundColor: MAIN_DIFFERENTIATOR_COLOR,
		paddingHorizontal: 15,
		paddingVertical: 10,
		borderRadius: 10,
		marginTop: 5,
	},
	buttonContainer: {
		width: "60%",
		justifyContent: "center",
		alignItems: "center",
		marginTop: 40,
	},
	buttonEnabled: {
		backgroundColor: "#00A8FC",
		borderRadius: 30,
		height: 50,
		width: 170,
		margin: 15,
		justifyContent: "center",
		alignItems: "center",
	},
	buttonDisabled: {
		backgroundColor: "#00A8FC",
		borderRadius: 30,
		height: 50,
		width: 170,
		margin: 15,
		justifyContent: "center",
		alignItems: "center",
		opacity: 0.33,
	},
	buttonText: {
		color: "white",
		fontWeight: "700",
		fontSize: 16,
	},
	errorMessage: {
		fontSize: 16,
		color: "red",
		paddingVertical: 10,
		marginTop: 30,
		marginHorizontal: 10,
	},
	loginContainer: {
		paddingVertical: 10,
		marginTop: 30,
		justifyContent: "space-evenly",
		width: "110%",
		flexDirection: "row",
	},
	already: {
		fontSize: 16,
		color: "gray",
	},
	logInNow: {
		fontSize: 16,
		color: "#0782F9",
	},
	titleText: {
		fontSize: 22,
		color: TEXT_COLOR,
		padding: 5,
		alignSelf: "center",
		marginBottom: 15,
	},
});