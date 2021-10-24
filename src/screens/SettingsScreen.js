import React, { useContext } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Context as AuthContext } from '../context/AuthContext';

const SettingsScreen = () => {
    const { logout } = useContext(AuthContext);

    return (
        <SafeAreaView forceInset={{ top: 'always' }}>
            <Text>Settings Screen</Text>
            <Button 
                title="Log Out" 
                onPress={logout} 
            />
        </SafeAreaView>
    );
};

export default SettingsScreen;

const styles = StyleSheet.create({
    logoutButton: {
        padding: 10
    }
});
