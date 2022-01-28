// Import Installed Libraries
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import AppText from '../components/AppText';
import { useDispatch } from 'react-redux';
import { logout } from "../redux/actions/AuthActions";

const SettingsScreen = ({ navigation }) => {

    const dispatch = useDispatch();
    const logOut = async () => {
        await SecureStore.deleteItemAsync('userObject');
        dispatch(logout());
    };

    return (
        <SafeAreaView forceInset={{ top: 'always' }}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("LinkedStatus")}
            >
                <AppText style={styles.buttonText}>Linked Accounts</AppText>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={logOut} 
            >
                <AppText style={styles.buttonText}>Log Out</AppText>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default SettingsScreen;

const styles = StyleSheet.create({
    button: {
        borderWidth: 0.5,
        borderColor: '#00A8FC',
        backgroundColor: '#dedfe3',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        padding: 8,
    },
});
