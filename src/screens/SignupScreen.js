// Import Installed Libraries
import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	TextInput,
	View,
	KeyboardAvoidingView,
	SafeAreaView,
	TouchableOpacity,
	Platform,
	StatusBar,
} from "react-native";
import { TextInputMask } from "react-native-masked-text";
import { Ionicons, Feather } from "@expo/vector-icons";
import { HStack, NativeBaseProvider, Select } from "native-base";
import { useSelector, useDispatch } from "react-redux";
import * as WebBrowser from "expo-web-browser";

// Import Local Files
import DismissKeyboard from "../components/DismissKeyboard";
import { clearAuthError } from "../redux/actions/AuthActions";
import UserManager from "../managers/UserManager";
import AppText from "../components/AppText";
import {
	TEXT_COLOR,
	MAIN_BACKGROUND_COLOR,
	MAIN_DIFFERENTIATOR_COLOR,
	LIGHT_GREY_COLOR,
	MAIN_SECONDARY_COLOR,
	BAD_COLOR,
	GOOD_COLOR,
} from "../styles/Colors";

// Signup Screen Functional Component
const SignupScreen = ({ navigation }) => {
	// State Management
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [birthDate, setBirthDate] = useState("");
	const [username, setUsername] = useState("");
	const [gender, setGender] = useState("");
	const [inputValidity, setInputValidity] = useState({
		emailValidity: false,
		passwordLength: false,
		passwordCharacters: false,
		usernameValidity: false,
		birthDateValidity: false,
	});
	const [disableStatus, setDisableStatus] = useState(true);
	// Redux
	const { errorMessage } = useSelector((state) => state.authReducer);
	const dispatch = useDispatch();

	useEffect(() => {
		const unsubscribe = navigation.addListener("focus", () => {
			const clearErrorMessage = () => dispatch(clearAuthError());
			clearErrorMessage();
		});
		return unsubscribe;
	}, [navigation]);

	const handleWebLink = async (webLink) => {
		await WebBrowser.openBrowserAsync(webLink);
	};

	// Input Validation
	const emailValidation = (emailText) => {
		// Email format
		const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
		if (emailRegex.test(emailText) === false) {
			return false;
		} else {
			return true;
		}
	};

	const passwordValidation = ({
		passwordText,
		checkLength = false,
		checkCharacters = false,
	} = {}) => {
		// Capital, lowercase, number, and special symbol
		var pattern = new RegExp(
			"^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-+_!@#$%^&*.,?]).+$"
		);

		if (checkLength) {
			if (passwordText.length < 8) {
				return false;
			}
		}

		if (checkCharacters) {
			if (!pattern.test(passwordText)) {
				return false;
			}
		}

		return true;
	};

	const usernameValidation = (usernameText) => {
		// Only alphanumeric characters
		let usernameRegex = /^[a-zA-Z0-9]+$/;
		if (usernameRegex.test(usernameText) === false) {
			return false;
		} else {
			return true;
		}
	};

	const dateValidation = (dateText) => {
		// 1. Check that string is in support date format
		const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
		if (dateRegex.test(dateText) === false) {
			return false;
		}

		// 2. Parse the date parts to integers
		var parts = dateText.split("/");
		var day = parseInt(parts[1], 10);
		var month = parseInt(parts[0], 10);
		var year = parseInt(parts[2], 10);

		// 3. Check the ranges of months
		if (month < 1 || month > 12) {
			return false;
		}

		// 4. Ensure date is in the past and within the last 100 years
		var today = Date.now();
		var dateToCheck = Date.parse(dateText);
		var timeDifference = today - dateToCheck;

		if (dateToCheck > today) {
			return false;
		}

		if (
			timeDifference > 60 * 60 * 24 * 365 * 100 * 1000 ||
			timeDifference < 60 * 60 * 24 * 365 * 18 * 1000
		) {
			return false;
		}

		// 5. Ensure the supplied day is valid (adjust for leap years)
		var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

		if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
			monthLength[1] = 29;
		}

		return day > 0 && day <= monthLength[month - 1];
	};

	const handleChangeText = ({
		newValue,
		checkEmail = false,
		checkPassword = false,
		checkUsername = false,
		checkBirthDate = false,
	} = {}) => {
		var newInputValidity = inputValidity;

		if (checkEmail) {
			setEmail(newValue);
			if (emailValidation(newValue)) {
				newInputValidity["emailValidity"] = true;
				setInputValidity(newInputValidity);
			} else {
				newInputValidity["emailValidity"] = false;
				setInputValidity(newInputValidity);
			}
		}
		if (checkPassword) {
			setPassword(newValue);
			if (
				passwordValidation({
					passwordText: newValue,
					checkLength: true,
				})
			) {
				newInputValidity["passwordLength"] = true;
				setInputValidity(newInputValidity);
			} else {
				newInputValidity["passwordLength"] = false;
				setInputValidity(newInputValidity);
			}
			if (
				passwordValidation({
					passwordText: newValue,
					checkCharacters: true,
				})
			) {
				newInputValidity["passwordCharacters"] = true;
				setInputValidity(newInputValidity);
			} else {
				newInputValidity["passwordCharacters"] = false;
				setInputValidity(newInputValidity);
			}
		}

		if (checkUsername) {
			setUsername(newValue);
			if (usernameValidation(newValue)) {
				newInputValidity["usernameValidity"] = true;
				setInputValidity(newInputValidity);
			} else {
				newInputValidity["usernameValidity"] = false;
				setInputValidity(newInputValidity);
			}
		}

		if (checkBirthDate) {
			setBirthDate(newValue);
			if (dateValidation(newValue)) {
				newInputValidity["birthDateValidity"] = true;
				setInputValidity(newInputValidity);
			} else {
				newInputValidity["birthDateValidity"] = false;
				setInputValidity(newInputValidity);
			}
		}

		if (Object.values(inputValidity).every((item) => item === true)) {
			setDisableStatus(false);
		} else {
			setDisableStatus(true);
		}
	};

	return (
		<NativeBaseProvider>
			<DismissKeyboard>
				<SafeAreaView style={styles.container}>
					<KeyboardAvoidingView width={"100%"} alignItems={"center"} behavior={"padding"}>
						<AppText style={styles.titleText}>Welcome to Pelleum</AppText>
						<View style={styles.inputContainer}>
							<TextInput
								color={TEXT_COLOR}
								selectionColor={TEXT_COLOR}
								placeholder="Email"
								maxLength={100}
								placeholderTextColor={LIGHT_GREY_COLOR}
								keyboardType="email-address"
								value={email}
								onChangeText={(newValue) =>
									handleChangeText({ newValue: newValue, checkEmail: true })
								}
								style={styles.input}
								autoCapitalize="none"
								autoCorrect={false}
							/>
							<TextInput
								color={TEXT_COLOR}
								selectionColor={TEXT_COLOR}
								placeholder="Username"
								maxLength={15}
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
								color={TEXT_COLOR}
								selectionColor={TEXT_COLOR}
								placeholder="Password"
								maxLength={100}
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
							<TextInputMask
								color={TEXT_COLOR}
								selectionColor={TEXT_COLOR}
								placeholder="MM/DD/YYYY"
								placeholderTextColor={LIGHT_GREY_COLOR}
								type={"datetime"}
								style={styles.input}
								options={{ format: "MM/DD/YYYY" }}
								value={birthDate}
								onChangeText={(newValue) =>
									handleChangeText({ newValue: newValue, checkBirthDate: true })
								}
							/>
							<Select
								placeholder="Gender"
								color={TEXT_COLOR}
								selectionColor={TEXT_COLOR}
								placeholderTextColor={LIGHT_GREY_COLOR}
								borderColor={MAIN_BACKGROUND_COLOR}
								background={MAIN_DIFFERENTIATOR_COLOR}
								fontSize="14"
								height="39.5"
								px="15"
								borderRadius="10"
								my="0.5"
								selectedValue={gender}
								onValueChange={(genderOption) => setGender(genderOption)}
							>
								<Select.Item label="Female" value="key0" />
								<Select.Item label="Male" value="key1" />
								<Select.Item label="Transgender" value="key2" />
								<Select.Item label="Non-binary" value="key3" />
								<Select.Item label="Other" value="key4" />
								<Select.Item label="I prefer not to say" value="key4" />
							</Select>
							{errorMessage ? (
								<AppText style={styles.errorMessage}>{errorMessage}</AppText>
							) : null}
						</View>
						<View style={styles.validationMessageView}>
							<HStack alignItems="center">
								{!emailValidation(email) ? (
									<Feather name="x-circle" size={24} color={BAD_COLOR} />
								) : (
									<Ionicons
										name="shield-checkmark"
										size={24}
										color={GOOD_COLOR}
									/>
								)}
								<AppText style={styles.validationMessageText}>
									Email is valid.
								</AppText>
							</HStack>
							<HStack alignItems="center">
								{!usernameValidation(username) ? (
									<Feather name="x-circle" size={24} color={BAD_COLOR} />
								) : (
									<Ionicons
										name="shield-checkmark"
										size={24}
										color={GOOD_COLOR}
									/>
								)}
								<AppText style={styles.validationMessageText}>
									Username is valid.
								</AppText>
							</HStack>
							<HStack alignItems="center">
								{!passwordValidation({
									passwordText: password,
									checkLength: true,
								}) ? (
									<Feather name="x-circle" size={24} color={BAD_COLOR} />
								) : (
									<Ionicons
										name="shield-checkmark"
										size={24}
										color={GOOD_COLOR}
									/>
								)}
								<AppText style={styles.validationMessageText}>
									Password must be at least 8 characters long.
								</AppText>
							</HStack>
							<HStack>
								{!passwordValidation({
									passwordText: password,
									checkCharacters: true,
								}) ? (
									<Feather name="x-circle" size={24} color={BAD_COLOR} />
								) : (
									<Ionicons
										name="shield-checkmark"
										size={24}
										color={GOOD_COLOR}
									/>
								)}
								<AppText style={styles.validationMessageText}>
									Password must contain one uppercase, lowercase,
									numerical, and special
									character.
								</AppText>
							</HStack>
							<HStack alignItems="center">
								{!dateValidation(birthDate) ? (
									<Feather name="x-circle" size={24} color={BAD_COLOR} />
								) : (
									<Ionicons
										name="shield-checkmark"
										size={24}
										color={GOOD_COLOR}
									/>
								)}
								<AppText style={styles.validationMessageText}>
									Birthdate is valid, and you are at least 18 years old.
								</AppText>
							</HStack>
						</View>
						<TouchableOpacity
							onPress={() => UserManager.signup({ email, username, password })}
							style={disableStatus ? styles.buttonDisabled : styles.buttonEnabled}
							disabled={disableStatus}
						>
							<AppText style={styles.buttonText}>Create Account</AppText>
						</TouchableOpacity>
					</KeyboardAvoidingView>
					<View style={styles.termsContainer}>
						<AppText style={styles.bottomText}>By signing up, you agree to Pelleum's </AppText>
						<HStack>
							<TouchableOpacity onPress={() => handleWebLink("https://www.pelleum.com/terms-and-conditions")}>
								<AppText style={styles.termsButton}>Terms of Service </AppText>
							</TouchableOpacity>
							<AppText style={styles.bottomText}>and </AppText>
							<TouchableOpacity onPress={() => handleWebLink("https://www.pelleum.com/privacy-policy")}>
								<AppText style={styles.termsButton}>Priacy Policy</AppText>
							</TouchableOpacity>
							<AppText style={styles.bottomText}>.</AppText>
						</HStack>
					</View>
					<View style={styles.loginInsteadContainer}>
						<AppText style={styles.bottomText}>Already have an account? </AppText>
						<TouchableOpacity onPress={() => navigation.navigate("Login")}>
							<AppText style={styles.loginInsteadButton}>Log in</AppText>
						</TouchableOpacity>
					</View>
				</SafeAreaView>
			</DismissKeyboard>
		</NativeBaseProvider >
	);
};

