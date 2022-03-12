import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	SafeAreaView,
	FlatList,
	TouchableOpacity,
	Platform,
	StatusBar,
} from "react-native";

// File imports
import CreateModal from "../components/modals/CreateModal";
import PostBox, { PostBoxType } from "../components/PostBox";
import PostsManager from "../managers/PostsManager";
import AppText from "../components/AppText";
import { BAD_COLOR, LIGHT_GREY_COLOR, MAIN_SECONDARY_COLOR } from "../styles/Colors";
import { FEED_RECORDS_PER_PAGE } from "../constants/PostsConstants";

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

	const handleModalNavigate = (screenToNavigateTo) => {
		navigation.navigate(screenToNavigateTo);
	};

	const onRefresh = async () => {
		setRefreshing(true);
		const queryParams = { records_per_page: FEED_RECORDS_PER_PAGE, page: 1 };
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
			queryParams = { records_per_page: FEED_RECORDS_PER_PAGE, page: newPageNumber };
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
			<FlatList
				width={"100%"}
				data={posts}
				keyExtractor={(item) => item.post_id}
				renderItem={renderItem}
				refreshing={refreshing}
				onRefresh={onRefresh}
				onEndReached={getMorePosts}
				onEndReachedThreshold={1}
			></FlatList>
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
		paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
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
		backgroundColor: MAIN_SECONDARY_COLOR,
		borderRadius: 30,
		shadowOffset: { width: 0, height: 0 },
		shadowColor: LIGHT_GREY_COLOR,
		shadowRadius: 10,
		shadowOpacity: 0.6,
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
