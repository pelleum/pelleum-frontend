import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	View,
	TextInput,
	Image,
	TouchableOpacity,
	SafeAreaView,
	Text,
	Alert,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Haptics from 'expo-haptics';
import DismissKeyboard from "../components/DismissKeyboard";
import LinkAccountsManager from "../managers/LinkAccountsManager";
import AppText from "../components/AppText";
import * as WebBrowser from "expo-web-browser";
import {
	TEXT_COLOR,
	BAD_COLOR,
	MAIN_SECONDARY_COLOR,
	MAIN_DIFFERENTIATOR_COLOR,
	LIGHT_GREY_COLOR,
} from "../styles/Colors";
import { useAnalytics } from '@segment/analytics-react-native';

const LinkAccountScreen = ({ navigation }) => {
	// State Management
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [sms_code, setSMSCode] = useState("");
	const [challenge_id, setChallengeId] = useState("");
	const [institutionLogin, setInstitutionLogin] = useState(false);
	const [credentialsDisableStatus, setCredentialsDisableStatus] = useState(true);
	const [smsDisableStatus, setSMSDisableStatus] = useState(true);
	const [credentialsValidity, setCredentialsValidity] = useState({
		emailValidity: false,
		passwordValidity: false,
	});

	// Segment Tracking
	const { track } = useAnalytics();

	const handleWebLink = async (webLink) => {
		await WebBrowser.openBrowserAsync(webLink);
	};

	const successAlert = () => {
		Alert.alert(
			"You've successfully linked your Robinhood account🎉",
			"You may receive an email or text message from Robinhood letting you know that your account was accessed by a machine in Columbus, Ohio. Don't worry. This was triggered by you when you linked your account to Pelleum.",
			[
				{
					text: "Got it!",
					onPress: () => {
						/* do nothing */
					},
				},
			]
		);
	};

	const onAccountLogin = async () => {
		const response = await LinkAccountsManager.accountLogin({
			username: email,
			password: password,
		});
		if (response.status == 200) {
			setErrorMessage("");
			if (response.data.challenge) {
				setChallengeId(response.data.challenge.id)
				setInstitutionLogin(true);
			} else if (response.data.account_connection_status == "connected") {
				track('Account Linked', {
					institution_id: process.env.REACT_APP_ROBINHOOD_ID,
				});
				await LinkAccountsManager.getLinkedAccountsStatus();
				Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
				successAlert();
				navigation.navigate("ProfileScreen", { accountLinked: true });
			} else {
				setInstitutionLogin(true);
			};
		} else {
			// we should probably make this a switch statement
			if (
				response.data.detail.includes(
					"Unable to log in with provided credentials."
				)
			) {
				setErrorMessage("Unable to log in with provided credentials.");
			} else if (
				response.data.detail.includes(
					"already has an active account connection with Robinhood."
				)
			) {
				setErrorMessage("Your Robinhood account is already linked to Pelleum.");
			} else {
				setErrorMessage("There was an error logging into your account. Please try again later.");
			}
		}
	};

	const onVerifyAccount = async (sms_code) => {
		// If there's no challenge_id, then only send sms_code; otherwise, send both
		const requestBody = challenge_id != "" ? (
			{ with_challenge: { sms_code: sms_code, challenge_id: challenge_id } }
		) :
			({ without_challenge: { sms_code: sms_code } });
		const response = await LinkAccountsManager.verifyAccount(requestBody);
		if (response.status == 201) {
			setErrorMessage("");
			track('Account Linked', {
				institution_id: process.env.REACT_APP_ROBINHOOD_ID,
			});
			await LinkAccountsManager.getLinkedAccountsStatus();
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
			successAlert();
			navigation.navigate("ProfileScreen", { accountLinked: true });
		} else {
			if (response.data.detail.includes("Please enter a valid code.")) {
				setErrorMessage("Invalid code. Please enter a valid code.");
			} else {
				setErrorMessage("There was an error validating your account. Please try again later.");
			}
		};
		challenge_id != "" ? setChallengeId("") : null;
	};

	useEffect(() => {
		const unsubscribe = navigation.addListener("focus", () => {
			setErrorMessage("");
		});
		return unsubscribe;
	}, [navigation]);

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

	const handleChangeText = ({
		newValue,
		checkEmail = false,
		checkPassword = false,
		checkSMSCode = false,
	} = {}) => {
		var newCredentialsValidity = credentialsValidity;
		if (checkEmail) {
			setEmail(newValue);
			if (emailValidation(newValue)) {
				// user credential is valid
				newCredentialsValidity["emailValidity"] = true;
				setCredentialsValidity(newCredentialsValidity);
			} else {
				// user credential is NOT valid
				newCredentialsValidity["emailValidity"] = false;
				setCredentialsValidity(newCredentialsValidity);
			}
		}
		if (checkPassword) {
			setPassword(newValue);
			if (newValue.length > 0) {
				// password is valid
				newCredentialsValidity["passwordValidity"] = true;
				setCredentialsValidity(newCredentialsValidity);
			} else {
				// password is NOT valid
				newCredentialsValidity["passwordValidity"] = false;
				setCredentialsValidity(newCredentialsValidity);
			}
		}
		if (checkSMSCode) {
			setSMSCode(newValue);
			if (newValue.length == 6) {
				// SMS code is valid
				setSMSDisableStatus(false);
			} else {
				// SMS code is NOT valid
				setSMSDisableStatus(true);
			}
		}
		// If BOTH email and passwod are valid, enable button. Else, disbale button.
		if (Object.values(credentialsValidity).every((item) => item === true)) {
			setCredentialsDisableStatus(false);
		} else {
			setCredentialsDisableStatus(true);
		}
	};

	return (
		<KeyboardAwareScrollView
			showsVerticalScrollIndicator={false}
			enableAutomaticScroll={true}
			enableOnAndroid={true} 		          //enable Android native softwareKeyboardLayoutMode
			extraHeight={275}					  //when keyboard comes up, scroll enough to see the Log In button
			keyboardShouldPersistTaps={'handled'} //scroll or tap buttons without dismissing the keyboard first
		>
			<DismissKeyboard>
				<SafeAreaView style={styles.mainContainer}>
					<Image
						style={styles.headerImage}
						source={require("../../assets/robinhood.png")}
					/>
					<AppText style={styles.headerText}>
						Link a Robinhood Account
					</AppText>
					{institutionLogin == false ? (
						<>
							<View style={styles.inputContainer}>
								<TextInput
									placeholder="Email"
									color={TEXT_COLOR}
									selectionColor={MAIN_SECONDARY_COLOR}
									placeholderTextColor={LIGHT_GREY_COLOR}
									value={email}
									onChangeText={(newValue) =>
										handleChangeText({
											newValue: newValue,
											checkEmail: true,
										})
									}
									style={styles.input}
									autoCapitalize="none"
									autoCorrect={false}
									keyboardType="email-address"
									maxLength={100}
								/>
								<TextInput
									placeholder="Password"
									color={TEXT_COLOR}
									selectionColor={MAIN_SECONDARY_COLOR}
									placeholderTextColor={LIGHT_GREY_COLOR}
									value={password}
									onChangeText={(newValue) =>
										handleChangeText({ newValue: newValue, checkPassword: true })
									}
									style={styles.input}
									autoCapitalize="none"
									autoCorrect={false}
									secureTextEntry={true}
									maxLength={100}
								/>
							</View>
							<AppText style={styles.instruction}>
								Use your email to log into your Robinhood brokerage account.
							</AppText>
							{errorMessage ? (
								<AppText style={styles.errorMessage}>{errorMessage}</AppText>
							) : null}
							<TouchableOpacity
								onPress={() => onAccountLogin()}
								style={
									credentialsDisableStatus
										? styles.buttonDisabled
										: styles.buttonEnabled
								}
								disabled={credentialsDisableStatus}
							>
								<AppText style={styles.buttonText}>Log In</AppText>
							</TouchableOpacity>
						</>
					) : (
						<>
							<View style={styles.inputContainer}>
								<TextInput
									style={styles.input}
									placeholder="Ex: 123456"
									color={TEXT_COLOR}
									selectionColor={MAIN_SECONDARY_COLOR}
									placeholderTextColor={LIGHT_GREY_COLOR}
									onChangeText={(newValue) =>
										handleChangeText({ newValue: newValue, checkSMSCode: true })
									}
									keyboardType="number-pad"
									maxLength={6}
								/>
							</View>
							<AppText style={styles.instruction}>
								Enter the verification code from the SMS message you received, or from the authenticator app that you use with Robinhood.
							</AppText>
							{errorMessage ? (
								<AppText style={styles.errorMessage}>{errorMessage}</AppText>
							) : null}
							<TouchableOpacity
								onPress={() => onVerifyAccount(sms_code)}
								style={
									smsDisableStatus
										? styles.buttonDisabled
										: styles.buttonEnabled
								}
								disabled={smsDisableStatus}
							>
								<AppText style={styles.buttonText}>Verify Account</AppText>
							</TouchableOpacity>
						</>
					)}
					<View style={styles.disclosureContainer}>
						<AppText style={styles.disclosureText}>
							Any data necessary to link your Robinhood account is encrypted in transit and at rest. By linking your account, you agree to Pelleum's
							<AppText> </AppText>
							<Text
								style={styles.linkButtonText}
								onPress={() => handleWebLink("https://www.pelleum.com/privacy-policy")}>
								Privacy Policy
							</Text>
							.
						</AppText>
					</View>
				</SafeAreaView>
			</DismissKeyboard>
		</KeyboardAwareScrollView>
	);
};

