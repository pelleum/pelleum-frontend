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
import PortfolioManager from "../managers/PortfolioManager";

const PortfolioInsightScreen = ({ navigation, route }) => {

    const { username, userId } = route.params;

	const [assetList, setAssetList] = useState([]);

	const onRefresh = async () => {
		const retrievedAssets = await PortfolioManager.retrieveAssets(userId);
		if (retrievedAssets) {
			setAssetList(retrievedAssets.records);
		}
	};

	useEffect(() => {
		onRefresh();
	}, []);

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
												navigation.navigate("Rationales", {
													asset: item.asset_symbol,
													userId: item.user_id
												});
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
							<Text>We can add more stuff here.</Text>
						</View>
					}
				>
				</FlatList>
			</NativeBaseProvider>
		</View>
	);
};

// Does this work? I still see a header.
PortfolioInsightScreen.navigationOptions = () => {
    return {
        headerShown: false,
    };
};

export default PortfolioInsightScreen;

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
	},
    listHeaderView: {
        margin: 15
    },
    usernameText: {
        marginTop: 10
    },
	listHeaderText: {
		fontWeight: "bold",
		fontSize: 16,
		marginTop: 15,
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
	image: {
		width: 60,
		height: 60,
		borderRadius: 60 / 2,
	},
});



