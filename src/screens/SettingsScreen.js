// Import Installed Libraries
import React, { useContext } from 'react';
import { StyleSheet, Text, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';

// Import Local Files
import AuthContext from '../context/AuthContext';


const SettingsScreen = () => {
    const { state, dispatch } = useContext(AuthContext);

    const logOut = async () => {
        await SecureStore.deleteItemAsync('token');
        dispatch({ type: 'LOG_OUT' });
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
