import React, { useState, useEffect } from 'react'
import {
    StyleSheet,
    Text,
    KeyboardAvoidingView,
    View,
    TextInput,
    Image,
    TouchableOpacity
} from 'react-native'
import DismissKeyboard from '../components/DismissKeyboard';
import { NativeBaseProvider } from 'native-base';
import accountConnectClient from '../api/AccountConnectClient';

const LinkAccount = ({ navigation }) => {
    const [userCredential, setUserCredential] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [sms_code, setSMSCode] = useState('');
    const [institutionLogin, setInstitutionLogin] = useState(false);
    const [credentialsDisableStatus, setCredentialsDisableStatus] = useState(true);
    const [smsDisableStatus, setSMSDisableStatus] = useState(true);
    const [credentialsValidity, setCredentialsValidity] = useState({ userCredentialValidity: false, passwordValidity: false });

    const robinhood_ID = 'd75e2cf4-a4ee-4869-88c3-14bfadf7c196';

    const logIn = async () => {
        const response = await accountConnectClient({
            method: "post",
            url: `/public/institutions/login/${robinhood_ID}`,
            data: { username: userCredential, password: password }
        });

        if (response.status == 200) {
            setInstitutionLogin(true);
            setErrorMessage('')
            console.log('/n Successfull institution login!');
        } else {
            console.log("\nResponse: ", response.data)
            if (response.detail = "Robinhood API Error: Unable to log in with provided credentials.") {
                setErrorMessage('Unable to log in with provided credentials.');
            } else {
                setErrorMessage('There was an error logging into your account.');
            }
        }
    };

    const verifyAccount = async (sms_code) => {
        const response = await accountConnectClient({
            method: "post",
            url: `/public/institutions/login/${robinhood_ID}/verify`,
            data: { sms_code }
        });

        if (response.status == 201) {
            setErrorMessage('')
            console.log('/n Successfull account verification!');
            navigation.navigate("Profile", { accountLinked: true })
        } else {
            console.log("\nResponse: ", response.data)
            if (response.detail = "Robinhood API Error: Please enter a valid code.") {
                setErrorMessage('Invalid code. Please enter a valid code.');
            } else {
                setErrorMessage('There was an error validating your account.');
                console.log('/n There was an error validating your account.');
            }
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            setErrorMessage('');
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
            <KeyboardAvoidingView style={styles.mainContainer} behavior="padding" >
                <NativeBaseProvider>
                    <View style={styles.header}>
                        <Image
                            style={styles.headerImage}
                            source={require("../../assets/robinhood.png")}
                        />
                        <Text style={styles.headerText}>Link a Robinhood account.</Text>
                    </View>
                    {institutionLogin == false ? (
                        <>
                            <Text style={styles.instruction}>Log into your Robinhood brokerage account.</Text>
                            <TextInput
                                placeholder="Username or Email"
                                placeholderTextColor="#c7c7c7"
                                value={userCredential}
                                onChangeText={(newValue) =>
                                    handleChangeText({ newValue: newValue, checkUserCredential: true })
                                }
                                style={styles.input}
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="email-address"
                            />
                            <TextInput
                                placeholder="Password"
                                placeholderTextColor="#c7c7c7"
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
                                <Text style={styles.errorMessage}>{errorMessage}</Text>
                            ) : null}
                            <TouchableOpacity
                                onPress={() => logIn()}
                                style={credentialsDisableStatus ? styles.buttonDisabled : styles.buttonEnabled}
                                disabled={credentialsDisableStatus}
                            >
                                <Text style={styles.buttonText}>Log In</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <Text style={styles.instruction}>Enter the SMS code you received.</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ex: 123456"
                                onChangeText={(newValue) =>
                                    handleChangeText({ newValue: newValue, checkSMSCode: true })
                                }
                                keyboardType="number-pad"
                                maxLength={6}
                            />
                            {errorMessage ? (
                                <Text style={styles.errorMessage}>{errorMessage}</Text>
                            ) : null}
                            <TouchableOpacity
                                onPress={() => verifyAccount(sms_code)}
                                style={smsDisableStatus ? styles.buttonDisabled : styles.buttonEnabled}
                                disabled={smsDisableStatus}
                            >
                                <Text style={styles.buttonText}>Verify Account</Text>
                            </TouchableOpacity>
                        </>
                    )}

                </NativeBaseProvider>
            </KeyboardAvoidingView>
        </DismissKeyboard>
    );
};

export default LinkAccount;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#DEDBD5",
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 75,
        marginTop: 25,
        marginBottom: 10,
    },
    headerImage: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    input: {
        backgroundColor: "white",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    errorMessage: {
        fontSize: 16,
        color: "red",
        paddingVertical: 10,
        marginTop: 30,
        marginHorizontal: 10,
    },
    buttonEnabled: {
		backgroundColor: "#00A8FC",
		borderRadius: 30,
		height: 50,
		width: 170,
		margin: 15,
		justifyContent: "center",
		alignItems: "center",
        alignSelf: 'center',
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
        alignSelf: 'center',
	},
    buttonText: {
        color: "white",
        fontWeight: "700",
        fontSize: 16,
    },
    instruction: {
        alignSelf: 'center',
        marginBottom: 10,
    },
});
