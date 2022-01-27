import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import ThesesManager from "../managers/ThesesManager";
import ThesisBox from '../components/ThesisBox';

const AuthoredThesesScreen = ({ navigation, route }) => {
    const [thesesArray, setThesesArray] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');   // Migrate to Redux

    const userId = route.params.userId ? route.params.userId : null;

    const getAuthoredTheses = async () => {
        const retrievedTheses = await ThesesManager.getTheses( { user_id: userId } );
        if (retrievedTheses) {
            setThesesArray(retrievedTheses.records.theses);
        } else {
            setErrorMessage("There was an error obtaining theses from the backend.");
        };
    };

        //on first render
        useEffect(() => {
            getAuthoredTheses();
        }, []);

    return (
        <View style={styles.mainContainer}>
            <Text style={styles.title}>My Authored Theses</Text>
            {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
            <FlatList
                data={thesesArray}
                keyExtractor={(item) => item.thesis_id}
                renderItem={({ item }) => {
                    return (
                        <ThesisBox
                            item={item}
                            nav={navigation}
                        />
                    );
                }}
            >
            </FlatList>
        </View>
    );
};

export default AuthoredThesesScreen;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        alignSelf: "center",

    },
    error: {
        color: 'red',
        marginTop: 15,
        marginBottom: 25,
        fontSize: 14,
        alignSelf: "center",
    },
});
