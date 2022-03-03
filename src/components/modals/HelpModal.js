import React from "react";
import { Modal, StyleSheet, View, TouchableOpacity } from "react-native";
import { MAIN_SECONDARY_COLOR, MAIN_DIFFERENTIATOR_COLOR } from "../../styles/Colors";
import * as Linking from 'expo-linking';
import AppText from "../AppText";

const HelpModal = ({ modalVisible, makeModalDisappear }) => {

    const handleEmailLink = (emailLink) => {
        Linking.openURL(emailLink);
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                makeModalDisappear();
            }}
        >
            <TouchableOpacity
                style={styles.centeredView}
                onPress={() => {
                    makeModalDisappear();
                }}
            >
                <TouchableOpacity onPress={() => { }} activeOpacity={1}>
                    <View style={styles.modalView}>
                        <AppText style={styles.regularText}>
                            Please send us an email if you are encountering issues with the app, have any questions, or want to provide feedback.
                        </AppText>
                        <TouchableOpacity
                            onPress={() => {
                                makeModalDisappear();
                                handleEmailLink("mailto:support@pelleum.com")
                            }}
                        >
                            <AppText style={styles.emailButtonText}>support@pelleum.com</AppText>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        marginTop: 22,
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-end",
    },
    modalView: {
        margin: 20,
        backgroundColor: MAIN_DIFFERENTIATOR_COLOR,
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    emailButtonText: {
        marginTop: 20,
        color: MAIN_SECONDARY_COLOR,
        fontSize: 16,
    },
    regularText: {
        fontSize: 16,
    },
});

export default HelpModal;
