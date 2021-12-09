import React, { useContext } from 'react';
import { StyleSheet, Text, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthContext from '../context/AuthContext';

const SettingsScreen = () => {
    const { state, dispatch } = useContext(AuthContext);

    return (
        <SafeAreaView forceInset={{ top: 'always' }}>
            <Text>Settings Screen</Text>
            <Button 
                title="Log Out" 
                // onPress={logOut} 
                onPress={() => console.log('logged out')}
            />
        </SafeAreaView>
    );
};

export default SettingsScreen;

const styles = StyleSheet.create({
    // logoutButton: {
    //     padding: 10
    // }
});
