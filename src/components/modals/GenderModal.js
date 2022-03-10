import React from "react";
import { Modal, StyleSheet, View, TouchableOpacity } from "react-native";
import { MAIN_DIFFERENTIATOR_COLOR, LIGHT_GREY_COLOR } from "../../styles/Colors";
import AppText from "../AppText";

const GenderModal = ({ modalVisible, makeModalDisappear, setGender }) => {

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
                        <TouchableOpacity
                            onPress={() => {
                                makeModalDisappear();
                                setGender("FEMALE");
                            }}
                        >
                            <AppText style={styles.genderText}>Female</AppText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                makeModalDisappear();
                                setGender("MALE");
                            }}
                        >
                            <AppText style={styles.genderText}>Male</AppText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                makeModalDisappear();
                                setGender("OTHER");
                            }}
                        >
                            <AppText style={styles.genderText}>Other</AppText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                makeModalDisappear();
                                setGender("UNDISCLOSED");
                            }}
                        >
                            <AppText style={styles.genderText}>I prefer not to say</AppText>
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
    genderText: {
        marginTop: 20,
        color: LIGHT_GREY_COLOR,
        fontSize: 16,
    },
});

export default GenderModal;
