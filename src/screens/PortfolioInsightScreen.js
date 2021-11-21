import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const PortfolioInsightScreen = () => {
    return (
        <View>
            <Text>Portfolio Insight Screen</Text>
        </View>
    );
};

PortfolioInsightScreen.navigationOptions = () => {
    return {
        headerShown: false,
    };
};

export default PortfolioInsightScreen;

const styles = StyleSheet.create({});