export default SignupScreen;

//-----     Styles     -----/
//--------------------------/
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
		marginHorizontal: 30
	},
	inputContainer: {
		width: "100%",
	},
	input: {
		backgroundColor: MAIN_DIFFERENTIATOR_COLOR,
		fontSize: 14,
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
		marginTop: 10,
	},
	buttonDisabled: {
		backgroundColor: MAIN_SECONDARY_COLOR,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 30,
		height: 50,
		width: 170,
		marginTop: 10,
		opacity: 0.33,
	},
	buttonText: {
		color: TEXT_COLOR,
		fontWeight: "700",
		fontSize: 16,
	},
	errorMessage: {
		fontSize: 16,
		color: BAD_COLOR,
		paddingVertical: 10,
		marginTop: 30,
		marginHorizontal: 10,
	},
	titleText: {
		fontSize: 22,
		color: TEXT_COLOR,
		padding: 5,
		alignSelf: "center",
		marginBottom: 15,
	},
	validationMessageView: {
		marginTop: 10,

	},
	validationMessageText: {
		marginLeft: 5,
	},
	loginInsteadContainer: {
		marginTop: 37.5,
		alignSelf: "center",
		flexDirection: "row",
	},
	bottomText: {
		fontSize: 16,
		color: LIGHT_GREY_COLOR,
	},
	loginInsteadButton: {
		fontSize: 16,
		color: MAIN_SECONDARY_COLOR,
		marginLeft: 10,
	},
	termsContainer: {
		marginTop: 37.5,
		alignSelf: "center",
	},
	termsButton: {
		fontSize: 16,
		color: MAIN_SECONDARY_COLOR,
	},
});