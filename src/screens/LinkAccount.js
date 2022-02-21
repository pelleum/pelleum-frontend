import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	KeyboardAvoidingView,
	View,
	TextInput,
	Image,
	TouchableOpacity,
	SafeAreaView,
} from "react-native";
import * as Haptics from 'expo-haptics';
import DismissKeyboard from "../components/DismissKeyboard";
import { NativeBaseProvider } from "native-base";
import LinkAccountsManager from "../managers/LinkAccountsManager";
import AppText from "../components/AppText";
import {
	TEXT_COLOR,
	BAD_COLOR,
	MAIN_SECONDARY_COLOR,
	MAIN_DIFFERENTIATOR_COLOR,
	LIGHT_GREY_COLOR,
} from "../styles/Colors";

const LinkAccount = ({ navigation }) => {
	const [userCredential, setUserCredential] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [sms_code, setSMSCode] = useState("");
	const [challenge_id, setChallengeId] = useState("");
	const [institutionLogin, setInstitutionLogin] = useState(false);
	const [credentialsDisableStatus, setCredentialsDisableStatus] = useState(true);
	const [smsDisableStatus, setSMSDisableStatus] = useState(true);
	const [credentialsValidity, setCredentialsValidity] = useState({
		userCredentialValidity: false,
		passwordValidity: false,
	});

	const onAccountLogin = async () => {
		const response = await LinkAccountsManager.accountLogin({
			username: userCredential,
			password: password,
		});
		if (response.status == 200) {
			setErrorMessage("");
			if (response.data.challenge) {
				setChallengeId(response.data.challenge.id)
				setInstitutionLogin(true);
			} else if (response.data.account_connection_status == "connected") {
				await LinkAccountsManager.getLinkedAccountsStatus();
				Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
				navigation.navigate("Profile", { accountLinked: true });
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
			await LinkAccountsManager.getLinkedAccountsStatus();
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
			navigation.navigate("Profile", { accountLinked: true });
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
	const handleChangeText = ({
		newValue,
		checkUserCredential = false,
		checkPassword = false,
		checkSMSCode = false,
	} = {}) => {
		var newCredentialsValidity = credentialsValidity;
		if (checkUserCredential) {
			setUserCredential(newValue);
			if (newValue.length > 0) {
				// user credential is valid
				newCredentialsValidity["userCredentialValidity"] = true;
				setCredentialsValidity(newCredentialsValidity);
			} else {
				// user credential is NOT valid
				newCredentialsValidity["userCredentialValidity"] = false;
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
		// If BOTH user credential and passwod are valid, enable button. Else, disbale button.
		if (Object.values(credentialsValidity).every((item) => item === true)) {
			setCredentialsDisableStatus(false);
		} else {
			setCredentialsDisableStatus(true);
		}
	};

	return (
		<DismissKeyboard>
			<SafeAreaView style={styles.mainContainer}>
				<KeyboardAvoidingView behavior="padding">
					<NativeBaseProvider>
						<View style={styles.header}>
							<Image
								style={styles.headerImage}
								source={require("../../assets/robinhood.png")}
							/>
							<AppText style={styles.headerText}>
								Link a Robinhood account.
							</AppText>
						</View>
						{institutionLogin == false ? (
							<>
								<AppText style={styles.instruction}>
									Log into your Robinhood brokerage account.
								</AppText>
								<TextInput
									placeholder="Username or Email"
									color={TEXT_COLOR}
									selectionColor={TEXT_COLOR}
									placeholderTextColor={LIGHT_GREY_COLOR}
									value={userCredential}
									onChangeText={(newValue) =>
										handleChangeText({
											newValue: newValue,
											checkUserCredential: true,
										})
									}
									style={styles.input}
									autoCapitalize="none"
									autoCorrect={false}
									keyboardType="email-address"
								/>
								<TextInput
									placeholder="Password"
									color={TEXT_COLOR}
									selectionColor={TEXT_COLOR}
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
								<AppText style={styles.instruction}>
									Enter the SMS code you received.
								</AppText>
								<TextInput
									style={styles.input}
									placeholder="Ex: 123456"
									color={TEXT_COLOR}
									selectionColor={TEXT_COLOR}
									placeholderTextColor={LIGHT_GREY_COLOR}
									onChangeText={(newValue) =>
										handleChangeText({ newValue: newValue, checkSMSCode: true })
									}
									keyboardType="number-pad"
									maxLength={6}
								/>
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
					</NativeBaseProvider>
				</KeyboardAvoidingView>
			</SafeAreaView>
		</DismissKeyboard>
	);
};

export default LinkAccount;

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		height: 75,
		marginTop: 25,
		marginBottom: 10,
	},
	headerImage: {
		width: 60,
		height: 60,
		resizeMode: "contain",
	},
	headerText: {
		fontSize: 16,
		fontWeight: "bold",
		marginLeft: 10,
	},
	input: {
		backgroundColor: MAIN_DIFFERENTIATOR_COLOR,
		paddingHorizontal: 15,
		paddingVertical: 10,
		borderRadius: 10,
		marginTop: 5,
	},
	errorMessage: {
		fontSize: 16,
		color: BAD_COLOR,
		paddingVertical: 10,
		marginTop: 30,
		marginHorizontal: 10,
	},
	buttonEnabled: {
		backgroundColor: MAIN_SECONDARY_COLOR,
		borderRadius: 30,
		height: 50,
		width: 170,
		margin: 15,
		justifyContent: "center",
		alignItems: "center",
		alignSelf: "center",
	},
	buttonDisabled: {
		backgroundColor: MAIN_SECONDARY_COLOR,
		borderRadius: 30,
		height: 50,
		width: 170,
		margin: 15,
		justifyContent: "center",
		alignItems: "center",
		opacity: 0.33,
		alignSelf: "center",
	},
	buttonText: {
		fontWeight: "700",
		fontSize: 16,
	},
	instruction: {
		alignSelf: "center",
		marginBottom: 10,
	},
});
