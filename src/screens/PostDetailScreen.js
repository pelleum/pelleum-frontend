import React from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Pressable,
} from "react-native";
import { HStack, NativeBaseProvider } from "native-base";
import {
	MaterialIcons,
	Fontisto,
	SimpleLineIcons,
	Ionicons,
} from "@expo/vector-icons";

const PostDetailScreen = ({ navigation, route }) => {
	const item = route.params;

	return (
		<NativeBaseProvider>
			<View style={styles.postContainer}>
				<HStack style={styles.topPostBox}>
					<Text style={styles.usernameText}>@{item.username}</Text>
					<TouchableOpacity
						style={styles.assetButton}
						onPress={() => {
							console.log("Asset button worked.");
						}}
					>
						<Text style={styles.assetText}>{item.asset_symbol}</Text>
					</TouchableOpacity>
					<Text
						style={
							item.sentiment === "Bull"
								? styles.bullSentimentText
								: styles.bearSentimentText
						}
					>
						{item.sentiment}
					</Text>
				</HStack>
                <Text style={styles.contentText}>{item.content}</Text>
                <Pressable
					style={styles.button}
					onPress={() => navigation.navigate("PortfolioInsight", {
						username: item.username,
						userId: item.user_id
					})}
				>
					<Text style={styles.buttonTextStyle}>View Author's Portfolio</Text>
				</Pressable>
			</View>
			<View>
				<HStack style={styles.buttonBox}>
					<TouchableOpacity
						style={styles.iconButton}
						onPress={() => {
							console.log("Comment button worked.");
						}}
					>
						<Fontisto name="comment" size={19} color="#00A8FC" />
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.iconButton}
						onPress={() => {
							console.log("Like button worked.");
						}}
					>
						<Ionicons name="heart-outline" size={24} color="#00A8FC" />
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.iconButton}
						onPress={() => {
							console.log("Link button worked.");
						}}
					>
						<MaterialIcons name="add-link" size={29} color="#00A8FC" />
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.iconButton}
						onPress={() => {
							console.log("Share button worked.");
						}}
					>
						<SimpleLineIcons name="action-redo" size={22} color="#00A8FC" />
					</TouchableOpacity>
				</HStack>
			</View>
		</NativeBaseProvider>
	);
};

PostDetailScreen.navigationOptions = () => {
	return {
		headerShown: false,
	};
};

export default PostDetailScreen;

const styles = StyleSheet.create({
	postContainer: {
		marginHorizontal: 15,
		paddingTop: 20,
		borderBottomWidth: 0.5,
		borderBottomColor: "#00A8FC",
	},
	buttonBox: {
		paddingTop: 5,
		alignSelf: "center",
		alignItems: "center",
		width: "85%",
		flexDirection: "row",
		justifyContent: "space-between",
	},
	bullSentimentText: {
		textAlign: "center",
		width: 70,
		borderWidth: 0.5,
		backgroundColor: "#c6edc5",
		borderColor: "#1c7850",
		borderRadius: 15,
		padding: 5,
		marginBottom: 10,
		justifyContent: "center",
		color: "#1c7850",
		fontSize: 16,
		fontWeight: "bold",
		overflow: "hidden",
	},
	bearSentimentText: {
		textAlign: "center",
		width: 70,
		borderWidth: 0.5,
		backgroundColor: "#edcec5",
		borderColor: "#b02802",
		borderRadius: 15,
		padding: 5,
		marginBottom: 10,
		justifyContent: "center",
		color: "#b02802",
		fontSize: 16,
		fontWeight: "bold",
		overflow: "hidden",
	},
	usernameText: {
		padding: 5,
		marginBottom: 10,
		justifyContent: "center",
		color: "#026bd4",
		fontSize: 16,
	},
	assetButton: {
		width: 70,
		borderWidth: 0.5,
		backgroundColor: "white",
		borderColor: "#026bd4",
		borderRadius: 15,
		padding: 5,
		marginBottom: 10,
		color: "#026bd4",
		alignItems: "center",
	},
	assetText: {
		color: "#026bd4",
		fontSize: 16,
		fontWeight: "bold",
	},
	topPostBox: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
	},
	contentText: {
		fontSize: 16,
        marginTop: 20,
        marginHorizontal: 15,
		marginBottom: 30
	},
	button: {
		alignSelf: "center",
		borderRadius: 30,
		padding: 11,
		marginBottom: 5,
		width: "100%",
		backgroundColor: "#00A8FC",
		elevation: 2,
	},
	buttonTextStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
		fontSize: 15,
	},
	iconButton: {
		//add styles here
	},
});
