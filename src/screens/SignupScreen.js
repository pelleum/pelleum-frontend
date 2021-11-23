import React, { useState, useContext } from 'react';
import { StyleSheet, TextInput, View, KeyboardAvoidingView, TouchableOpacity, Text } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { Context as AuthContext } from '../context/AuthContext';
import { NavigationEvents } from 'react-navigation';
import DismissKeyboard from "../components/DismissKeyboard";
import colorScheme from "../components/ColorScheme";

const SignupScreen = ({ navigation }) => {
    const { state, signup, clearErrorMessage } = useContext(AuthContext);
    const [dateBirth, setDateBirth] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <DismissKeyboard>
            <KeyboardAvoidingView
                style={styles.container}
            //behavior="padding"       //ensures text fields do not get blocked by keyboard on iOS
            >
                <NavigationEvents onWillFocus={clearErrorMessage} />
                <Text style={styles.titleText}>Create a Pelleum account!</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Email"
                        placeholderTextColor="#c7c7c7"
                        value={email}
                        onChangeText={text => setEmail(text)}
                        style={styles.input}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
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
                    <TextInputMask
                        placeholder="MM/DD/YYYY"
                        placeholderTextColor="#c7c7c7"
                        type={'datetime'}
                        style={styles.input}
                        options={{ format: 'MM/DD/YYYY' }}
                        value={dateBirth}
                        onChangeText={date => setDateBirth(date)}
                    />
                    {state.errorMessage
                        ? <Text style={styles.errorMessage}>{state.errorMessage}</Text>
                        : null}
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={() => signup({ email, username, password })}
                        style={[styles.button, styles.buttonOutline]}
                    >
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>
                    <View style={styles.signupContainer}>
                        <Text style={styles.dontHave}>Already have an account?</Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Login')}
                        >
                            <Text style={styles.signUpNow}>Log in</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </DismissKeyboard>
    );
};

SignupScreen.navigationOptions = () => {
    return {
        headerShown: false
    };
};

export default SignupScreen;



//-----     Styles     -----/
//--------------------------/
const styles = StyleSheet.create({
    container: {
        flex: 1, //this ensures that the container (view) fills up max vertical space
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DEDBD5',
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
        marginTop: 30
    },
    button: {
        backgroundColor: '#0782F9',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center'
    },
    buttonOutline: {
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: '#0782F9',
        borderWidth: 2
    },
    buttonText: {
        color: '#0782F9',
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
    signupContainer: {
        paddingVertical: 10,
        marginTop: 30,
        justifyContent: 'space-evenly',
        width: '110%',
        flexDirection: 'row',
    },
    dontHave: {
        fontSize: 16,
        color: 'gray',
    },
    signUpNow: {
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