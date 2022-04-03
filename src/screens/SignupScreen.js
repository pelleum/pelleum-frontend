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
	Keyboard,
} from "react-native";
import { TextInputMask } from "react-native-masked-text";
import { AntDesign } from "@expo/vector-icons";
import { HStack, NativeBaseProvider } from "native-base";
import { useSelector, useDispatch } from "react-redux";
import * as WebBrowser from "expo-web-browser";
import { useAnalytics } from '@segment/analytics-react-native';

// Import Local Files
import DismissKeyboard from "../components/DismissKeyboard";
import { clearAuthError } from "../redux/actions/AuthActions";
import UserManager from "../managers/UserManager";
import AppText from "../components/AppText";
import GenderModal from "../components/modals/GenderModal";
import {
	TEXT_COLOR,
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
	const [birthdate, setBirthdate] = useState("");
	const [username, setUsername] = useState("");
	const [gender, setGender] = useState("");
	const [modalVisible, setModalVisible] = useState(false);
	const [inputValidity, setInputValidity] = useState({
		emailValidity: false,
		passwordLength: false,
		passwordCharacters: false,
		usernameValidity: false,
		birthDateValidity: false,
		genderValidity: false,
	});
	const [showValidityIcon, setShowValidityIcon] = useState({
		emailValidityIcon: false,
		passwordValidityIcon: false,
		usernameValidityIcon: false,
		birthDateValidityIcon: false,
		genderValidityIcon: false,
	});
	const [disableStatus, setDisableStatus] = useState(true);
	const [isFocused, setIsFocused] = useState("");
	// Redux
	const { errorMessage } = useSelector((state) => state.authReducer);
	const dispatch = useDispatch();

	// Segment Tracking
	const { identify, track } = useAnalytics();

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

	const getAge = dateOfBirth => Math.floor((new Date() - new Date(dateOfBirth).getTime()) / 3.15576e+10);

	const handleSignup = async (email, username, password, birthdate, gender) => {
		// 1. Convert date format
		const reformattedBirthdate = new Date(birthdate);

		// 2. Attempt to create an account
		const response = await UserManager.signup({
			"email": email,
			"username": username,
			"password": password,
			"birthdate": reformattedBirthdate,
			"gender": gender,
		});

		// 3. If account creation was successful, identify the user and track the event
		if (response.status == 201) {
			identify(response.data.user_id, {
				email: response.data.email,
				username: response.data.username,
				age: getAge(response.data.birthdate),
				birthday: response.data.birthdate,
				gender: response.data.gender,
				createdAt: response.data.created_at,
				platform: Platform.OS,
				plan: "basic",
			});

			track('Account Created', {
				userId: response.data.user_id,
				email: response.data.email,
				username: response.data.username,
				age: getAge(response.data.birthdate),
				birthday: response.data.birthdate,
				gender: response.data.gender,
				createdAt: response.data.created_at,
				platform: Platform.OS,
				plan: "basic",
			});

		} else {
			// signup was unsuccessful
			// do not identify user or track the signup event
		};
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
		// Only allow alphanumeric characters and single underscore
		let usernameRegex = /^[A-Za-z][A-Za-z0-9]*(?:_[A-Za-z0-9]+)*$/;
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
			setBirthdate(newValue);
			if (dateValidation(newValue)) {
				newInputValidity["birthDateValidity"] = true;
				setInputValidity(newInputValidity);
			} else {
				newInputValidity["birthDateValidity"] = false;
				setInputValidity(newInputValidity);
			}
		}
	};

	const checkInputValidity = () => {
		if (Object.values(inputValidity).every((item) => item === true)) {
			setDisableStatus(false);
		} else {
			setDisableStatus(true);
		};
	};

	({
		newValue,
		checkEmail = false,
		checkPassword = false,
		checkUsername = false,
		checkBirthDate = false,
	} = {})

	const handleOnFocus = ({
		isFocusedString,
		validityIconKey,
	} = {}) => {
		const newShowValidityIcon = showValidityIcon;
		setIsFocused(isFocusedString)
		newShowValidityIcon[validityIconKey] = false;
		setShowValidityIcon(newShowValidityIcon)
	};

	const handleOnBlur = (validityIconKey) => {
		const newShowValidityIcon = showValidityIcon;
		setIsFocused("")
		newShowValidityIcon[validityIconKey] = true;
		setShowValidityIcon(newShowValidityIcon)
	};

	return (
		<NativeBaseProvider>
			<DismissKeyboard>
				<SafeAreaView style={styles.container}>
					<KeyboardAvoidingView width={"100%"} alignItems={"center"} behavior={"padding"}>
						<AppText style={styles.titleText}>Welcome to Pelleum</AppText>
						<View style={styles.inputContainer}>
							<View style={styles.inputIconContainer}>
								<TextInput
									color={TEXT_COLOR}
									selectionColor={MAIN_SECONDARY_COLOR}
									placeholder="Email"
									maxLength={100}
									placeholderTextColor={LIGHT_GREY_COLOR}
									keyboardType="email-address"
									value={email}
									onChangeText={(newValue) => {
										handleChangeText({ newValue: newValue, checkEmail: true })
										checkInputValidity()
									}}
									style={styles.inputWithIcon}
									autoCapitalize="none"
									autoCorrect={false}
									onFocus={() => handleOnFocus({ isFocusedString: "emailFocused", validityIconKey: "emailValidityIcon" })}
									onBlur={() => handleOnBlur("emailValidityIcon")}
								/>
								{showValidityIcon["emailValidityIcon"] ? (
									emailValidation(email) ? (
										<AntDesign style={styles.inputIcon} name="checkcircleo" size={20} color={GOOD_COLOR} />
									) : (
										<AntDesign style={styles.inputIcon} name="exclamationcircleo" size={20} color={BAD_COLOR} />
									)
								) : null}
							</View>
							<View style={styles.inputIconContainer}>
								<TextInput
									color={TEXT_COLOR}
									selectionColor={MAIN_SECONDARY_COLOR}
									placeholder="Username"
									maxLength={15}
									placeholderTextColor={LIGHT_GREY_COLOR}
									value={username}
									onChangeText={(newValue) => {
										handleChangeText({ newValue: newValue, checkUsername: true })
										checkInputValidity()
									}}
									style={styles.inputWithIcon}
									autoCapitalize="none"
									autoCorrect={false}
									onFocus={() => handleOnFocus({ isFocusedString: "usernameFocused", validityIconKey: "usernameValidityIcon" })}
									onBlur={() => handleOnBlur("usernameValidityIcon")}
								/>
								{showValidityIcon["usernameValidityIcon"] ? (
									usernameValidation(username) ? (
										<AntDesign style={styles.inputIcon} name="checkcircleo" size={20} color={GOOD_COLOR} />
									) : (
										<AntDesign style={styles.inputIcon} name="exclamationcircleo" size={20} color={BAD_COLOR} />
									)
								) : null}
							</View>
							<View style={styles.inputIconContainer}>
								<TextInput
									color={TEXT_COLOR}
									selectionColor={MAIN_SECONDARY_COLOR}
									placeholder="Password"
									maxLength={100}
									placeholderTextColor={LIGHT_GREY_COLOR}
									value={password}
									onChangeText={(newValue) => {
										handleChangeText({ newValue: newValue, checkPassword: true })
										checkInputValidity()
									}}
									style={styles.inputWithIcon}
									autoCapitalize="none"
									autoCorrect={false}
									secureTextEntry={true}
									onFocus={() => handleOnFocus({ isFocusedString: "passwordFocused", validityIconKey: "passwordValidityIcon" })}
									onBlur={() => handleOnBlur("passwordValidityIcon")}
								/>
								{showValidityIcon["passwordValidityIcon"] ? (
									passwordValidation({
										passwordText: password,
										checkCharacters: true,
										checkLength: true,
									}) ? (
										<AntDesign style={styles.inputIcon} name="checkcircleo" size={20} color={GOOD_COLOR} />
									) : (
										<AntDesign style={styles.inputIcon} name="exclamationcircleo" size={20} color={BAD_COLOR} />
									)
								) : null}
							</View>
							<View style={styles.inputIconContainer}>
								<TextInputMask
									color={TEXT_COLOR}
									selectionColor={MAIN_SECONDARY_COLOR}
									placeholder="MM/DD/YYYY"
									placeholderTextColor={LIGHT_GREY_COLOR}
									type={"datetime"}
									style={styles.inputWithIcon}
									options={{ format: "MM/DD/YYYY" }}
									value={birthdate}
									onChangeText={(newValue) => {
										handleChangeText({ newValue: newValue, checkBirthDate: true })
										checkInputValidity();
									}}
									onFocus={() => handleOnFocus({ isFocusedString: "birthdateFocused", validityIconKey: "birthDateValidityIcon" })}
									onBlur={() => handleOnBlur("birthDateValidityIcon")}
								/>
								{showValidityIcon["birthDateValidityIcon"] ? (
									dateValidation(birthdate) ? (
										<AntDesign style={styles.inputIcon} name="checkcircleo" size={20} color={GOOD_COLOR} />
									) : (
										<AntDesign style={styles.inputIcon} name="exclamationcircleo" size={20} color={BAD_COLOR} />
									)
								) : null}
							</View>
							<View style={styles.inputIconContainer}>
								<GenderModal
									modalVisible={modalVisible}
									setGender={setGender}
									inputValidity={inputValidity}
									setInputValidity={setInputValidity}
									makeModalDisappear={() => {
										setModalVisible(false);
										checkInputValidity();
										handleOnBlur("genderValidityIcon");
									}}
								/>
								<TouchableOpacity
									style={styles.genderSelectButton}
									onPress={() => {
										Keyboard.dismiss();
										setModalVisible(true);
										handleOnFocus({ isFocusedString: "", validityIconKey: "genderValidityIcon" });
									}}
								>
									{gender == "" ? <AppText style={styles.genderSelectPlaceholder}>Gender</AppText> : null}
									{gender == "FEMALE" ? <AppText style={styles.genderSelectText}>Female</AppText> : null}
									{gender == "MALE" ? <AppText style={styles.genderSelectText}>Male</AppText> : null}
									{gender == "OTHER" ? <AppText style={styles.genderSelectText}>Other</AppText> : null}
									{gender == "UNDISCLOSED" ? <AppText style={styles.genderSelectText}>I prefer not to say</AppText> : null}
								</TouchableOpacity>
								{showValidityIcon["genderValidityIcon"] ? (
									gender ? (
										<AntDesign style={styles.inputIcon} name="checkcircleo" size={20} color={GOOD_COLOR} />
									) : (
										<AntDesign style={styles.inputIcon} name="exclamationcircleo" size={20} color={BAD_COLOR} />
									)
								) : null}
							</View>
						</View>
						{errorMessage ? (
							<AppText style={styles.errorMessage}>{errorMessage}</AppText>
						) : null}
						{isFocused ? (
							<View style={styles.validationMessageView}>
								{isFocused == "emailFocused" ? (
									<AppText style={styles.validationMessageText}>Enter a valid email address.</AppText>
								) : null}
								{isFocused == "usernameFocused" ? (
									<AppText style={styles.validationMessageText}>Choose a username that does not personally identify you. This can be changed later.</AppText>
								) : null}
								{isFocused == "passwordFocused" ? (
									<AppText style={styles.validationMessageText}>Password must be at least 8 characters long and contain at least one uppercase, one lowercase,
										one numerical, and one special character.</AppText>)
									: null}
								{isFocused == "birthdateFocused" ? (
									<AppText style={styles.validationMessageText}>Birthdate must be valid and you must be at least 18 years old.</AppText>)
									: null}
							</View>
						) : null}
						<View style={styles.termsContainer}>
							<AppText style={styles.bottomTextSmall}>By signing up, you agree to Pelleum's </AppText>
							<HStack>
								<TouchableOpacity onPress={() => handleWebLink("https://www.pelleum.com/terms-of-service")}>
									<AppText style={styles.termsButton}>Terms of Service </AppText>
								</TouchableOpacity>
								<AppText style={styles.bottomTextSmall}>and </AppText>
								<TouchableOpacity onPress={() => handleWebLink("https://www.pelleum.com/privacy-policy")}>
									<AppText style={styles.termsButton}>Privacy Policy</AppText>
								</TouchableOpacity>
								<AppText style={styles.bottomTextSmall}>.</AppText>
							</HStack>
						</View>
						<TouchableOpacity
							onPress={() => handleSignup(email, username, password, birthdate, gender)}
							style={disableStatus ? styles.buttonDisabled : styles.buttonEnabled}
							disabled={disableStatus}
						>
							<AppText style={styles.buttonText}>Create Account</AppText>
						</TouchableOpacity>
					</KeyboardAvoidingView>
					<View style={styles.loginInsteadContainer}>
						<AppText style={styles.bottomTextLarge}>Already have an account? </AppText>
						<TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
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
		marginHorizontal: 30,
	},
	inputContainer: {
		width: "100%",
	},
	buttonEnabled: {
		backgroundColor: MAIN_SECONDARY_COLOR,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 30,
		height: 50,
		width: 170,
		marginTop: 25,
	},
	buttonDisabled: {
		backgroundColor: MAIN_SECONDARY_COLOR,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 30,
		height: 50,
		width: 170,
		marginTop: 25,
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
		marginTop: 20,
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
		marginTop: 20,
	},
	validationMessageText: {
		color: "#fcba03",
		fontSize: 15,
	},
	loginInsteadContainer: {
		marginTop: 25,
		alignSelf: "center",
		alignItems: "center",
		flexDirection: "row",
	},
	bottomTextLarge: {
		fontSize: 16,
		color: LIGHT_GREY_COLOR,
	},
	bottomTextSmall: {
		fontSize: 14,
		color: LIGHT_GREY_COLOR,
	},
	loginInsteadButton: {
		fontSize: 16,
		color: MAIN_SECONDARY_COLOR,
		padding: 10,
	},
	termsContainer: {
		marginTop: 20,
		alignSelf: "center",
	},
	termsButton: {
		fontSize: 14,
		color: MAIN_SECONDARY_COLOR,
	},
	inputIconContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		backgroundColor: MAIN_DIFFERENTIATOR_COLOR,
		height: 37,
		paddingHorizontal: 15,
		borderRadius: 10,
		marginTop: 5,
	},
	inputIcon: {
		paddingLeft: 10,
	},
	inputWithIcon: {
		backgroundColor: MAIN_DIFFERENTIATOR_COLOR,
		fontSize: 14,
		height: "100%",
		width: "90%",
	},
	genderSelectButton: {
		alignItems: 'flex-start',
		justifyContent: 'center',
		backgroundColor: MAIN_DIFFERENTIATOR_COLOR,
		height: "100%",
		width: "90%",
	},
	genderSelectPlaceholder: {
		fontSize: 14,
		color: LIGHT_GREY_COLOR,
	},
	genderSelectText: {
		fontSize: 14,
		color: TEXT_COLOR,
	},
});