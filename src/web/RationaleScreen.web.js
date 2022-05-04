// Installed Libraries
import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    FlatList,
    Animated,
    TouchableOpacity,
} from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Ionicons } from "@expo/vector-icons";
// import { useAnalytics } from '@segment/analytics-react-native';

// Local Files
import CustomAlertModal from "../components/modals/CustomAlertModal";
import ThesisBox from "../components/ThesisBox";
import RationalesManager from "../managers/RationalesManager";
import AppText from "../components/AppText";
import { TEXT_COLOR, BAD_COLOR } from "../styles/Colors";

const RationaleScreen = ({ navigation, route }) => {
    //State Management
    const [rationaleArray, setRationaleArray] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [refreshFlatlist, setRefreshFlatList] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [rationaleUpdatedThesis, setRationaleUpdatedThesis] = useState(null);
    const [deleteRationaleModalVisible, setDeleteRationaleModalVisible] = useState(false);
    const [unpdatedLibraryModalVisible, setUpdatedLibraryModalVisible] = useState(false);

    // // Segment Tracking
    // const { track } = useAnalytics();

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
        const sourcesQuantity = item.thesis.sources ? item.thesis.sources.length : 0;
        if (responseStatus) {
            if (responseStatus == 204) {
                // track('Rationale Removed', {
                // 	authorUserId: item.thesis.user_id,
                // 	authorUsername: item.thesis.username,
                // 	thesisId: item.thesis.thesis_id,
                // 	assetSymbol: item.thesis.asset_symbol,
                // 	sentiment: item.thesis.sentiment,
                // 	sourcesQuantity: sourcesQuantity,
                // });
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
        setItemToDelete(item);
        setDeleteRationaleModalVisible(true);
    };

    const handleRemove = async (item) => {
        // This function is called when user confirms deletion
        // 1. Delete rationale
        await deleteRationale(item);
        // 2. If deleting to add a new rationale, add new rationale
        if (thesisToAddAfterRemoval) {
            const response = await RationalesManager.addRationale(
                thesisToAddAfterRemoval
            );
            if (response.data.rationale_id) {
                const rationaleArrayCopy = rationaleArray;
                rationaleArrayCopy.unshift(response.data);
                setRationaleArray(rationaleArrayCopy);
                route.params.thesisToAddAfterRemoval = null;
                setRationaleUpdatedThesis(response.data.thesis);
                setUpdatedLibraryModalVisible(true);
            }
        }
    };

    const swipeRight = (item) => {
        return (
            <Animated.View
                style={{
                    backgroundColor: BAD_COLOR,
                    width: "30%",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <TouchableOpacity
                    style={{ paddingVertical: "50%", paddingHorizontal: "7%" }}
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

    return (
        <View style={styles.mainContainer}>
            {itemToDelete ? (
                <CustomAlertModal
                    modalVisible={deleteRationaleModalVisible}
                    makeModalDisappear={() => setDeleteRationaleModalVisible(false)}
                    alertTitle="Confirm Deletion"
                    alertBody={`Are you sure you want remove this thesis from your Rationale Library?\n\n"${itemToDelete.thesis.title}"`}
                    numberOfButtons={2}
                    firstButtonLabel="Cancel"
                    firstButtonStyle="cancel"
                    firstButtonAction={() => {
                        //do nothing and dismiss modal
                        setItemToDelete(null);
                        setDeleteRationaleModalVisible(false);
                    }}
                    secondButtonLabel="Delete"
                    secondButtonStyle="destructive"
                    secondButtonAction={async () => {
                        await handleRemove(itemToDelete);
                        setDeleteRationaleModalVisible(false);
                    }}
                />
            ) : null}
            {rationaleUpdatedThesis ? (
                <CustomAlertModal
                    modalVisible={unpdatedLibraryModalVisible}
                    makeModalDisappear={() => setUpdatedLibraryModalVisible(false)}
                    alertTitle="Rationale Library Updated 🎉"
                    alertBody={`A new ${rationaleUpdatedThesis.asset_symbol} ${rationaleUpdatedThesis.sentiment} thesis was added to your library!\n\n“${rationaleUpdatedThesis.title}”🙂`}
                    numberOfButtons={1}
                    firstButtonLabel="Got it!"
                    firstButtonStyle="default"
                    firstButtonAction={() => {
                        //do nothing and dismiss modal
                        setUpdatedLibraryModalVisible(false);
                    }}
                />
            ) : null}
            <AppText style={styles.title}>{asset}</AppText>
            {errorMessage ? (
                <AppText style={styles.error}>{errorMessage}</AppText>
            ) : null}
            {rationaleArray.length == 0 ? (
                <AppText style={styles.noRationalesText}>
                    Here, you can keep track of your thinking around investments by tying
                    theses that you or others write to assets. {"\n\n"}Theses you write are
                    automatically added to your Rationale Library. To adopt a thesis
                    someone else wrote, click the adopt button on a thesis💥
                </AppText>
            ) : (
                <FlatList
                    width={"100%"}
                    data={rationaleArray}
                    keyExtractor={(item) => item.rationale_id}
                    renderItem={({ item }) =>
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
                        )}
                    extraData={refreshFlatlist}
                ></FlatList>
            )}
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
    noRationalesText: {
        alignSelf: "center",
        marginTop: 80,
        marginHorizontal: 40,
    },
});
