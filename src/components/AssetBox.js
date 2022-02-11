import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { Center, VStack, HStack, NativeBaseProvider } from "native-base";
import {
	MAIN_DIFFERENTIATOR_COLOR,
	MAIN_SECONDARY_COLOR,
} from "../styles/Colors";
import AppText from "./AppText";
import { useSelector } from "react-redux";

const AssetBox = ({ item, nav, portfolioInsightRationales = null }) => {
	const { rationaleLibrary } = useSelector((state) => state.rationaleReducer);

	const hasRationales = portfolioInsightRationales ? (
		portfolioInsightRationales.some(
			(rationale) => rationale.thesis.asset_symbol === item.asset_symbol
		)
	) : (
		rationaleLibrary.some(
			(rationale) => rationale.asset === item.asset_symbol
		)
	)

	return (
		<NativeBaseProvider>
			<View style={styles.assetTableBox}>
				<VStack>
					<TouchableOpacity
						style={styles.assetButton}
						onPress={() => {
							console.log("Asset button worked.");
						}}
					>
						<AppText style={styles.assetButtonText}>
							{item.asset_symbol}
						</AppText>
					</TouchableOpacity>
					<TouchableOpacity
						style={hasRationales ? styles.thesisButton : styles.disabledThesisButton}
						disabled={hasRationales ? false : true}
						onPress={() => {
							nav.navigate("Rationales", {
								asset: item.asset_symbol,
								userId: item.user_id,
								disableRemoveRationale: portfolioInsightRationales ? true : false,
							});
						}}
					>
						<AppText style={styles.thesisButtonText}>Rationales</AppText>
					</TouchableOpacity>
				</VStack>
				<VStack>
					<HStack>
						<AppText style={styles.valueText}>Shares:</AppText>
						<AppText style={styles.valueNumbers}>{item.quantity.toFixed(2)}</AppText>
					</HStack>
					<HStack>
						<AppText style={styles.valueText}>Avg Buy Price:</AppText>
						<AppText style={styles.valueNumbers}>
							${item.average_buy_price.toFixed(2)}
						</AppText>
					</HStack>
				</VStack>
			</View>
		</NativeBaseProvider>
	);
};

export default React.memo(AssetBox);

const styles = StyleSheet.create({
	assetTableBox: {
		backgroundColor: MAIN_DIFFERENTIATOR_COLOR,
		borderRadius: 23,
		width: "98%",
		overflow: "hidden",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		padding: 14,
		marginTop: 2,
	},
	assetButton: {
		overflow: "hidden",
		backgroundColor: "white",
		borderRadius: 23,
		marginVertical: 3,
		height: 30,
		width: 100,
		justifyContent: "center",
		alignItems: "center",
	},
	assetButtonText: {
		fontSize: 15,
		color: MAIN_DIFFERENTIATOR_COLOR,
		fontWeight: "bold",
	},
	thesisButton: {
		overflow: "hidden",
		backgroundColor: MAIN_SECONDARY_COLOR,
		borderRadius: 23,
		marginVertical: 3,
		height: 30,
		width: 100,
		justifyContent: "center",
		alignItems: "center",
	},
	disabledThesisButton: {
		overflow: "hidden",
		backgroundColor: MAIN_SECONDARY_COLOR,
		borderRadius: 30,
		marginVertical: 3,
		height: 30,
		width: 100,
		justifyContent: "center",
		alignItems: "center",
		opacity: 0.2,
	},
	thesisButtonText: {
		fontSize: 15,
		color: "white",
		fontWeight: "bold",
	},
	valueText: {
		fontSize: 15,
		paddingVertical: 5,
		marginVertical: 3,
		marginLeft: 27,
		width: 110,
		textAlign: "left",
	},
	valueNumbers: {
		fontSize: 15,
		fontWeight: "bold",
		marginVertical: 8,
		width: 85,
		textAlign: "right",
	},
});
