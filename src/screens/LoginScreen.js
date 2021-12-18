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
import * as SecureStore from "expo-secure-store";

// Import Local Files
import pelleumClient from "../api/PelleumClient";
import DismissKeyboard from "../components/DismissKeyboard";

import { useSelector, useDispatch } from 'react-redux';
import { login, authError, clearAuthError } from "../redux/actions";

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

	const logIn = async ({ username, password }) => {
		var qs = require("query-string");
        let response = await pelleumClient({
            method: "post",
            url: "/public/auth/users/login",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            data: qs.stringify({ username, password })
        });

        if (response.status == 200) {
            await SecureStore.setItemAsync("userToken", response.data.access_token);
            dispatch(login());
        } else {
            dispatch(authError(response.data.detail));
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
				<Text style={styles.titleText}>Log into your Pelleum account!</Text>
				<View style={styles.inputContainer}>
					<TextInput
						placeholder="Username"
						placeholderTextColor="#c7c7c7"
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
				</View>
				<View style={styles.buttonContainer}>
					<TouchableOpacity
						onPress={() => logIn({ username, password })}
						style={disableStatus ? styles.buttonDisabled : styles.buttonEnabled}
						disabled={disableStatus}
					>
						<Text style={styles.buttonText}>Log In</Text>
					</TouchableOpacity>
					<View style={styles.loginContainer}>
						<Text style={styles.already}>Don't have an account?</Text>
						<TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
							<Text style={styles.logInNow}>Sign up</Text>
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
		color: "#5d5e61",
		padding: 5,
		alignSelf: "center",
		marginBottom: 15,
	},
});

/*

import React, {useState} from 'react';
import { StyleSheet, TextInput, View, KeyboardAvoidingView, TouchableOpacity, Text } from 'react-native';
import pelleumPublic from '../api/pelleumPublic';

const SignupScreen = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = () => {
        pelleumPublic.post('/public/auth/users', {
            "email": "johndoe@example.com",
            "username": "johndoe",
            "password": "Examplepas$word"
        })
        .then()
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"       //ensures text fields do not get blocked by keyboard
        >
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    style={styles.input}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <TextInput
                    placeholder="Username"
                    value={username}
                    onChangeText={text => setUsername(text)}
                    style={styles.input}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={text => setPassword(text)}
                    style={styles.password}
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={true}
                />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    //onPress= {() => { }}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Log In</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    //onPress= {() => { }}
                    style={[styles.button, styles.buttonOutline]}
                >
                    <Text style={styles.buttonOutlineText}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default SignupScreen;




//-----     Styles     -----/
//--------------------------/
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#dedbd5'
    },
    inputContainer: {
        width: '80%'
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5
    },
    password: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40
    },
    button: {
        backgroundColor: '#0782F9',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16
    },
    buttonOutline: {
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: '#0782F9',
        borderWidth: 2
    },
    buttonOutlineText: {
        color: '#0782F9',
        fontWeight: '700',
        fontSize: 16
    }
});

*/
