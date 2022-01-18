import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Animated, TouchableOpacity } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { ThesisBox } from '../components/ThesisBox';
import RationalesManager from '../managers/RationalesManager';

const RationaleScreen = ({ navigation, route }) => {
    //State Management
    const [rationaleArray, setRationaleArray] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');   // Migrate to Redux
    const [refreshFlatlist, setRefreshFlatList] = useState(false);

    const asset = route.params.asset ? route.params.asset : null;
    const userId = route.params.userId ? route.params.userId : null;
    const disableRemoveRationale = route.params.disableRemoveRationale ? route.params.disableRemoveRationale : false;

    const getRationales = async () => {
        const retrievedRationales = await RationalesManager.retrieveRationales({ user_id: userId, asset_symbol: asset });
        if (retrievedRationales) {
            setRationaleArray(retrievedRationales.records.rationales);
        } else {
            setErrorMessage("There was an error obtaining theses from the backend.");
        }
    };

    const deleteRationale = async (item) => {
        responseStatus = await RationalesManager.removeRationale(item);
        if (responseStatus) {
            if (responseStatus == 204) {
                const rationaleArrayCopy = rationaleArray;
                const index = rationaleArrayCopy.findIndex(rationale => rationale.thesis_id === item.thesis_id);
                if (index > -1) {
                    rationaleArrayCopy.splice(index, 1);
                    setRationaleArray(rationaleArrayCopy);
                    setRefreshFlatList(!refreshFlatlist)
                };
            };
        };
    };

    const swipeRight = (item) => {
        return (
            <Animated.View style={{ backgroundColor: '#cc0000', width: "30%", justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity
                    style={{ paddingVertical: '50%', paddingHorizontal: '7%' }}
                    onPress={() => deleteRationale(item)}
                >
                    <Animated.Text style={{ fontSize: 16, fontWeight: 'bold' }}>REMOVE</Animated.Text>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    //on first render
    useEffect(() => {
        getRationales();
    }, []);

    return (
        <View style={styles.mainContainer}>
            <Text style={styles.title}>{asset} Rationale Library</Text>
            {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
            <FlatList
                data={rationaleArray}
                //maybe we should use rationale_id as the key extractor for the RationaleScreen only
                keyExtractor={(item) => item.thesis_id}
                renderItem={({ item }) => {
                    return (
                        disableRemoveRationale ? (
                            <ThesisBox
                                item={item}
                                nav={navigation}
                            />
                        ) : (
                            <Swipeable renderRightActions={() => swipeRight(item)}
                                rightThreshold={-200}
                            >
                                <Animated.View>
                                    <ThesisBox
                                        item={item}
                                        nav={navigation}
                                    />
                                </Animated.View>
                            </Swipeable>
                        )
                    );
                }}
                extraData={refreshFlatlist}
            >
            </FlatList>
        </View>
    );
};

export default RationaleScreen;

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
