import React, { useState, useEffect, useCallback } from "react";
import {
	StyleSheet,
	Text,
	View,
	FlatList,
	TouchableOpacity,
	RefreshControl,
	Pressable,
} from "react-native";
import { Box, Center, VStack, NativeBaseProvider } from "native-base";
import {
	MaterialIcons,
	Fontisto,
	SimpleLineIcons,
	MaterialCommunityIcons,
	Ionicons,
} from "@expo/vector-icons";

// File imports
import pelleumClient from "../api/PelleumClient";
import colorScheme from "../components/ColorScheme";
import CreateModal from "../components/modals/CreateModal";


const FeedScreen = ({ navigation }) => {
	const [refreshing, setRefreshing] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [posts, setPosts] = useState([]);

	const handleModalNavigate = (screenToNavigateTo) => {
		navigation.navigate(screenToNavigateTo);
	};

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		const authorizedResponse = await pelleumClient({
			method: "get",
			url: "/public/posts/retrieve/many"
		});

		if (authorizedResponse) {
			if (authorizedResponse.status == 200) {
				setPosts(authorizedResponse.data.records.posts);
			} else {
				// need to display "an unexpected error occured"
				console.log("There was an error obtianing feed posts.")
			}
		}
		setRefreshing(false);
	}, [refreshing]);

	useEffect(() => {
		onRefresh();
	}, []);

	return (
		<View style={styles.mainContainer}>
			<FlatList
				data={posts}
				keyExtractor={(item) => item.post_id.toString()}
				renderItem={({ item }) => {
					return (
						<NativeBaseProvider>
							<TouchableOpacity
								onPress={() => {
									navigation.navigate("Post");
								}}
							>
								<Box style={styles.feedPost}>
									<VStack>
										<Center>
											<Box style={styles.topPostBox}>
												<Text style={styles.usernameText}>
													@{item.username}
												</Text>
												<TouchableOpacity
													style={styles.assetButton}
													onPress={() => {
														console.log("Asset button worked.");
													}}
												>
													<Text style={styles.assetText}>
														{item.asset_symbol}
													</Text>
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
											</Box>
										</Center>
										<Box style={styles.postBox}>
											<Text style={styles.titleText}>{item.title}</Text>
											<Text style={styles.contentText}>{item.content}</Text>
										</Box>
										<Box style={styles.buttonBox}>
											<TouchableOpacity
												style={styles.iconButton}
												onPress={() => {
													console.log("Like button worked.");
												}}
											>
												<Ionicons
													name="heart-outline"
													size={24}
													color="#00A8FC"
												/>
											</TouchableOpacity>
											<TouchableOpacity
												style={styles.iconButton}
												onPress={() => {
													console.log("Comment button worked.");
												}}
											>
												<Fontisto name="comment" size={22} color="#00A8FC" />
											</TouchableOpacity>
											<TouchableOpacity
												style={styles.iconButton}
												onPress={() => {
													console.log("Share button worked.");
												}}
											>
												<SimpleLineIcons
													name="action-redo"
													size={24}
													color="#00A8FC"
												/>
											</TouchableOpacity>
											<TouchableOpacity
												style={styles.iconButton}
												onPress={() => {
													console.log("Link button worked.");
												}}
											>
												<MaterialIcons
													name="add-link"
													size={29}
													color="#00A8FC"
												/>
											</TouchableOpacity>
										</Box>
									</VStack>
								</Box>
							</TouchableOpacity>
						</NativeBaseProvider>
					);
				}}
				refreshControl={
					<RefreshControl
						enabled={true}
						colors={["#9Bd35A", "#689F38"]}
						onRefresh={onRefresh}
					/>
				}
				refreshing={refreshing}
				ListHeaderComponent={
					<View>
						<CreateModal
							modalVisible={modalVisible}
							makeModalDisappear={() => setModalVisible(false)}
							onNavigate={handleModalNavigate}
						/>
						<Pressable onPress={() => setModalVisible(true)}>
							<MaterialCommunityIcons
								name="plus-circle"
								size={60}
								color="black"
							/>
						</Pressable>
					</View>
				}
			></FlatList>
		</View>
	);
};

export default FeedScreen;

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
	},
	feedPost: {
		width: "100%",
		padding: 25,
		paddingBottom: 0,
		fontSize: 16,
		backgroundColor: "#ebecf0",
		borderBottomWidth: 2,
		borderBottomColor: "#bfc6c9",
		overflow: "hidden",
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
	postBox: {
		overflow: "visible",
		marginBottom: 20,
	},
	titleText: {
		fontSize: 16,
		fontWeight: "bold",
	},
	contentText: {
		fontSize: 16,
		marginTop: 10,
	},
	topPostBox: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
	},
	buttonBox: {
		alignSelf: "center",
		alignItems: "center",
		width: "95%",
		flexDirection: "row",
		justifyContent: "space-between",
		//borderWidth: 0.5,
		//borderColor: 'red'
	},
	iconButton: {
		paddingHorizontal: 20,
		paddingTop: 5,
		//borderWidth: 0.5,
		//borderColor: 'red'
	},
});
