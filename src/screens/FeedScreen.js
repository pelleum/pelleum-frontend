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
import * as SecureStore from "expo-secure-store";

// File imports
import pelleumClient from "../api/PelleumClient";
import CreateModal from "../components/modals/CreateModal";

const FeedScreen = ({ navigation }) => {
	const [refreshing, setRefreshing] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [posts, setPosts] = useState([]);
	const [usersLikedPosts, setUsersLikedPosts] = useState([]);

	const handleModalNavigate = (screenToNavigateTo) => {
		navigation.navigate(screenToNavigateTo);
	};

	const getPosts = async () => {
		const authorizedResponse = await pelleumClient({
			method: "get",
			url: "/public/posts/retrieve/many",
		});

		if (authorizedResponse) {
			if (authorizedResponse.status == 200) {
				const retrievedPosts = authorizedResponse.data.records.posts;
				const timeRange = {
					oldestPostCreatedAt: retrievedPosts.slice(-1)[0].created_at,
					newestPostCreatedAt: retrievedPosts[0].created_at,
				};
				const getPostsObject = {
					retrievedPosts: retrievedPosts,
					timeRange: timeRange,
				};
				return getPostsObject;
			}
			// need to display "an unexpected error occured"
			console.log("There was an error obtianing feed posts.");
		}
	};

	const getUserLikes = async (timeRange) => {
		const userObjectString = await SecureStore.getItemAsync("userObject");
		const userObject = JSON.parse(userObjectString);

		const authorizedResponse = await pelleumClient({
			method: "get",
			url: "/public/posts/reactions/retrieve/many",
			queryParams: {
				user_id: userObject.user_id,
				start_time: timeRange.oldestPostCreatedAt,
				end_time: timeRange.newestPostCreatedAt,
			},
		});

		if (authorizedResponse) {
			if (authorizedResponse.status == 200) {
				const likedPosts = [];
				const usersPostReactions =
					authorizedResponse.data.records.posts_reactions;
				Object.values(usersPostReactions).forEach((value) =>
					likedPosts.push(value.post_id)
				);
				return likedPosts;
			}
			// need to display "an unexpected error occured"
			console.log("There was an error obtianing user's liked posts.");
		}
	};

	const sendReaction = async (post_id) => {
		// Like or un-like a post
		const usersLikedPostsCopy = usersLikedPosts;
		if (usersLikedPosts.includes(post_id)) {
			const authorizedResponse = await pelleumClient({
				method: "delete",
				url: `/public/posts/reactions/${post_id}`,
			});
			if (authorizedResponse.status == 204) {
				const updatedUsersLikedPosts = usersLikedPostsCopy.filter(function (
					elem
				) {
					return elem !== post_id;
				});
				setUsersLikedPosts(updatedUsersLikedPosts);
			} else {
				console.log("There was an error un-liking a post.")
			}
		} else {
			const authorizedResponse = await pelleumClient({
				method: "post",
				url: `/public/posts/reactions/${post_id}`,
				data: {reaction: 1}
			});
			if (authorizedResponse.status == 201) {
				//usersLikedPostsCopy.push(post_id)
				setUsersLikedPosts(usersLikedPosts => [...usersLikedPosts, post_id]);
			} else {
				console.log("There was an error liking a post.")
			}
		}
	};

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		const postsObject = await getPosts();
		if (postsObject) {
			setPosts(postsObject.retrievedPosts);
			const likedPosts = await getUserLikes(postsObject.timeRange);
			if (likedPosts) {
				setUsersLikedPosts(likedPosts);
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
									navigation.navigate("Post", item);
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

										<Text style={styles.contentText}>{item.content}</Text>

										<Box style={styles.buttonBox}>
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
												onPress={() => sendReaction(item.post_id)}
											>
												<Ionicons
													name="heart-outline"
													size={24}
													color={
														usersLikedPosts.includes(item.post_id)
															? "pink"
															: "#00A8FC"
													}
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
											<TouchableOpacity
												style={styles.iconButton}
												onPress={() => {
													console.log("Share button worked.");
												}}
											>
												<SimpleLineIcons
													name="action-redo"
													size={22}
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
	contentText: {
		fontSize: 16,
		margin: 15,
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
