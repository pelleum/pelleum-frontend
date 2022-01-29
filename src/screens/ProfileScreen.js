import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	Text,
	View,
	SafeAreaView,
	FlatList,
	TouchableOpacity,
	Image,
} from "react-native";
import { HStack, NativeBaseProvider } from "native-base";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import PortfolioManager from "../managers/PortfolioManager";
import * as SecureStore from "expo-secure-store";
import { useSelector } from "react-redux";
import AssetBox from "../components/AssetBox";

const ProfileScreen = ({ navigation, route }) => {
	const [assetList, setAssetList] = useState([]);
	const [username, setUsername] = useState('');
	const { activeAccounts } = useSelector((state) => state.linkedAccountsReducer);

	const getUserObject = async () => {
		const userObjectString = await SecureStore.getItemAsync('userObject');
		return JSON.parse(userObjectString);
	};

	const onRefresh = async () => {
		const userObject = await getUserObject();
		setUsername(userObject.username);
		const retrievedAssets = await PortfolioManager.retrieveAssets(userObject.user_id);
		if (retrievedAssets) {
			setAssetList(retrievedAssets.records);
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
		<SafeAreaView style={styles.mainContainer}>
			<NativeBaseProvider>
				<FlatList
					data={assetList}
					keyExtractor={(item) => item.asset_symbol}
					renderItem={({ item }) => (
						<AssetBox
							item={item}
							nav={navigation}
						/>
					)}
					ListHeaderComponent={
						<View style={styles.listHeaderView}>
							<Image
								style={styles.image}
								source={require("../../assets/forest.jpg")}
							/>
							<Text style={styles.usernameText}>@{username}</Text>
							{activeAccounts.some(account => account.is_active) == false ? (
								<Text style={styles.inactiveAccountWarning}>There was an error validating your linked account(s). Please go to Settings and check the status of your linked account(s).</Text>
							) : null}
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
							<TouchableOpacity
								style={styles.buttonGroup}
								onPress={async () => {
									const userObject = await getUserObject();
									const userId = userObject.user_id;
									navigation.navigate("Rationales", { userId: userId });
								}}
							>
								<HStack style={styles.buttonGroupTextContainer}>
									<Ionicons name="md-file-tray-full-outline" size={25} color="#00A8FC" />
									<Text style={styles.buttonGroupText}>Rationale Library</Text>
								</HStack>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.buttonGroup}
								onPress={async () => {
									const userObject = await getUserObject();
									const userId = userObject.user_id;
									navigation.navigate("Authored", { userId: userId });
								}}
							>
								<HStack style={styles.buttonGroupTextContainer}>
									<MaterialCommunityIcons name="book-open-outline" size={25} color="#00A8FC" />
									<Text style={styles.buttonGroupText}>My Authored Theses</Text>
								</HStack>
							</TouchableOpacity>
						</View>
					}
				>
				</FlatList>
			</NativeBaseProvider>
		</SafeAreaView>
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
		marginTop: 10,
		color: "#026bd4"
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
	},
	inactiveAccountWarning: {
		alignSelf: "center",
		marginTop: 15,
		color: "red"
	},
});