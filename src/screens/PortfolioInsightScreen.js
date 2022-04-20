import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, Image } from "react-native";
import { NativeBaseProvider } from "native-base";
import PortfolioManager from "../managers/PortfolioManager";
import RationalesManager from "../managers/RationalesManager";
import UserManager from "../managers/UserManager";
import AppText from "../components/AppText";
import AssetBox from "../components/AssetBox";

const PortfolioInsightScreen = ({ navigation, route }) => {
	// Local State
	const [user, setUser] = useState(null);
	const [assetList, setAssetList] = useState([]);
	const [rationales, setRationales] = useState([]);

	const onRefresh = async () => {
		// 1. Obtain portfolio's user object
		const userObject = await UserManager.getUserById(route.params.userId);
		setUser(userObject);
		// 2. Obtain user's assets
		const retrievedAssets = await PortfolioManager.retrieveAssets(route.params.userId);
		if (retrievedAssets) {
			setAssetList(retrievedAssets.records);
		}
		// 3. Obtain user's rationales
		const retrievedRationales = await RationalesManager.retrieveRationales({
			user_id: route.params.userId,
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

	if (!user) {
		return (
			<View></View>
		);
	} else {
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
									source={require("../../assets/defaultProfileImage.png")}
								/>
								<AppText style={styles.usernameText}>@{user.username}</AppText>
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
	}
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
		fontSize: 16,
		marginTop: 10,
		fontWeight: "bold",
		alignSelf: "center",
	},
	noBrokerageLinkedText: {
		alignSelf: "center",
		marginTop: 30,
		fontSize: 15,
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
