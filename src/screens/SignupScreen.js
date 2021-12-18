// Import Installed Libraries
import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    TextInput,
    View,
    KeyboardAvoidingView,
    TouchableOpacity,
    Text,
} from "react-native";
import { TextInputMask } from "react-native-masked-text";
import { Ionicons, Feather } from "@expo/vector-icons";
import { HStack, NativeBaseProvider } from "native-base";
import * as SecureStore from 'expo-secure-store';

// Import Local Files
import pelleumClient from "../api/PelleumClient";
import DismissKeyboard from "../components/DismissKeyboard";

import { useSelector, useDispatch } from 'react-redux';
import { login, authError, clearAuthError } from "../redux/actions";

// Signup Screen Functional Component
const SignupScreen = ({ navigation }) => {
    // State Management
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [username, setUsername] = useState("");
    //TODO: need to update variables below to emailValididty, usernameValidity, etc.
    const [inputValidity, setInputValidity] = useState({
        email: false,
        passwordLength: false,
        passwordCharacters: false,
        username: false,
        birthDate: false,
    });
    const [disableStatus, setDisableStatus] = useState(true);
    // Redux
    const { errorMessage } = useSelector(state => state.authReducer);
    const dispatch = useDispatch();

    const signUp = async ({ email, username, password }) => {

        let response = await pelleumClient({
            method: "post",
            url: "/public/auth/users",
            data: { email, username, password }
        });

        if (response.status == 201) {
            await SecureStore.setItemAsync('userToken', response.data.access_token);
            dispatch(login());

        } else {
            dispatch(authError(response.data.detail));
            console.log(err.response.status);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            const clearErrorMessage = () => dispatch(clearAuthError());
            clearErrorMessage();
        });
        return unsubscribe;
    }, [navigation]);

    // Input Validation
    const emailValidation = (emailText) => {
        // Email format
        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
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
        let dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
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
        //TODO: need to change variables below to checkEmail, checkPassword, etc.
        email = false,
        password = false,
        username = false,
        birthDate = false,
    } = {}) => {
        var newInputValidity = inputValidity;

        if (email) {
            setEmail(newValue);
            if (emailValidation(newValue)) {
                newInputValidity["email"] = true;
                setInputValidity(newInputValidity);
            } else {
                newInputValidity["email"] = false;
                setInputValidity(newInputValidity);
            }
        }
        if (password) {
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

        if (username) {
            setUsername(newValue);
            if (usernameValidation(newValue)) {
                newInputValidity["username"] = true;
                setInputValidity(newInputValidity);
            } else {
                newInputValidity["username"] = false;
                setInputValidity(newInputValidity);
            }
        }

        if (birthDate) {
            setBirthDate(newValue);
            if (dateValidation(newValue)) {
                newInputValidity["birthDate"] = true;
                setInputValidity(newInputValidity);
            } else {
                newInputValidity["birthDate"] = false;
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
                <KeyboardAvoidingView
                    style={styles.container}
                //behavior="padding"       //ensures text fields do not get blocked by keyboard on iOS
                >
                    <Text style={styles.titleText}>Welcome to Pelleum!</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="Email"
                            placeholderTextColor="#c7c7c7"
                            value={email}
                            onChangeText={(newValue) =>
                                handleChangeText({ newValue: newValue, email: true })
                            }
                            style={styles.input}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        <TextInput
                            placeholder="Username"
                            placeholderTextColor="#c7c7c7"
                            value={username}
                            onChangeText={(newValue) =>
                                handleChangeText({ newValue: newValue, username: true })
                            }
                            style={styles.input}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor="#c7c7c7"
                            value={password}
                            onChangeText={(newValue) =>
                                handleChangeText({ newValue: newValue, password: true })
                            }
                            style={styles.input}
                            autoCapitalize="none"
                            autoCorrect={false}
                            secureTextEntry={true}
                        />
                        <TextInputMask
                            placeholder="MM/DD/YYYY"
                            placeholderTextColor="#c7c7c7"
                            type={"datetime"}
                            style={styles.input}
                            options={{ format: "MM/DD/YYYY" }}
                            value={birthDate}
                            onChangeText={(newValue) =>
                                handleChangeText({ newValue: newValue, birthDate: true })
                            }
                        />
                        {errorMessage
                        ? <Text style={styles.errorMessage}>{errorMessage}</Text>
                        : null}
                    </View>
                    <View style={styles.validationMessageView}>
                        <HStack alignItems="center">
                            {!emailValidation(email) ? (
                                <Feather name="x-circle" size={24} color="red" />
                            ) : (
                                <Ionicons name="shield-checkmark" size={24} color="green" />
                            )}
                            <Text style={styles.validationMessageText}>Email is valid.</Text>
                        </HStack>
                        <HStack alignItems="center">
                            {!usernameValidation(username) ? (
                                <Feather name="x-circle" size={24} color="red" />
                            ) : (
                                <Ionicons name="shield-checkmark" size={24} color="green" />
                            )}
                            <Text style={styles.validationMessageText}>
                                Username is valid.
                            </Text>
                        </HStack>
                        <HStack alignItems="center">
                            {!passwordValidation({
                                passwordText: password,
                                checkLength: true,
                            }) ? (
                                <Feather name="x-circle" size={24} color="red" />
                            ) : (
                                <Ionicons name="shield-checkmark" size={24} color="green" />
                            )}
                            <Text style={styles.validationMessageText}>
                                Password must be at least 8 characters long.
                            </Text>
                        </HStack>
                        <HStack>
                            {!passwordValidation({
                                passwordText: password,
                                checkCharacters: true,
                            }) ? (
                                <Feather name="x-circle" size={24} color="red" />
                            ) : (
                                <Ionicons name="shield-checkmark" size={24} color="green" />
                            )}
                            <Text style={styles.validationMessageText}>
                                Password must contain at least one uppercase character, one
                                lowercase character, one numerical character, and one special
                                character.
                            </Text>
                        </HStack>
                        <HStack alignItems="center">
                            {!dateValidation(birthDate) ? (
                                <Feather name="x-circle" size={24} color="red" />
                            ) : (
                                <Ionicons name="shield-checkmark" size={24} color="green" />
                            )}
                            <Text style={styles.validationMessageText}>
                                Birtdate is valid, and you are at least 18 years old.
                            </Text>
                        </HStack>
                    </View>
                    <TouchableOpacity
                        onPress={() => signUp({ email, username, password })}
                        style={disableStatus ? styles.buttonDisabled : styles.buttonEnabled}
                        disabled={disableStatus}
                    >
                        <Text style={styles.buttonText}>Create Account</Text>
                    </TouchableOpacity>
                    <HStack style={styles.alreadyHaveAccount}>
                        <Text style={styles.dontHave}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                            <Text style={styles.LoginText}>Log in</Text>
                        </TouchableOpacity>
                    </HStack>
                </KeyboardAvoidingView>
            </DismissKeyboard>
        </NativeBaseProvider>
    );
};

export default SignupScreen;

//-----     Styles     -----/
//--------------------------/
const styles = StyleSheet.create({
    container: {
        flex: 1, //this ensures that the container (view) fills up max vertical space
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#DEDBD5",
    },
    inputContainer: {
        width: "80%",
    },
    input: {
        backgroundColor: "white",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    buttonContainer: {
        justifyContent: "center",
        alignItems: "center",
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
    signupContainer: {
        paddingVertical: 10,
        marginTop: 30,
        justifyContent: "space-evenly",
        width: "110%",
        flexDirection: "row",
    },
    dontHave: {
        fontSize: 16,
        color: "gray",
    },
    LoginText: {
        fontSize: 16,
        color: "#00A8FC",
    },
    titleText: {
        fontSize: 22,
        color: "#5d5e61",
        padding: 5,
        alignSelf: "center",
        marginBottom: 15,
    },
    validationMessageView: {
        marginHorizontal: 50,
        marginVertical: 20,
    },
    validationMessageText: {
        padding: 0,
    },
    alreadyHaveAccount: {
        position: "absolute",
        bottom: 100,
    },
});
