import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, Image } from "react-native";
import { NativeBaseProvider } from "native-base";
import PortfolioManager from "../managers/PortfolioManager";
import RationalesManager from "../managers/RationalesManager";
import AppText from "../components/AppText";
import AssetBox from "../components/AssetBox";

const PortfolioInsightScreen = ({ navigation, route }) => {
	// state
	const [assetList, setAssetList] = useState([]);
	const [rationales, setRationales] = useState([]);
	const { username, userId } = route.params;

	const onRefresh = async () => {
		const retrievedAssets = await PortfolioManager.retrieveAssets(userId);
		if (retrievedAssets) {
			setAssetList(retrievedAssets.records);
		}
		const retrievedRationales = await RationalesManager.retrieveRationales({
			user_id: userId,
		});
		if (retrievedRationales) {
			setRationales(retrievedRationales.records.rationales);
		}
	};

	useEffect(() => {
		onRefresh();
	}, []);

	renderItem = ({ item }) => (
		<AssetBox
			item={item}
			nav={navigation}
			portfolioInsightRationales={rationales}
		/>
	);

	return (
		<View style={styles.mainContainer}>
			<NativeBaseProvider>
				<FlatList
					data={assetList}
					keyExtractor={(item) => item.asset_symbol}
					renderItem={renderItem}
					ListHeaderComponent={
						<View style={styles.listHeaderView}>
							<Image
								style={styles.image}
								source={require("../../assets/forest.jpg")}
							/>
							<AppText style={styles.usernameText}>@{username}</AppText>
							{assetList.length == 0 ? (
								<AppText style={styles.noBrokerageLinkedText}>
									Author has not yet linked a brokerage account😕
								</AppText>
							) : (
								<AppText style={styles.listHeaderText}>
									Author's Skin in the Game
								</AppText>
							)}
						</View>
					}
				></FlatList>
			</NativeBaseProvider>
		</View>
	);
};

export default PortfolioInsightScreen;

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
	},
	listHeaderView: {
		margin: 15,
	},
	usernameText: {
		marginTop: 10,
		alignSelf: "center",
	},
	noBrokerageLinkedText: {
		alignSelf: "center",
		marginTop: 30,
		fontSize: 15,
		fontWeight: "bold",
	},
	listHeaderText: {
		fontWeight: "bold",
		fontSize: 20,
		marginTop: 30,
		alignSelf: "center",
	},
	image: {
		width: 60,
		height: 60,
		borderRadius: 60 / 2,
		alignSelf: "center",
	},
});
