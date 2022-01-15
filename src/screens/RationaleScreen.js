import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { ThesisBox } from '../components/ThesisBox';
import RationalesManager from '../managers/RationalesManager';

const ConvictionLibraryScreen = ({ navigation, route }) => {
    //State Management
    const [thesesArray, setThesesArray] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');   // Migrate to Redux

    const asset = route.params.asset ? route.params.asset : null;
    const userId = route.params.userId ? route.params.userId : null;

    const getRationales = async () => {
        const retrievedRationales = await RationalesManager.retrieveRationales({ user_id: userId, asset_symbol: asset });
        if (retrievedRationales) {
            setThesesArray(retrievedRationales.records.theses);
        } else {
            setErrorMessage("There was an error obtaining theses from the backend.");
        }
    }

    //on first render
    useEffect(() => {
        getRationales();
    }, []);

    return (
        <View style={styles.mainContainer}>
            <Text style={styles.title}>{asset} Rationale Library</Text>
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
