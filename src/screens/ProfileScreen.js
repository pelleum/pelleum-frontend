import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	View,
	SafeAreaView,
	FlatList,
	TouchableOpacity,
	Image,
	Alert,
	Platform,
	StatusBar,
} from "react-native";
import { HStack, NativeBaseProvider } from "native-base";
import {
	MaterialCommunityIcons,
	Ionicons,
	SimpleLineIcons,
	Octicons,
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
	TEXT_COLOR,
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
		};
		if (activeAccounts.length > 0) {
			{ activeAccounts.some(account => account.is_active) == false ? await relinkAlert() : null }
		};

	};

	const relinkAlert = async () => {
		Alert.alert(
			"Linked Account Error 😦",
			"It looks like one (or more) of your accounts needs to be relinked to Pelleum. Please check the status of your linked account(s)",
			[
				{ text: "Later", onPress: () => {/* do nothing */ } },
				{ text: "View Status", onPress: () => navigation.navigate("LinkedStatus") },
			]
		);
	};

	useEffect(() => {
		onRefresh();
	}, []);

	if (route.params) {
		if (route.params.accountLinked) {
			onRefresh();
			route.params.accountLinked = false;
		} else if (route.params.onUnlink) {
			onRefresh();
			route.params.onUnlink = false;
		}
	};

	renderItem = ({ item }) => (<AssetBox item={item} nav={navigation} />);

	return (
		<SafeAreaView style={styles.mainContainer}>
			<NativeBaseProvider>
				<FlatList
					showsVerticalScrollIndicator={false}
					data={assetList}
					keyExtractor={(item) => item.asset_symbol}
					renderItem={renderItem}
					ListHeaderComponent={
						<View style={styles.listHeaderView}>
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
							<Image
								style={styles.image}
								source={require("../../assets/forest.jpg")}
							/>
							<AppText style={styles.usernameText}>@{username}</AppText>
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
									navigation.navigate("AuthoredTheses", { userId: userId });
								}}
							>
								<HStack style={styles.buttonGroupTextContainer}>
									<MaterialCommunityIcons
										name="book-open-outline"
										size={25}
										color={MAIN_SECONDARY_COLOR}
									/>
									<AppText style={styles.buttonGroupText}>
										My Theses
									</AppText>
								</HStack>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.buttonGroup}
								onPress={async () => {
									const userObject = await getUserObject();
									const userId = userObject.user_id;
									navigation.navigate("AuthoredPosts", { userId: userId });
								}}
							>
								<HStack style={styles.buttonGroupTextContainer}>
									<Octicons
										name="note"
										size={26}
										color={MAIN_SECONDARY_COLOR}
										style={styles.postIcon}
									/>
									<AppText style={styles.buttonGroupText}>
										My Posts
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
		paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
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
		fontWeight: "bold",
		alignSelf: "center"
	},
	image: {
		alignSelf: "center",
		width: 60,
		height: 60,
		borderRadius: 60 / 2,
	},
	buttonGroup: {
		overflow: "hidden",
		backgroundColor: MAIN_DIFFERENTIATOR_COLOR,
		borderRadius: 30,
		width: "65%",
		marginTop: 6,
	},
	buttonGroupText: {
		fontSize: 16,
		fontWeight: "bold",
		marginLeft: 15,
	},
	buttonGroupTextContainer: {
		alignItems: "center",
		justifyContent: "flex-start",
		paddingLeft: 15,
		paddingVertical: 10,
		marginLeft: 20,
	},
	postIcon: {
		marginLeft: 1.75
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
		alignSelf: "flex-end",
		alignItems: "center",
		justifyContent: "center",
		width: 52,
		height: 52,
		borderRadius: 52 / 2,
		shadowOffset: { width: 0, height: 0 },
		shadowColor: LIGHT_GREY_COLOR,
		shadowOpacity: 0.3,
		elevation: 3,
		backgroundColor: "black",
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
