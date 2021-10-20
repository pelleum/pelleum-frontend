import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContext } from 'react-navigation';

const FeedScreen = ({ navigation }) => {
    return (
        <View>
            <Text>Feed Screen</Text>
            <Button 
                title="Go to Post Detail" 
                onPress = {() => navigation.navigate('feedPostFlow')}
            />
            <Button 
                title="Go to Thesis Detail" 
                onPress = {() => navigation.navigate('feedThesisFlow')}
            />
        </View>
    );
};

export default FeedScreen;

const styles = StyleSheet.create({});
