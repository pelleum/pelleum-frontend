import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'

const ProfileScreen = ({ navigation }) => {
    return (
        <View>
            <Text>Profile Screen</Text>
            <Button 
                title="Go to Post Detail" 
                onPress = {() => navigation.navigate('feedPostFlow')}
            />
            <Button 
                title="Go to Thesis Detail" 
                onPress = {() => navigation.navigate('feedThesisFlow')}
            />
            <Button 
                title="Go to Account Settings" 
                onPress = {() => navigation.navigate('Account')}
            />
        </View>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
