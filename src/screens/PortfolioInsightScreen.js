import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	View,
	FlatList,
	TouchableOpacity,
	Image,
} from "react-native";
import { Box, Center, VStack, HStack, NativeBaseProvider } from "native-base";
import PortfolioManager from "../managers/PortfolioManager";
import { useSelector } from "react-redux";
import AppText from "../components/AppText";
import AssetBox from "../components/AssetBox";

//*****************************************************************
////*******BEFORE USING AssetBox, we need to take into account 
////*******the disableRemoveRationale parameter that we pass to RationaleScreen
//*****************************************************************

const PortfolioInsightScreen = ({ navigation, route }) => {
	// state
	const [assetList, setAssetList] = useState([]);
	const { rationaleLibrary } = useSelector((state) => state.rationaleReducer);

    const { username, userId } = route.params;

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
						<AssetBox
						item={item}
						nav={navigation}
						disableRemoveRationale={true}
						/>
					)}
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
						<View alignItems={'center'} paddingVertical={20}>
							<AppText>We can add more stuff here.</AppText>
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
	disabledThesisButton: {
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
		opacity: 0.33,
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



