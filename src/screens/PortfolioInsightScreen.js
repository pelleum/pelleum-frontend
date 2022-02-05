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
		};
		const retrievedRationales = await RationalesManager.retrieveRationales({ user_id: userId });
		if (retrievedRationales) {
			setRationales(retrievedRationales.records.rationales);
		};
	};

	useEffect(() => {
		onRefresh();
	}, []);

	renderItem = ({ item }) => (<AssetBox item={item} nav={navigation} portfolioInsightRationales={rationales} />);

	return (
		<View style={styles.mainContainer}>
			<NativeBaseProvider>
				<FlatList
					data={assetList}
					keyExtractor={(item, index) => item.asset_symbol}
					renderItem={renderItem}
					ListHeaderComponent={
						<View style={styles.listHeaderView}>
							<Image
								style={styles.image}
								source={require("../../assets/forest.jpg")}
							/>
							<AppText style={styles.usernameText}>@{username}</AppText>
							<AppText style={styles.listHeaderText}>Assets</AppText>
						</View>
					}
					ListFooterComponent={
						<View alignItems={"center"} paddingVertical={20}>
							<AppText>We can add more stuff here.</AppText>
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
	},
	listHeaderText: {
		fontWeight: "bold",
		fontSize: 16,
		marginTop: 15,
	},
	image: {
		width: 60,
		height: 60,
		borderRadius: 60 / 2,
	},
});
