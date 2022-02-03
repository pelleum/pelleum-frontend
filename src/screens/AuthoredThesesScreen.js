import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import ThesesManager from "../managers/ThesesManager";
import ThesisBox from "../components/ThesisBox";
import AppText from "../components/AppText";
import { BAD_COLOR } from "../styles/Colors";

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

	return (
		<View style={styles.mainContainer}>
			{errorMessage ? (
				<AppText style={styles.error}>{errorMessage}</AppText>
			) : null}
			<FlatList
				width={"100%"}
				data={thesesArray}
				keyExtractor={(item) => item.thesis_id}
				renderItem={({ item }) => {
					return <ThesisBox item={item} nav={navigation} />;
				}}
			></FlatList>
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
});