export default LinkAccountScreen;

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		alignItems: "center"
	},
	headerImage: {
		marginTop: 80,
		marginBottom: 10,
		width: 50,
		height: 50,
		resizeMode: "contain",
	},
	headerText: {
		fontSize: 16,
		fontWeight: "bold",
	},
	input: {
		backgroundColor: MAIN_DIFFERENTIATOR_COLOR,
		fontSize: 14,
		height: 37,
		paddingHorizontal: 15,
		borderRadius: 10,
		marginTop: 5,
	},
	errorMessage: {
		marginTop: 25,
		marginBottom: 10,
		fontSize: 16,
		color: BAD_COLOR,
	},
	buttonEnabled: {
		backgroundColor: MAIN_SECONDARY_COLOR,
		marginVertical: 20,
		borderRadius: 30,
		height: 50,
		width: 170,
		justifyContent: "center",
		alignItems: "center",
	},
	buttonDisabled: {
		backgroundColor: MAIN_SECONDARY_COLOR,
		marginVertical: 20,
		borderRadius: 30,
		height: 50,
		width: 170,
		justifyContent: "center",
		alignItems: "center",
		opacity: 0.33,
	},
	buttonText: {
		fontWeight: "700",
		fontSize: 16,
	},
	inputContainer: {
		width: "80%",
		marginVertical: 20,
	},
	instruction: {
		paddingHorizontal: 40,
		fontSize: 14,
	},
	disclosureContainer: {
		alignItems: "center",
		paddingHorizontal: 40,
	},
	disclosureText: {
		color: LIGHT_GREY_COLOR,
		fontSize: 14,
	},
	linkButtonText: {
		fontSize: 14,
		color: MAIN_SECONDARY_COLOR,
	},
});
