import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, TouchableOpacity } from "react-native";
import ThesesManager from "../managers/ThesesManager";
import ThesisBox from "../components/ThesisBox";
import AppText from "../components/AppText";
import { BAD_COLOR, MAIN_SECONDARY_COLOR } from "../styles/Colors";

const AuthoredThesesScreen = ({ navigation, route }) => {
	const [thesesArray, setThesesArray] = useState([]);
	const [errorMessage, setErrorMessage] = useState("");

	const userId = route.params.userId ? route.params.userId : null;

	const getAuthoredTheses = async () => {
		const retrievedTheses = await ThesesManager.getTheses({ user_id: userId });
		if (retrievedTheses) {
			setThesesArray(retrievedTheses.records.theses);
		} else {
			setErrorMessage("There was an error obtaining theses from the backend.");
		}
	};

	//on first render
	useEffect(() => {
		getAuthoredTheses();
	}, []);

	renderItem = ({ item }) => (<ThesisBox item={item} nav={navigation} />);

	return (
		<View style={styles.mainContainer}>
			{errorMessage ? (
				<AppText style={styles.error}>{errorMessage}</AppText>
			) : null}
			{thesesArray.length == 0 ? (
				<View>
					<AppText style={styles.noThesesText}>
						You haven't created a thesis yet. When you do, they'll show up here!💥
					</AppText>
					<TouchableOpacity
						style={styles.createThesisButton}
						onPress={() => navigation.navigate("CreateThesis")}
					>
						<AppText style={styles.buttonTextStyle}>
							Create Thesis
						</AppText>
					</TouchableOpacity>
				</View>
			) : (
			<FlatList
				width={"100%"}
				data={thesesArray}
				keyExtractor={(item) => item.thesis_id}
				renderItem={renderItem}
			></FlatList>
			)}
		</View>
	);
};

export default AuthoredThesesScreen;

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
		color: BAD_COLOR,
		marginTop: 15,
		marginBottom: 25,
		fontSize: 14,
		alignSelf: "center",
	},
	createThesisButton: {
		alignSelf: "center",
		borderRadius: 30,
		padding: 11,
		marginTop: 30,
		width: "84%",
		backgroundColor: MAIN_SECONDARY_COLOR,
		elevation: 2,
	},
	noThesesText: {
		alignSelf: "center",
		marginTop: 80,
		marginHorizontal: 40,
	},
	buttonTextStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
		fontSize: 15,
	},
});
