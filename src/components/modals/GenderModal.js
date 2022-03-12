import React from "react";
import { Modal, StyleSheet, View, TouchableOpacity } from "react-native";
import { MAIN_DIFFERENTIATOR_COLOR, LIGHT_GREY_COLOR } from "../../styles/Colors";
import AppText from "../AppText";

const GenderModal = ({ modalVisible, makeModalDisappear, setGender, inputValidity, setInputValidity }) => {

    const newInputValidity = inputValidity;

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
                            style={styles.genderButton}
                            onPress={() => {
                                setGender("FEMALE");
                                newInputValidity["genderValidity"] = true;
                                setInputValidity(newInputValidity);
                                makeModalDisappear();
                            }}
                        >
                            <AppText style={styles.genderButtonText}>Female</AppText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.genderButton}
                            onPress={() => {
                                setGender("MALE");
                                newInputValidity["genderValidity"] = true;
                                setInputValidity(newInputValidity);
                                makeModalDisappear();
                            }}
                        >
                            <AppText style={styles.genderButtonText}>Male</AppText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.genderButton}
                            onPress={() => {
                                setGender("OTHER");
                                newInputValidity["genderValidity"] = true;
                                setInputValidity(newInputValidity);
                                makeModalDisappear();
                            }}
                        >
                            <AppText style={styles.genderButtonText}>Other</AppText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.genderButton}
                            onPress={() => {
                                setGender("UNDISCLOSED");
                                newInputValidity["genderValidity"] = true;
                                setInputValidity(newInputValidity);
                                makeModalDisappear();
                            }}
                        >
                            <AppText style={styles.genderButtonText}>I prefer not to say</AppText>
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
    genderButtonText: {
        color: LIGHT_GREY_COLOR,
        fontSize: 16,
    },
    genderButton: {
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: 45,
    },
});

export default GenderModal;
