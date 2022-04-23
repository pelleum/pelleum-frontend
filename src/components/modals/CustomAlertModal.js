import React from "react";
import { Modal, StyleSheet, View, TouchableOpacity } from "react-native";
import { BAD_COLOR, LIST_SEPARATOR_COLOR, WEB_MAIN_DIFFERENTIATOR_COLOR } from "../../styles/Colors";
import AppText from "../AppText";

const CustomAlertModal = ({
    modalVisible,       //boolean => state variable
    makeModalDisappear, //function => setState function
    alertTitle,         //string
    alertBody,          //string
    numberOfButtons,    //integer => either 1 or 2
    firstButtonLabel,   //string
    firstButtonStyle,   //string => "default", "cancel", or "destructive"
    firstButtonAction,  //function
    secondButtonLabel,  //string
    secondButtonStyle,  //string => "default", "cancel", or "destructive"
    secondButtonAction, //function
}) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                makeModalDisappear();
            }}
        >
            <View style={styles.modalView}>
                {alertTitle ? <AppText style={styles.titleText}>{alertTitle}</AppText> : null}
                {alertBody ? <AppText style={styles.bodyText}>{alertBody}</AppText> : null}
                {numberOfButtons == 1 ? (
                    <View style={{ width: "90%", alignItems: "center", justifyContent: "center", borderTopWidth: 0.5, borderTopColor: LIST_SEPARATOR_COLOR }}>
                        <TouchableOpacity
                            style={styles.buttonShape}
                            onPress={() => firstButtonAction()}>
                            <AppText
                                style={
                                    firstButtonStyle == "default" ? styles.defaultButtonText :
                                        firstButtonStyle == "cancel" ? styles.cancelButtonText :
                                            firstButtonStyle == "destructive" ? styles.destructiveButtonText :
                                                styles.defaultButtonText
                                }
                            >{firstButtonLabel}</AppText>
                        </TouchableOpacity>
                    </View>
                ) : null}
                {numberOfButtons == 2 ? (
                    <View style={{ width: "90%", flexDirection: "row", alignItems: "center", justifyContent: "center", borderTopWidth: 0.5, borderTopColor: LIST_SEPARATOR_COLOR }}>
                        <TouchableOpacity
                            style={styles.buttonShape}
                            onPress={() => firstButtonAction()}
                        >
                            <AppText
                                style={
                                    firstButtonStyle == "default" ? styles.defaultButtonText :
                                        firstButtonStyle == "cancel" ? styles.cancelButtonText :
                                            firstButtonStyle == "destructive" ? styles.destructiveButtonText :
                                                styles.defaultButtonText
                                }
                            >{firstButtonLabel}</AppText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonShape}
                            onPress={() => secondButtonAction()}>
                            <AppText
                                style={
                                    secondButtonStyle == "default" ? styles.defaultButtonText :
                                        secondButtonStyle == "cancel" ? styles.cancelButtonText :
                                            secondButtonStyle == "destructive" ? styles.destructiveButtonText :
                                                styles.defaultButtonText
                                }
                            >{secondButtonLabel}</AppText>
                        </TouchableOpacity>
                    </View>
                ) : null}
            </View>
        </Modal >
    );
};

const styles = StyleSheet.create({
    modalView: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        backgroundColor: WEB_MAIN_DIFFERENTIATOR_COLOR,
        borderRadius: 20,
        padding: 20,
    },
    titleText: {
        fontWeight: "bold",
        fontSize: 16,
        marginTop: 5,
        marginBottom: 10,
    },
    bodyText: {
        fontSize: 15,
        marginBottom: 10,
    },
    defaultButtonText: {
        fontSize: 16,
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    destructiveButtonText: {
        color: BAD_COLOR,
        fontWeight: "bold",
        fontSize: 16,
        opacity: 0.65,
    },
    buttonShape: {
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        margin: 3,
        borderRadius: 5,
    },
});

export default CustomAlertModal;