// Import Installed Libraries
import React from 'react';
import { StyleSheet, Text, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';

// Redux
import { useDispatch } from 'react-redux';
import { logout } from "../redux/actions";

const SettingsScreen = () => {

    const dispatch = useDispatch();
    const logOut = async () => {
        await SecureStore.deleteItemAsync('userObject');
        dispatch(logout());
    };

    return (
        <SafeAreaView forceInset={{ top: 'always' }}>
            <Text>Settings Screen</Text>
            <Button 
                title="Log Out" 
                onPress={logOut} 
            />
        </SafeAreaView>
    );
};

export default SettingsScreen;

const styles = StyleSheet.create({});
