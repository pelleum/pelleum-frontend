import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const LoadingScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.loadText}>Pelleum</Text>
        </View>
    );
;}

export default LoadingScreen;

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