import React, { useEffect } from "react";
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
import { useSelector } from "react-redux";
import AppText from "../components/AppText";
import {
	BAD_COLOR,
	GOOD_COLOR,
	LINK_COLOR,
	MAIN_DIFFERENTIATOR_COLOR,
} from "../styles/Colors";

const LinkedAccountsStatus = ({ navigation }) => {
	const { activeAccounts } = useSelector(
		(state) => state.linkedAccountsReducer
	);

	const getAccountsStatus = async () => {
		await LinkAccountsManager.getLinkedAccountsStatus();
	};

	const unlinkAlert = async () => {
		Alert.alert(
			"Are you sure you want to unlink?",
			"By unlinking, the asset information related to this acount will be removed from your Pelleum portfolio. You can always relink if you choose to.",
			[
				{ text: "Cancel", style: 'cancel', onPress: () => {/* do nothing */ } },
				{ text: "Unlink", style: 'destructive', onPress: async () => {
					await LinkAccountsManager.unlinkAccount();
				}},
			]
		);
	};

	useEffect(() => {
		getAccountsStatus();
	}, []);

	return (
		<View style={styles.mainContainer}>
			<NativeBaseProvider>
				<FlatList
					width={"100%"}
					data={activeAccounts}
					keyExtractor={(item) => item.connection_id}
					renderItem={({ item }) => (
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
									<TouchableOpacity
										style={styles.relinkUnlinkButton}
										onPress={() => unlinkAlert()}
									>
										<AppText style={styles.linkButtonText}>Unlink</AppText>
									</TouchableOpacity>
									<AppText style={styles.activeText}>ACTIVE</AppText>
								</HStack>
							) : (
								<HStack alignItems="center">
									<TouchableOpacity
										style={styles.relinkUnlinkButton}
										onPress={() => navigation.navigate("Link")}
									>
										<AppText style={styles.linkButtonText}>Relink</AppText>
									</TouchableOpacity>
									<AppText style={styles.inactiveText}>NOT ACTIVE</AppText>
								</HStack>
							)}
						</HStack>
					)}
				></FlatList>
			</NativeBaseProvider>
		</View>
	);
};

export default LinkedAccountsStatus;

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
	},
	itemBox: {
		marginVertical: 2,
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
		color: GOOD_COLOR,
		marginLeft: 10,
	},
	inactiveText: {
		fontSize: 15,
		color: BAD_COLOR,
		marginLeft: 10,
	},
	linkButtonText: {
		fontSize: 15,
		color: LINK_COLOR,
	},
	relinkUnlinkButton: {
		fontSize: 15,
		padding: 8,
	},
});
