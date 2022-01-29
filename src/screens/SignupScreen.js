// Import Installed Libraries
import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    TextInput,
    View,
    KeyboardAvoidingView,
    TouchableOpacity,
} from "react-native";
import { TextInputMask } from "react-native-masked-text";
import { Ionicons, Feather } from "@expo/vector-icons";
import { HStack, NativeBaseProvider } from "native-base";
import { useSelector, useDispatch } from 'react-redux';

// Import Local Files
import DismissKeyboard from "../components/DismissKeyboard";
import { clearAuthError } from "../redux/actions/AuthActions";
import UserManager from "../managers/UserManager";
import AppText from "../components/AppText";
import { TEXT_COLOR, MAIN_DIFFERENTIATOR_COLOR } from "../styles/Colors";

// Signup Screen Functional Component
const SignupScreen = ({ navigation }) => {
    // State Management
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [username, setUsername] = useState("");
    const [inputValidity, setInputValidity] = useState({
        emailValidity: false,
        passwordLength: false,
        passwordCharacters: false,
        usernameValidity: false,
        birthDateValidity: false,
    });
    const [disableStatus, setDisableStatus] = useState(true);
    // Redux
    const { errorMessage } = useSelector(state => state.authReducer);
    const dispatch = useDispatch();

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
                <KeyboardAvoidingView
                    style={styles.container}
                //behavior="padding"       //ensures text fields do not get blocked by keyboard on iOS
                >
                    <AppText style={styles.titleText}>Welcome to Pelleum!</AppText>
                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="Email"
                            placeholderTextColor={TEXT_COLOR}
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
                            placeholder="Username"
                            placeholderTextColor={TEXT_COLOR}
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
                            placeholderTextColor={TEXT_COLOR}
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
                            placeholder="MM/DD/YYYY"
                            placeholderTextColor={TEXT_COLOR}
                            type={"datetime"}
                            style={styles.input}
                            options={{ format: "MM/DD/YYYY" }}
                            value={birthDate}
                            onChangeText={(newValue) =>
                                handleChangeText({ newValue: newValue, checkBirthDate: true })
                            }
                        />
                        {errorMessage
                        ? <AppText style={styles.errorMessage}>{errorMessage}</AppText>
                        : null}
                    </View>
                    <View style={styles.validationMessageView}>
                        <HStack alignItems="center">
                            {!emailValidation(email) ? (
                                <Feather name="x-circle" size={24} color="red" />
                            ) : (
                                <Ionicons name="shield-checkmark" size={24} color="green" />
                            )}
                            <AppText style={styles.validationMessageText}>Email is valid.</AppText>
                        </HStack>
                        <HStack alignItems="center">
                            {!usernameValidation(username) ? (
                                <Feather name="x-circle" size={24} color="red" />
                            ) : (
                                <Ionicons name="shield-checkmark" size={24} color="green" />
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
                                <Feather name="x-circle" size={24} color="red" />
                            ) : (
                                <Ionicons name="shield-checkmark" size={24} color="green" />
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
                                <Feather name="x-circle" size={24} color="red" />
                            ) : (
                                <Ionicons name="shield-checkmark" size={24} color="green" />
                            )}
                            <AppText style={styles.validationMessageText}>
                                Password must contain at least one uppercase character, one
                                lowercase character, one numerical character, and one special
                                character.
                            </AppText>
                        </HStack>
                        <HStack alignItems="center">
                            {!dateValidation(birthDate) ? (
                                <Feather name="x-circle" size={24} color="red" />
                            ) : (
                                <Ionicons name="shield-checkmark" size={24} color="green" />
                            )}
                            <AppText style={styles.validationMessageText}>
                                Birtdate is valid, and you are at least 18 years old.
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
                    <HStack style={styles.alreadyHaveAccount}>
                        <AppText style={styles.dontHave}>Already have an account? </AppText>
                        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                            <AppText style={styles.LoginText}>Log in</AppText>
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
    },
    inputContainer: {
        width: "80%",
    },
    input: {
        backgroundColor: MAIN_DIFFERENTIATOR_COLOR,
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
        color: TEXT_COLOR,
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
