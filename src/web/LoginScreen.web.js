// Import Installed Libraries
import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    TextInput,
    View,
    TouchableOpacity,
} from "react-native";
// import { useAnalytics } from '@segment/analytics-react-native';

// Import Local Files
import { useSelector, useDispatch } from "react-redux";
import { clearAuthError } from "../redux/actions/AuthActions";
import UserManager from "../managers/UserManager";
import AppText from "../components/AppText";
import {
    TEXT_COLOR,
    LIGHT_GREY_COLOR,
    MAIN_SECONDARY_COLOR,
    BAD_COLOR,
    WEB_MAIN_DIFFERENTIATOR_COLOR,
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

    // Segment Tracking
    // const { identify } = useAnalytics();

    // Clear error message when navigating to/from LoginScreen
    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            const clearErrorMessage = () => dispatch(clearAuthError());
            clearErrorMessage();
        });
        return unsubscribe;
    }, [navigation]);

    // Get age for Segment Identify call
    const getAge = dateOfBirth => Math.floor((new Date() - new Date(dateOfBirth).getTime()) / 3.15576e+10);

    // Triggered when Log In button is pressed
    const handleLogin = async (username, password) => {
        // 1. Attempt to log in
        const response = await UserManager.login({ username, password })

        // // 2. If account login was successful, identify the user
        // if (response.status == 200) {
        // 	identify(response.data.user_id, {
        // 		email: response.data.email,
        // 		username: response.data.username,
        // 		age: getAge(response.data.birthdate),
        // 		birthday: response.data.birthdate,
        // 		gender: response.data.gender,
        // 		createdAt: response.data.created_at,
        // 		platform: Platform.OS,
        // 		plan: "basic",
        // 	});
        // } else {
        // 	// login was unsuccessful
        // 	// do not identify user
        // };
    };

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
        <View style={styles.container}>
            <View style={{ width: "100%", alignItems: "center" }}>
                <AppText style={styles.titleText}>Log In</AppText>
                <View style={styles.inputContainer}>
                    <TextInput
                        selectionColor={MAIN_SECONDARY_COLOR}
                        placeholder="Username"
                        textContentType="username"
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
                        selectionColor={MAIN_SECONDARY_COLOR}
                        placeholder="Password"
                        textContentType="password"
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
                    onPress={() => handleLogin(username, password)}
                    style={disableStatus ? styles.buttonDisabled : styles.buttonEnabled}
                    disabled={disableStatus}
                >
                    <AppText style={styles.buttonText}>Log In</AppText>
                </TouchableOpacity>
            </View>
            <View style={styles.signupInsteadContainer}>
                <AppText style={styles.signupInsteadText}>Don't have an account?</AppText>
                <TouchableOpacity onPress={() => navigation.navigate("SignupScreen")}>
                    <AppText style={styles.signupInsteadButton}>Sign up</AppText>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default LoginScreen

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
        backgroundColor: WEB_MAIN_DIFFERENTIATOR_COLOR,
        fontSize: 14,
        height: 37,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginTop: 5,
        outlineStyle: 'none', //removes input outline in web browsers
    },
    buttonEnabled: {
        backgroundColor: MAIN_SECONDARY_COLOR,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 30,
        height: 50,
        width: 170,
        marginTop: 35,
    },
    buttonDisabled: {
        backgroundColor: MAIN_SECONDARY_COLOR,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 30,
        height: 50,
        width: 170,
        marginTop: 35,
        opacity: 0.33,
    },
    buttonText: {
        color: TEXT_COLOR,
        fontWeight: "700",
        fontSize: 16,
    },
    errorMessage: {
        fontSize: 16,
        marginTop: 30,
        alignSelf: "center",
        color: BAD_COLOR,
    },
    signupInsteadContainer: {
        marginTop: 75,
        alignSelf: "center",
        alignItems: "center",
        flexDirection: "row",
    },
    signupInsteadText: {
        fontSize: 16,
        color: LIGHT_GREY_COLOR,
    },
    signupInsteadButton: {
        fontSize: 16,
        color: MAIN_SECONDARY_COLOR,
        padding: 10,
    },
    titleText: {
        alignSelf: "center",
        color: TEXT_COLOR,
        fontSize: 22,
        padding: 5,
        marginBottom: 15,
    },
})