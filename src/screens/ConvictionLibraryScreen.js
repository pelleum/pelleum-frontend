import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { ThesisBox } from '../components/ThesisBox';
import pelleumClient from "../api/clients/PelleumClient";

const ConvictionLibraryScreen = ({ navigation, route }) => {
    //State Management
    const [thesesArray, setThesesArray] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const asset = route.params.asset ? route.params.asset : null;

    //This is here just to get some theses for the time being...
    const getTheses = async () => {
        const authorizedResponse = await pelleumClient({
            method: "get",
            url: '/public/theses/retrieve/many',
            queryParams: { asset_symbol: asset }
        });

        if (authorizedResponse.status == 200) {
            setThesesArray(authorizedResponse.data.records.theses);
        } else {
            setErrorMessage("There was an error obtaining theses from the backend.");
        }
    };

    //on first render
    useEffect(() => {
        getTheses();
    }, []);

    return (
        <View style={styles.mainContainer}>
            <Text style={styles.title}>My conviction Library for {asset}</Text>
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

export default ConvictionLibraryScreen

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
})
