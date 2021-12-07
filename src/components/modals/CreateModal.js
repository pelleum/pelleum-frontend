import React from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View } from "react-native";
import { Feather } from "@expo/vector-icons";

const CreateModal = ({ modalVisible, makeModalDisappear, onNavigate }) => {
	return (
		<Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                makeModalDisappear();
            }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Pressable
                        onPress={() => {
                            makeModalDisappear();
                        }}
                    >
                        <Feather name="x-circle" size={30} color="black" />
                    </Pressable>
                    <Pressable
                        style={[styles.button, styles.buttonOpen]}
                        onPress={() => {
                            makeModalDisappear();
                            onNavigate("CreatePost");
                        }}
                    >
                        <Text style={styles.textStyle}>Post</Text>
                    </Pressable>
                    <Pressable
                    style={[styles.button, styles.buttonOpen]}
                        onPress={() => {
                            makeModalDisappear();
                            onNavigate("CreateThesis");
                        }}
                    >
                        <Text style={styles.textStyle}>Thesis</Text>
                    </Pressable>
                </View>
            </View>
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
		backgroundColor: "white",
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
	button: {
		borderRadius: 30,
		padding: 20,
        marginVertical: 2,
        width: "100%",
		elevation: 2,
	},
	buttonOpen: {
		backgroundColor: "#00A8FC",
	},
	textStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
        fontSize: 20
	},
});

export default CreateModal;
