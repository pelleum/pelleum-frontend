import React from 'react'
import { StyleSheet, View } from 'react-native';
import { MAIN_BACKGROUND_COLOR } from '../styles/Colors';
import AppText from '../components/AppText';

const LoadingScreen = () => {
    return (
        <View style={styles.container}>
            <AppText style={styles.loadText}>Welcome to Pelleum</AppText>
        </View>
    );
};

export default LoadingScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: MAIN_BACKGROUND_COLOR,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadText: {
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 25,
    },
});