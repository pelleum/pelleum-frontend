import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	Text,
	View,
	FlatList,
	TouchableOpacity,
	Image,
} from "react-native";
import { Box, Center, VStack, HStack, NativeBaseProvider } from "native-base";
import { Feather, } from "@expo/vector-icons";
import pelleumClient from "../api/clients/PelleumClient";
import * as SecureStore from "expo-secure-store";

const ProfileScreen = ({ navigation, route }) => {
	const [assetList, setAssetList] = useState([]);
	const [username, setUsername] = useState('');
	
	const onRefresh = async () => {
		const userObjectString = await SecureStore.getItemAsync('userObject');
		const userObject = JSON.parse(userObjectString);
		setUsername(userObject.username);
		const authorizedResponse = await pelleumClient({
			method: "get",
			url: `/public/portfolio/${userObject.user_id}`,
		});

		if (authorizedResponse) {
			if (authorizedResponse.status == 200) {
				setAssetList(authorizedResponse.data.records)
			} else {
				console.log("There was an error retrieving the assets from the backend.")
			}
		}
	};

	useEffect(() => {
		onRefresh();
	}, []);

	if (route.params) {
		if (route.params.accountLinked) {
			onRefresh();
			route.params.accountLinked = false;
		}
	}

	return (
		<View style={styles.mainContainer}>
			<NativeBaseProvider>
				<FlatList
					data={assetList}
					keyExtractor={(item) => item.asset_symbol}
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
											<Text style={styles.assetButtonText}>{item.asset_symbol}</Text>
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
											<Text style={styles.valueText}>Shares Owned:</Text>
											<Text style={styles.valueNumbers}>
												{item.quantity}
											</Text>
										</HStack>
										<HStack>
											<Text style={styles.valueText}>Avg Buy Price:</Text>
											<Text style={styles.valueNumbers}>
												${item.average_buy_price.toFixed(2)}
											</Text>
										</HStack>
									</VStack>
								</Box>
							</Box>
						</Center>
					)}
					ListHeaderComponent={
						<View style={styles.listHeaderView}>
							<Image
								style={styles.image}
								source={require("../../assets/forest.jpg")}
							/>
							<Text style={styles.usernameText}>@{username}</Text>
							<Text style={styles.listHeaderText}>Assets</Text>
						</View>
					}
					ListFooterComponent={
						<View alignItems={'center'} paddingVertical={20}>
							<TouchableOpacity
								style={styles.buttonGroup}
								onPress={() => navigation.navigate("Link")}
							>
								<HStack style={styles.buttonGroupTextContainer}>
									<Feather name="link" size={25} color="#00A8FC" />
									<Text style={styles.buttonGroupText}>Link Brokerage Accounts</Text>
								</HStack>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.buttonGroup}
								onPress={() => navigation.navigate("Settings")}
							>
								<HStack style={styles.buttonGroupTextContainer}>
									<Feather name="settings" size={25} color="#00A8FC" />
									<Text style={styles.buttonGroupText}>Settings</Text>
								</HStack>
							</TouchableOpacity>
						</View>
					}
				>
				</FlatList>
			</NativeBaseProvider>
		</View>
	);
};

export default ProfileScreen;

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
	},
	listHeaderView: {
		margin: 15
	},
	listHeaderText: {
		fontWeight: "bold",
		fontSize: 16,
		marginTop: 15,
	},
	usernameText: {
		marginTop: 10
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
		borderColor: "#00A8FC",
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
		borderColor: "white",
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
	image: {
		width: 60,
		height: 60,
		borderRadius: 60 / 2,
	},
	buttonGroup: {
		overflow: "hidden",
		borderWidth: 0.5,
		backgroundColor: "white",
		borderColor: "#00A8FC",
		borderRadius: 30,
		width: '80%',
		marginTop: 6,
	},
	buttonGroupText: {
		color: 'black',
		fontSize: 16,
		fontWeight: 'bold',
		marginLeft: 25,
	},
	buttonGroupTextContainer: {
		alignItems: 'center',
		justifyContent: 'flex-start',
		paddingLeft: 15,
		paddingVertical: 10,
	}
});

/*
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
			assetSymbol: "VOO",
			contribution: "$14,041.45",
			currentValue: "$22,378.63",
		}
	];
*/