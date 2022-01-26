import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
	StyleSheet,
	View,
	SafeAreaView,
	FlatList,
	TouchableOpacity,
	Text
} from "react-native";

// File imports
import CreateModal from "../components/modals/CreateModal";
import PostBox, { PostBoxType } from "../components/PostBox";
import PostsManager from "../managers/PostsManager";
import { useDispatch } from 'react-redux';
import { resetLikes } from "../redux/actions/PostReactionsActions";

const FeedScreen = ({ navigation, route }) => {
	// Global State Management
	const dispatch = useDispatch();

	// Local State Management
	const [refreshing, setRefreshing] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [posts, setPosts] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [errorMessage, setErrorMessage] = useState("");

	const RECORDS_PER_PAGE = 10;

	const handleModalNavigate = (screenToNavigateTo) => {
		navigation.navigate(screenToNavigateTo);
	};

	const onRefresh = async () => {
		setRefreshing(true);
		const queryParams = { records_per_page: RECORDS_PER_PAGE, page: 1 };
		const postResponseData = await PostsManager.getPosts(queryParams);
		if (postResponseData) {
			setErrorMessage("");
			setPosts(postResponseData.records.posts);
			setTotalPages(postResponseData.meta_data.total_pages);
			dispatch(resetLikes());
		} else {
			setErrorMessage("There was an error retrieving posts. Please try again later.");
		};
		setRefreshing(false);
	};

	const getMorePosts = async () => {
		setRefreshing(true);
		let newPageNumber;
		let responseData;
		let queryParams;
		newPageNumber = currentPage + 1;
		setCurrentPage(newPageNumber);
		if (newPageNumber < totalPages) {
			queryParams = { records_per_page: RECORDS_PER_PAGE, page: newPageNumber };
			responseData = await PostsManager.getPosts(queryParams);
			if (responseData) {
				setPosts(currentPosts => [...currentPosts, ...responseData.records.posts]);
			} else {
				setErrorMessage("There was an error retrieving posts. Please try again later.");
			};
		};
		setRefreshing(false);
	};

	useEffect(() => {
		onRefresh();
	}, []);

	if (route.params) {
		const newCreatedPost = route.params.newPost ? route.params.newPost : null;

		if (newCreatedPost) {
			const postsCopy = posts;
			postsCopy.unshift(newCreatedPost);
			setPosts(postsCopy);
			route.params.newPost = null;
		};
	};

	return (
		<SafeAreaView style={styles.mainContainer}>
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
					refreshing = { refreshing }
				onRefresh={onRefresh}
				onEndReached={getMorePosts}
				onEndReachedThreshold={2.5}
			></FlatList>
			{errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
			<CreateModal
				modalVisible={modalVisible}
				makeModalDisappear={() => setModalVisible(false)}
				onNavigate={handleModalNavigate}
			/>
			<TouchableOpacity
				style={styles.fab}
				onPress={() => setModalVisible(true)}
			>
				<Text style={styles.fabIcon}>+</Text>
			</TouchableOpacity>
		</SafeAreaView>
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
	//Floating Action Button
	fab: {
		position: 'absolute',
		width: 56,
		height: 56,
		alignItems: 'center',
		justifyContent: 'center',
		right: 20,
		bottom: 20,
		backgroundColor: 'white',
		borderRadius: 30,
		elevation: 8,
		borderWidth: 2,
		borderColor: '#026bd4',

	},
	fabIcon: {
		fontSize: 40,
		color: '#026bd4',
		fontWeight: 'bold',
		paddingHorizontal: 5,
		paddingBottom: 3,
	},
	error: {
		color: 'red',
		marginTop: 15,
		marginBottom: 25,
		fontSize: 14,
	},
});
