import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, TextInput, View, KeyboardAvoidingView, TouchableOpacity, Text } from 'react-native';
import { Context as AuthContext } from '../context/AuthContext';
import DismissKeyboard from "../components/DismissKeyboard";

const LoginScreen = ({ navigation }) => {
    const { state, login, clearErrorMessage } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            clearErrorMessage
        });

        return unsubscribe;
    }, [navigation]);

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
                        onChangeText={text => setUsername(text)}
                        style={styles.input}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    <TextInput
                        placeholder="Password"
                        placeholderTextColor="#c7c7c7"
                        value={password}
                        onChangeText={text => setPassword(text)}
                        style={styles.input}
                        autoCapitalize="none"
                        autoCorrect={false}
                        secureTextEntry={true}
                    />
                    {state.errorMessage
                        ? <Text style={styles.errorMessage}>{state.errorMessage}</Text>
                        : null}
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={() => login({ username, password })}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Log In</Text>
                    </TouchableOpacity>
                    <View style={styles.loginContainer}>
                        <Text style={styles.already}>Don't have an account?</Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('SignUp')}
                        >
                            <Text style={styles.logInNow}>Sign up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </DismissKeyboard>
    );
};

LoginScreen.navigationOptions = () => {
    return {
        headerShown: false,
        headerLeft: () => null
    };
};

export default LoginScreen;



//-----     Styles     -----/
//--------------------------/
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DEDBD5'
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
    errorMessage: {
        fontSize: 16,
        color: 'red',
        paddingVertical: 10,
        marginTop: 30,
        marginHorizontal: 10
    },
    loginContainer: {
        paddingVertical: 10,
        marginTop: 30,
        justifyContent: 'space-evenly',
        width: '110%',
        flexDirection: 'row',
    },
    already: {
        fontSize: 16,
        color: 'gray',
    },
    logInNow: {
        fontSize: 16,
        color: '#0782F9',
    },
    titleText: {
        fontSize: 22,
        color: '#5d5e61',
        padding: 5,
        alignSelf: 'center',
        marginBottom: 15
    }
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
