import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'

const PostDetailScreen = ({ navigation }) => {
    return (
        <View>
            <Text>PostDetailScreen</Text>
            <Button 
                title="Go to Portfolio Insight" 
                onPress = {() => navigation.navigate('Portfolio')}
            />
        </View>
    );
};

export default PostDetailScreen;

const styles = StyleSheet.create({});
