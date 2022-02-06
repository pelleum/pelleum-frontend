import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	SafeAreaView,
	VirtualizedList,
	TouchableOpacity,
} from "react-native";

// File imports
import CreateModal from "../components/modals/CreateModal";
import PostBox, { PostBoxType } from "../components/PostBox";
import PostsManager from "../managers/PostsManager";
import AppText from "../components/AppText";
import { BAD_COLOR, LIGHT_GREY_COLOR } from "../styles/Colors";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { resetLikes } from "../redux/actions/PostReactionsActions";
import { setPosts } from "../redux/actions/PostActions";


const FeedScreen = ({ navigation, route }) => {
	// Global State Management
	const { posts } = useSelector((state) => state.postReducer);
	const dispatch = useDispatch();

	// Local State Management
	const [refreshing, setRefreshing] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [errorMessage, setErrorMessage] = useState("");

	const RECORDS_PER_PAGE = 20;

	const handleModalNavigate = (screenToNavigateTo) => {
		navigation.navigate(screenToNavigateTo);
	};

	const onRefresh = async () => {
		setRefreshing(true);
		const queryParams = { records_per_page: RECORDS_PER_PAGE, page: 1 };
		const postResponseData = await PostsManager.getPosts(queryParams);
		if (postResponseData) {
			setErrorMessage("");
			dispatch(setPosts(postResponseData.records.posts));
			setCurrentPage(1);
			setTotalPages(postResponseData.meta_data.total_pages);
			dispatch(resetLikes());
		} else {
			setErrorMessage(
				"There was an error retrieving posts. Please try again later."
			);
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
				// Append new posts to currentPosts
				const currentPosts = posts;
				currentPosts.push(...responseData.records.posts);
				// Filter out duplicate values
				const uniquePostsSet = new Set();
				uniquePosts = currentPosts.filter(function (post) {
					const isPresentInSet = uniquePostsSet.has(post.post_id);
					uniquePostsSet.add(post.post_id);
					return !isPresentInSet;
				});
				dispatch(setPosts(uniquePosts));
			} else {
				setErrorMessage(
					"There was an error retrieving posts. Please try again later."
				);
			};
		};
		setRefreshing(false);
	};

	useEffect(() => {
		onRefresh();
	}, []);

	renderItem = ({ item }) => (<PostBox postBoxType={PostBoxType.Feed} item={item} nav={navigation} />);

	return (
		<SafeAreaView style={styles.mainContainer}>
			<VirtualizedList
				width={"100%"}
				data={posts}
				keyExtractor={(item, index) => item.post_id}
				renderItem={renderItem}
				getItem={(data, index) => data[index]}
				getItemCount={data => data.length}
				refreshing={refreshing}
				onRefresh={onRefresh}
				onEndReached={getMorePosts}
				onEndReachedThreshold={1}
			></VirtualizedList>
			{errorMessage ? (
				<AppText style={styles.error}>{errorMessage}</AppText>
			) : null}
			<CreateModal
				modalVisible={modalVisible}
				makeModalDisappear={() => setModalVisible(false)}
				onNavigate={handleModalNavigate}
			/>
			<TouchableOpacity
				style={styles.fab}
				onPress={() => setModalVisible(true)}
			>
				<AppText style={styles.fabIcon}>+</AppText>
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
		position: "absolute",
		width: 56,
		height: 56,
		alignItems: "center",
		justifyContent: "center",
		right: 20,
		bottom: 20,
		backgroundColor: "#49E131",
		borderRadius: 30,
		shadowOffset: { width: 0, height: 0 },
		shadowColor: LIGHT_GREY_COLOR,
		shadowRadius: 10,
		shadowOpacity: 0.7,
	},
	fabIcon: {
		fontSize: 40,
		color: "white",
		fontWeight: "bold",
		paddingHorizontal: 5,
		paddingBottom: 3,
	},
	error: {
		color: BAD_COLOR,
		marginTop: 15,
		marginBottom: 25,
		fontSize: 14,
	},
});
