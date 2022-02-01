import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	View,
	SafeAreaView,
	FlatList,
	TouchableOpacity,
	Image,
} from "react-native";
import { HStack, NativeBaseProvider } from "native-base";
import {
	MaterialCommunityIcons,
	Ionicons,
	SimpleLineIcons,
} from "@expo/vector-icons";
import PortfolioManager from "../managers/PortfolioManager";
import * as SecureStore from "expo-secure-store";
import { useSelector } from "react-redux";
import AssetBox from "../components/AssetBox";
import AppText from "../components/AppText";
import {
	BAD_COLOR,
	LINK_COLOR,
	MAIN_DIFFERENTIATOR_COLOR,
	LIGHT_GREY_COLOR,
	MAIN_SECONDARY_COLOR,
	MAIN_BACKGROUND_COLOR,
} from "../styles/Colors";

const ProfileScreen = ({ navigation, route }) => {
	const [assetList, setAssetList] = useState([]);
	const [username, setUsername] = useState("");
	const { activeAccounts } = useSelector(
		(state) => state.linkedAccountsReducer
	);

	const getUserObject = async () => {
		const userObjectString = await SecureStore.getItemAsync("userObject");
		return JSON.parse(userObjectString);
	};

	const onRefresh = async () => {
		const userObject = await getUserObject();
		setUsername(userObject.username);
		const retrievedAssets = await PortfolioManager.retrieveAssets(
			userObject.user_id
		);
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
					showsVerticalScrollIndicator={false}
					data={assetList}
					keyExtractor={(item) => item.asset_symbol}
					renderItem={({ item }) => <AssetBox item={item} nav={navigation} />}
					ListHeaderComponent={
						<View style={styles.listHeaderView}>
							<HStack justifyContent={"space-between"}>
								<Image
									style={styles.image}
									source={require("../../assets/forest.jpg")}
								/>
								<TouchableOpacity
									style={styles.settingsButton}
									onPress={() => navigation.navigate("Settings")}
								>
									<SimpleLineIcons
										name="settings"
										size={28}
										color={MAIN_SECONDARY_COLOR}
									/>
								</TouchableOpacity>
							</HStack>
							<AppText style={styles.usernameText}>@{username}</AppText>
							{activeAccounts.some((account) => account.is_active) == false ? (
								<>
									<AppText style={styles.inactiveAccountWarning}>
										There was an error validating your linked account(s).
									</AppText>
									<TouchableOpacity
										onPress={() => navigation.navigate("LinkedStatus")}
									>
										<AppText style={styles.inactiveLinkButtonText}>
											Check the status of your linked account(s).
										</AppText>
									</TouchableOpacity>
								</>
							) : null}
							<HStack style={styles.headerStyle}>
								<AppText style={styles.listHeaderText}>Assets</AppText>
								<TouchableOpacity
									style={styles.linkAccountButton}
									onPress={() => navigation.navigate("Link")}
								>
									<MaterialCommunityIcons
										name="bank-plus"
										size={26}
										color={MAIN_SECONDARY_COLOR}
									/>
								</TouchableOpacity>
							</HStack>
						</View>
					}
					ListFooterComponent={
						<View alignItems={"center"} paddingVertical={20}>
							<TouchableOpacity
								style={styles.buttonGroup}
								onPress={async () => {
									const userObject = await getUserObject();
									const userId = userObject.user_id;
									navigation.navigate("Rationales", { userId: userId });
								}}
							>
								<HStack style={styles.buttonGroupTextContainer}>
									<Ionicons
										name="md-file-tray-full-outline"
										size={25}
										color={MAIN_SECONDARY_COLOR}
									/>
									<AppText style={styles.buttonGroupText}>
										Rationale Library
									</AppText>
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
									<MaterialCommunityIcons
										name="book-open-outline"
										size={25}
										color={MAIN_SECONDARY_COLOR}
									/>
									<AppText style={styles.buttonGroupText}>
										Authored Theses
									</AppText>
								</HStack>
							</TouchableOpacity>
						</View>
					}
				></FlatList>
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
		margin: 13,
	},
	listHeaderText: {
		marginLeft: 3,
		fontWeight: "bold",
		fontSize: 20,
	},
	usernameText: {
		fontSize: 15,
		marginTop: 10,
		color: LINK_COLOR,
	},
	image: {
		width: 60,
		height: 60,
		borderRadius: 60 / 2,
	},
	buttonGroup: {
		overflow: "hidden",
		borderWidth: 0.5,
		backgroundColor: MAIN_DIFFERENTIATOR_COLOR,
		borderRadius: 30,
		width: "80%",
		marginTop: 6,
	},
	buttonGroupText: {
		fontSize: 16,
		fontWeight: "bold",
		marginLeft: 25,
	},
	buttonGroupTextContainer: {
		alignItems: "center",
		justifyContent: "flex-start",
		paddingLeft: 15,
		paddingVertical: 10,
	},
	inactiveAccountWarning: {
		fontSize: 15,
		alignSelf: "center",
		marginTop: 15,
		color: BAD_COLOR,
	},
	inactiveLinkButtonText: {
		fontSize: 15,
		alignSelf: "center",
		paddingTop: 15,
		paddingBottom: 10,
		color: LINK_COLOR,
	},
	headerStyle: {
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: 10,
	},
	settingsButton: {
		justifyContent: "center",
		alignItems: "center",
		width: 52,
		height: 52,
		borderRadius: 52 / 2,
	},
	linkAccountButton: {
		justifyContent: "center",
		alignItems: "center",
		paddingLeft: 2.5,
		width: 52,
		height: 52,
		borderRadius: 52 / 2,
		shadowOffset: { width: 0, height: 0 },
		shadowColor: LIGHT_GREY_COLOR,
		shadowOpacity: 0.3,
		elevation: 3,
		backgroundColor: "black",
	},
});
