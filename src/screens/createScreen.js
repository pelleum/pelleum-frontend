import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'

const createScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text>What is a feed post?</Text>
            <TouchableOpacity 
                style={styles.createPostButton}
                onPress={() => {navigation.navigate('createPost')}}
            >
                <Text style={styles.createPostText}>Create a Feed Post</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={styles.createThesisButton} 
                onPress={() => {navigation.navigate('createThesis')}}
            >
                <Text style={styles.createThesisText}>Create a Thesis</Text>
            </TouchableOpacity>
            <Text>What is a thesis?</Text>
        </View>
    );
};

export default createScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1, //this ensures that the container (view) fills up max vertical space
        justifyContent: 'center',
        alignItems: 'center',
    },
    createPostButton: {
        backgroundColor: '#0782F9',
        width: '60%',
        padding: 15,
        borderRadius: 10,
        borderWidth: 2,
        marginVertical: 10,
        borderColor: '#0782F9',
        alignItems: 'center'
    },
    createThesisButton: {
        backgroundColor: 'white',
        width: '60%',
        padding: 15,
        borderRadius: 10,
        borderWidth: 2,
        marginVertical: 10,
        borderColor: '#0782F9',
        alignItems: 'center'
    },
    createPostText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    },
    createThesisText: {
        color: '#0782F9',
        fontSize: 16,
        fontWeight: 'bold'
    }
});
