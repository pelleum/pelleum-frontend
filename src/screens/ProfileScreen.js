// Import Installed Libraries
import React, { useState, useEffect, useRef } from "react";
import { HStack, NativeBaseProvider } from "native-base";
import { useScrollToTop } from "@react-navigation/native";
import {
	StyleSheet,
	View,
	SafeAreaView,
	FlatList,
	TouchableOpacity,
	Image,
	Alert,
} from "react-native";
import {
	MaterialCommunityIcons,
	Ionicons,
	Octicons,
	FontAwesome,
} from "@expo/vector-icons";

// Import Local Files
import AssetBox from "../components/AssetBox";
import AppText from "../components/AppText";
import PortfolioManager from "../managers/PortfolioManager";
import { useSelector } from "react-redux";
import {
	BAD_COLOR,
	MAIN_DIFFERENTIATOR_COLOR,
	LIGHT_GREY_COLOR,
	MAIN_SECONDARY_COLOR,
} from "../styles/Colors";

const ProfileScreen = ({ navigation, route }) => {
	// State Management
	const [assetList, setAssetList] = useState([]);
	const [username, setUsername] = useState("");
	const { linkedAccounts } = useSelector((state) => state.linkedAccountsReducer);
	const { userObject } = useSelector((state) => state.authReducer);

	// When bottom tab button is pressed, scroll to top
	const ref = useRef(null);
	useScrollToTop(ref);

	// Update profile data from source of truth
	const onRefresh = async () => {
		setUsername(userObject.username);
		const retrievedAssets = await PortfolioManager.retrieveAssets(
			userObject.userId
		);
		if (retrievedAssets) {
			setAssetList(retrievedAssets.records);
		}
		if (linkedAccounts.length > 0) {
			{
				linkedAccounts.some((account) => account.is_active) == false
					? await relinkAlert()
					: null;
			}
		}
	};

	// If the user has a linked account but isValid=false in the database
	// This should only happen if something went wrong on our server side
	const relinkAlert = () => {
		Alert.alert(
			"Linked Account Error",
			"One (or more) of your accounts needs to be relinked to Pelleum. Please check the status of your linked account(s)",
			[
				{
					text: "Later",
					onPress: () => {
						/* do nothing */
					},
				},
				{
					text: "View Status",
					onPress: () => navigation.navigate("LinkedAccountsStatusScreen"),
				},
			]
		);
	};

	// If user has already linked all supported accounts (for now it's just Robinhood),
	// show them this alert instead of allowing them to navigate to the LinkAccountScreen
	const alreadyLinkedAlert = () => {
		Alert.alert(
			"Account Already Linked.",
			"Your Robinhood brokerage account is already linked. We'll let you know when Pelleum supports linking other brokerages.",
			[
				{
					text: "Got it!",
					onPress: () => {
						/* do nothing */
					},
				},
			]
		);
	};

	// Call onRefresh when ProfileScreen renders for the first time in a session
	useEffect(() => {
		onRefresh();
	}, []);

	// After a user links or unlinks an account, call onRefresh and reset route params
	if (route.params) {
		if (route.params.accountLinked) {
			onRefresh();
			route.params.accountLinked = false;
		} else if (route.params.onUnlink) {
			onRefresh();
			route.params.onUnlink = false;
		}
	}

	// renderItem function for FlatList
	renderItem = ({ item }) => <AssetBox item={item} nav={navigation} />;

	return (
		<SafeAreaView style={styles.mainContainer}>
			<NativeBaseProvider>
				<FlatList
					showsVerticalScrollIndicator={false}
					data={assetList}
					keyExtractor={(item) => item.asset_symbol}
					renderItem={renderItem}
					ref={ref}
					ListHeaderComponent={
						<View style={styles.listHeaderView}>
							<TouchableOpacity
								style={styles.settingsButton}
								onPress={() => navigation.navigate("SettingsScreen")}
							>
								<FontAwesome
									name="bars"
									size={26}
									color={MAIN_SECONDARY_COLOR}
								/>
							</TouchableOpacity>
							<Image
								style={styles.image}
								source={require("../../assets/defaultProfileImage.png")}
							/>
							<AppText style={styles.usernameText}>@{username}</AppText>
							<View alignItems={"center"} paddingVertical={20}>
								<TouchableOpacity
									style={styles.buttonGroup}
									onPress={async () => {
										navigation.navigate("RationaleScreen", { userId: userObject.userId });
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
										navigation.navigate("AuthoredThesesScreen", { userId: userObject.userId });
									}}
								>
									<HStack style={styles.buttonGroupTextContainer}>
										<MaterialCommunityIcons
											name="book-open-outline"
											size={25}
											color={MAIN_SECONDARY_COLOR}
										/>
										<AppText style={styles.buttonGroupText}>My Theses</AppText>
									</HStack>
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.buttonGroup}
									onPress={async () => {
										navigation.navigate("AuthoredPostsScreen", { userId: userObject.userId });
									}}
								>
									<HStack style={styles.buttonGroupTextContainer}>
										<Octicons
											name="note"
											size={26}
											color={MAIN_SECONDARY_COLOR}
											style={styles.postIcon}
										/>
										<AppText style={styles.buttonGroupText}>My Posts</AppText>
									</HStack>
								</TouchableOpacity>
							</View>
							<HStack style={styles.headerStyle}>
								{assetList.length == 0 ? (
									<View></View>
								) : (
									<AppText style={styles.listHeaderText}>Assets</AppText>
								)}
								<TouchableOpacity
									style={styles.linkAccountButton}
									onPress={() => {
										if (linkedAccounts.length > 0) {
											linkedAccounts.some((account) => account.is_active) == true
												? alreadyLinkedAlert()
												: navigation.navigate("LinkAccountScreen");
										} else {
											navigation.navigate("LinkAccountScreen");
										}
									}}
								>
									<MaterialCommunityIcons
										name="bank-plus"
										size={26}
										color={MAIN_SECONDARY_COLOR}
									/>
								</TouchableOpacity>
							</HStack>
							{assetList.length == 0 ? (
								<AppText style={styles.noBrokerageLinkedText}>
									Put your money where your mouth is - link an account to show
									your skin in the game!💥
								</AppText>
							) : null}
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
		fontSize: 16,
		marginTop: 10,
		fontWeight: "bold",
		alignSelf: "center",
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
		marginLeft: 1.75,
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
		color: MAIN_SECONDARY_COLOR,
	},
	headerStyle: {
		justifyContent: "space-between",
		alignItems: "center",
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
	noBrokerageLinkedText: {
		alignSelf: "center",
		marginTop: 35,
		marginHorizontal: 20,
	},
});