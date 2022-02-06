import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Animated, TouchableOpacity, Alert } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import ThesisBox from '../components/ThesisBox';
import RationalesManager from '../managers/RationalesManager';
import AppText from '../components/AppText';
import { Ionicons } from "@expo/vector-icons";
import { TEXT_COLOR } from '../styles/Colors';

const RationaleScreen = ({ navigation, route }) => {
    //State Management
    const [rationaleArray, setRationaleArray] = useState([]);
    const [errorMessage, setErrorMessage] = useState(""); // Migrate to Redux
    const [refreshFlatlist, setRefreshFlatList] = useState(false);

    const asset = route.params.asset ? route.params.asset : null;
    const userId = route.params.userId ? route.params.userId : null;
    const disableRemoveRationale = route.params.disableRemoveRationale
        ? route.params.disableRemoveRationale
        : false;
    const thesisToAddAfterRemoval = route.params.thesisToAddAfterRemoval
        ? route.params.thesisToAddAfterRemoval
        : null;

    const getRationales = async () => {
        const retrievedRationales = await RationalesManager.retrieveRationales({
            user_id: userId,
            asset_symbol: asset,
        });
        if (retrievedRationales) {
            setRationaleArray(retrievedRationales.records.rationales);
        } else {
            setErrorMessage("There was an error obtaining theses from the backend.");
        }
    };

    const deleteRationale = async (item) => {
        const responseStatus = await RationalesManager.removeRationale(item);
        if (responseStatus) {
            if (responseStatus == 204) {
                const rationaleArrayCopy = rationaleArray;
                const index = rationaleArrayCopy.findIndex(
                    (rationale) => rationale.thesis_id === item.thesis_id
                );
                if (index > -1) {
                    rationaleArrayCopy.splice(index, 1);
                    setRationaleArray(rationaleArrayCopy);
                    setRefreshFlatList(!refreshFlatlist);
                }
            }
        }
    };

    const alertBeforeDelete = async (item) => {
        Alert.alert(
            "Confirm Deletion",
            `Are you sure you want remove this thesis from your Rationale Library?\n\n"${item.thesis.title}"`,
            [
                {
                    text: "No", onPress: () => { /* Do nothing */ }
                },
                {
                    text: "Yes", onPress: async () => {
                        handleRemove(item);
                    }
                }
            ]
        );
    };

    const handleRemove = async (item) => {
        // This function is called when user confirms deletion
        // 1. Delete rationale
        await deleteRationale(item);
        // 2. If deleting to add a new rationale, add new rationale
        if (thesisToAddAfterRemoval) {
            const response = await RationalesManager.addRationale(thesisToAddAfterRemoval);
            if (response.data.rationale_id) {
                const rationaleArrayCopy = rationaleArray;
                rationaleArrayCopy.unshift(response.data);
                setRationaleArray(rationaleArrayCopy);
                route.params.thesisToAddAfterRemoval = null;
                Alert.alert(
                    `Rationale Library Updated 🎉`,
                    `A new ${response.data.thesis.asset_symbol} ${response.data.thesis.sentiment} thesis was added to your library!\n\n“${response.data.thesis.title}”🙂`,
                    [
                        { text: "Got it!", onPress: () => {/* do nothing */ } },
                    ]
                );
            };
        };
    };

    const swipeRight = (item) => {
        return (
            <Animated.View style={{ backgroundColor: '#cc0000', width: "30%", justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity
                    style={{ paddingVertical: '50%', paddingHorizontal: '7%' }}
                    onPress={() => alertBeforeDelete(item)}
                >
                    <Ionicons name="trash-outline" size={30} color={TEXT_COLOR} />
                </TouchableOpacity>
            </Animated.View>
        );
    };

    //on first render
    useEffect(() => {
        getRationales();
    }, []);

    renderItem = ({ item }) => (
        disableRemoveRationale ? (
            <ThesisBox item={item.thesis} nav={navigation} />
        ) : (
            <Swipeable
                renderRightActions={() => swipeRight(item)}
                rightThreshold={-200}
            >
                <Animated.View>
                    <ThesisBox item={item.thesis} nav={navigation} />
                </Animated.View>
            </Swipeable>
        )
    );

    return (
        <View style={styles.mainContainer}>
            <AppText style={styles.title}>{asset}</AppText>
            {errorMessage ? (
                <AppText style={styles.error}>{errorMessage}</AppText>
            ) : null}
            <FlatList
                width={"100%"}
                data={rationaleArray}
                keyExtractor={(item) => item.rationale_id}
                renderItem={renderItem}
                extraData={refreshFlatlist}
            ></FlatList>
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
        color: "red",
        marginTop: 15,
        marginBottom: 25,
        fontSize: 14,
        alignSelf: "center",
    },
});
