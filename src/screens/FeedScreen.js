import React, { useState, useEffect, useCallback } from "react";
import {
	StyleSheet,
	View,
	FlatList,
	RefreshControl,
	Pressable,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// File imports
import CreateModal from "../components/modals/CreateModal";
import { PostBox, PostBoxType } from "../components/PostBox";
import { getPosts } from "../functions/PostFunctions";
import { useDispatch } from 'react-redux';
import { resetLikes } from "../redux/actions/likesActions";

const FeedScreen = ({ navigation }) => {
	// Global State Management
	const dispatch = useDispatch();
	// Local State Management
	const [refreshing, setRefreshing] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [posts, setPosts] = useState([]);

	const handleModalNavigate = (screenToNavigateTo) => {
		navigation.navigate(screenToNavigateTo);
	};

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		const retrievedPosts = await getPosts();
		if (retrievedPosts) {
			setPosts(retrievedPosts);
			dispatch(resetLikes());
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
						<PostBox
							postBoxType={PostBoxType.Feed}
							item={item}
							nav={navigation}
						/>
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
	iconButton: {
		paddingHorizontal: 20,
		paddingTop: 5,
		//borderWidth: 0.5,
		//borderColor: 'red'
	},
});
