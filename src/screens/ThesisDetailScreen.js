import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'

const ThesisDetailScreen = ({ navigation }) => {
    return (
        <View>
            <Text>Thesis Detail Screen</Text>
            <Button 
                title="Go to Portfolio Insight" 
                onPress = {() => navigation.navigate('PortfolioInsight')}
            />
        </View>
    );
};

export default ThesisDetailScreen;

const styles = StyleSheet.create({});
