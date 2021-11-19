import React from "react";
import {
	StyleSheet,
	Text,
	View,
	FlatList,
	TouchableOpacity,
	Image,
} from "react-native";
import { Box, Center, VStack, HStack, NativeBaseProvider } from "native-base";
import { Feather } from "@expo/vector-icons";

const ProfileScreen = ({ navigation }) => {
	const assetsOwned = [
		{
			assetSymbol: "TSLA",
			contribution: "$8,533.06",
			currentValue: "$19,215.48",
		},
		{
			assetSymbol: "AAPL",
			contribution: "$2,568.72",
			currentValue: "$5,651.18",
		},
		{ assetSymbol: "COIN", contribution: "$1,225.99", currentValue: "$992.79" },
		{
			assetSymbol: "GOOGL",
			contribution: "$4,850.19",
			currentValue: "$7,125.35",
		},
		{
			assetSymbol: "VdOO",
			contribution: "$14,041.45",
			currentValue: "$22,378.63",
		},
		//{ assetSymbol: "VOddO", contribution: "$14,041.45", currentValue: "$22,378.63" },
		//{ assetSymbol: "VOdddO", contribution: "$14,041.45", currentValue: "$22,378.63" },
		//{ assetSymbol: "VOddsdO", contribution: "$14,041.45", currentValue: "$22,378.63" }
	];
	return (
		<View style={styles.mainContainer}>
			<NativeBaseProvider>
				<VStack>
					<HStack alignItems="center" justifyContent="space-between">
						<Image
							style={styles.image}
							source={require("../../assets/forest.jpg")}
						/>
						<TouchableOpacity
							style={styles.settingsButton}
							onPress={() => {
								navigation.navigate("Settings");
							}}
						>
							<Feather name="settings" size={40} color="#00A8FC" />
						</TouchableOpacity>
					</HStack>
					<FlatList
						data={assetsOwned}
						keyExtractor={(item) => item.assetSymbol}
						renderItem={({ item }) => (
							<Center>
								<Box style={styles.assetTableBox}>
									<Box style={styles.assetRowBox}>
										<VStack>
											<TouchableOpacity
												style={styles.assetButton}
												onPress={() => {
													console.log("Asset button worked.");
												}}
											>
                                                <Text style={styles.assetButtonText}>{item.assetSymbol}</Text>
											</TouchableOpacity>
											<TouchableOpacity
												style={styles.thesisButton}
												onPress={() => {
													console.log("Thesis button worked.");
												}}
											>
                                                <Text style={styles.thesisButtonText}>Thesis</Text>
											</TouchableOpacity>
										</VStack>
										<VStack>
											<HStack>
												<Text style={styles.valueText}>Contribution:</Text>
												<Text style={styles.valueNumbers}>
													{item.contribution}
												</Text>
											</HStack>
											<HStack>
												<Text style={styles.valueText}>Current Value:</Text>
												<Text style={styles.valueNumbers}>
													{item.currentValue}
												</Text>
											</HStack>
										</VStack>
									</Box>
								</Box>
							</Center>
						)}
						ListHeaderComponent={
							<Text style={styles.listHeaderText}>Assets</Text>
						}
					></FlatList>
				</VStack>
			</NativeBaseProvider>
		</View>
	);
};

export default ProfileScreen;

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
	},
	listHeaderText: {
		fontWeight: "bold",
		fontSize: 16,
		marginTop: 10,
		padding: 15,
	},
	assetTableBox: {
		backgroundColor: "#ebecf0",
		borderWidth: 1,
		borderColor: "#dedfe3",
		borderRadius: 5,
		width: "98%",
		overflow: "hidden",
	},
	assetRowBox: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		borderWidth: 0.5,
		borderColor: "#dedfe3",
		paddingVertical: 8,
		overflow: "hidden",
	},
	assetButton: {
        overflow: "hidden",
        borderWidth: 0.5,
		backgroundColor: "white",
		borderColor: "#00A8FC",
		borderRadius: 15,
        backgroundColor: "white",
		borderRadius: 30,
        marginLeft: 5,
        marginVertical: 3,
		height: 30,
		width: 75,
		justifyContent: "center",
		alignItems: "center",
	},
    assetButtonText: {
        fontSize: 15,
        color: "#00A8FC",
        fontWeight: "bold"
    },
	thesisButton: {
		overflow: "hidden",
        borderWidth: 0.5,
		backgroundColor: "#00A8FC",
		borderColor: "white",
		borderRadius: 15,
        backgroundColor: "#00A8FC",
		borderRadius: 30,
        marginLeft: 5,
        marginVertical: 3,
		height: 30,
		width: 75,
		justifyContent: "center",
		alignItems: "center",
	},
    thesisButtonText: {
        fontSize: 15,
        color: "white",
        fontWeight: "bold"
    },
	valueText: {
		width: 105,
		color: "#575757",
		fontSize: 15,
		paddingVertical: 5,
		marginVertical: 3,
	},
	valueNumbers: {
		width: 130,
		textAlign: "right",
		fontSize: 15,
		marginRight: 5,
		marginVertical: 3,
		paddingVertical: 5,
	},
	settingsButton: {
		marginRight: 15,
	},
	image: {
		width: 60,
		height: 60,
		borderRadius: 60 / 2,
		margin: 15,
	},
});

/*
            <Text>Profile Screen</Text>
            <Button
                title="Go to Post Detail"
                onPress = {() => navigation.navigate('feedPostFlow')}
            />
            <Button
                title="Go to Thesis Detail"
                onPress = {() => navigation.navigate('feedThesisFlow')}
            />
            <Button
                title="Go to Settings"
                onPress = {() => navigation.navigate('Settings')}
            />
*/
