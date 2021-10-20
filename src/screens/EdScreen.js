import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'

const EdScreen = ({ navigation }) => {
    return (
        <View>
            <Text>Education Screen</Text>
            <Button 
                title="Go to Blog" 
                onPress = {() => navigation.navigate('Blog')}
            />
        </View>
    );
};

export default EdScreen;

const styles = StyleSheet.create({});
