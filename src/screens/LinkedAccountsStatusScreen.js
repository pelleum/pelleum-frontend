import React, { useEffect, useState } from "react";
import {
	StyleSheet,
	View,
	FlatList,
	TouchableOpacity,
	Image,
	Alert,
} from "react-native";
import { NativeBaseProvider, HStack } from "native-base";
import LinkAccountsManager from "../managers/LinkAccountsManager";
import { Entypo } from "@expo/vector-icons";
import AppText from "../components/AppText";
import {
	BAD_COLOR,
	MAIN_DIFFERENTIATOR_COLOR,
	MAIN_SECONDARY_COLOR,
	LIGHT_GREY_COLOR,
} from "../styles/Colors";
import { useSelector } from "react-redux";
import { useAnalytics } from '@segment/analytics-react-native';

const LinkedAccountsStatusScreen = ({ navigation }) => {
	// State Management
	const [errorMessage, setErrorMessage] = useState("");
	const { linkedAccounts } = useSelector(
		(state) => state.linkedAccountsReducer
	);

	// Segment Tracking
	const { track } = useAnalytics();

	const getAccountsStatus = async () => {
		await LinkAccountsManager.getLinkedAccountsStatus();
	};

	const unlinkAlert = async () => {
		Alert.alert(
			"Unlink Brokerage Account",
			"Are you sure you want to unlink? By unlinking, the asset information related to this acount will be removed from your Pelleum portfolio. You can always relink if you choose to.",
			[
				{
					text: "Cancel",
					style: "cancel",
					onPress: () => {
						/* do nothing */
					},
				},
				{
					text: "Unlink",
					style: "destructive",
					onPress: async () => {
						const response = await LinkAccountsManager.unlinkAccount();
						if (response.status == 200) {
							track('Account Unlinked', {
								institution_id: process.env.REACT_APP_ROBINHOOD_ID,
							});
							navigation.navigate("ProfileScreen", { onUnlink: true });
						} else {
							setErrorMessage(
								"An unexpected error occurred. Please try again later."
							);
						}
					},
				},
			]
		);
	};

	useEffect(() => {
		getAccountsStatus();
	}, []);

	renderItem = ({ item }) => (
		<HStack style={styles.itemBox}>
			<HStack alignItems="center">
				<Image
					style={styles.accountImage}
					source={require("../../assets/robinhood.png")}
				/>
				<AppText style={styles.accountNameText}>{item.name}</AppText>
			</HStack>
			{item.is_active ? (
				<HStack alignItems="center">
					<AppText style={styles.activeText}>ACTIVE</AppText>
					<TouchableOpacity
						style={styles.enabledDotsButton}
						onPress={() => {
							unlinkAlert();
						}}
					>
						<Entypo
							name="dots-three-horizontal"
							size={18}
							color={LIGHT_GREY_COLOR}
						/>
					</TouchableOpacity>
				</HStack>
			) : (
				<HStack alignItems="center">
					<TouchableOpacity
						style={styles.relinkUnlinkButton}
						onPress={() => navigation.navigate("LinkAccountScreen")}
					>
						<AppText style={styles.linkButtonText}>Relink</AppText>
					</TouchableOpacity>
					<AppText style={styles.inactiveText}>INACTIVE</AppText>
					<TouchableOpacity
						style={styles.enabledDotsButton}
						onPress={() => {
							unlinkAlert();
						}}
					>
						<Entypo
							name="dots-three-horizontal"
							size={18}
							color={LIGHT_GREY_COLOR}
						/>
					</TouchableOpacity>
				</HStack>
			)}
		</HStack>
	);

	return (
		<View style={styles.mainContainer}>
			<NativeBaseProvider>
				{linkedAccounts.length == 0 ? (
					<View>
						<AppText style={styles.noAccountsLinkedText}>
							You have no linked brokerage accounts. Add your skin in the game
							by linking your brokerage account!💥
						</AppText>
						<TouchableOpacity
							style={styles.linkAccountButton}
							onPress={() => navigation.navigate("LinkAccountScreen")}
						>
							<AppText style={styles.buttonTextStyle}>
								Link a Brokerage Account
							</AppText>
						</TouchableOpacity>
					</View>
				) : (
					<FlatList
						width={"100%"}
						data={linkedAccounts}
						keyExtractor={(item) => item.connection_id}
						renderItem={renderItem}
						ListHeaderComponent={
							<>
								{errorMessage ? (
									<AppText style={styles.error}>{errorMessage}</AppText>
								) : null}
							</>
						}
					></FlatList>
				)}
			</NativeBaseProvider>
		</View>
	);
};

export default LinkedAccountsStatusScreen;

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
	},
	itemBox: {
		marginVertical: 2,
		alignSelf: "center",
		borderRadius: 23,
		width: "98%",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 14,
		backgroundColor: MAIN_DIFFERENTIATOR_COLOR,
	},
	accountNameText: {
		fontSize: 16,
		fontWeight: "bold",
	},
	accountImage: {
		width: 30,
		height: 30,
		resizeMode: "contain",
	},
	activeText: {
		fontSize: 15,
		color: MAIN_SECONDARY_COLOR,
		marginLeft: 10,
	},
	inactiveText: {
		fontSize: 15,
		color: BAD_COLOR,
		marginLeft: 10,
	},
	linkButtonText: {
		fontSize: 15,
		color: MAIN_SECONDARY_COLOR,
	},
	relinkUnlinkButton: {
		fontSize: 15,
		padding: 8,
	},
	error: {
		alignSelf: "center",
		color: BAD_COLOR,
		marginTop: 15,
		marginBottom: 25,
		fontSize: 14,
	},
	noAccountsLinkedText: {
		alignSelf: "center",
		marginTop: 80,
		marginHorizontal: 40,
	},
	buttonTextStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
		fontSize: 15,
	},
	linkAccountButton: {
		alignSelf: "center",
		borderRadius: 30,
		padding: 11,
		marginTop: 30,
		width: "84%",
		backgroundColor: MAIN_SECONDARY_COLOR,
		elevation: 2,
	},
	enabledDotsButton: {
		paddingVertical: 15,
		paddingLeft: 20,
		paddingRight: 10,
	},
});
