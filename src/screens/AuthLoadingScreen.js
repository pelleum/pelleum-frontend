import React, { useEffect, useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Context as AuthContext } from '../context/AuthContext';

const AuthLoadingScreen = () => {
    const { tryLocalLogin } = useContext(AuthContext);

    useEffect(() => {
        tryLocalLogin();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.loadText}>Welcome to Pelleum</Text>
        </View>
    );
};

export default AuthLoadingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DEDBD5'
    },
    loadText: {
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 25
    },
});