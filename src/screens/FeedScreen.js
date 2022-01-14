import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	View,
	FlatList,
	RefreshControl,
	TouchableOpacity,
	Text
} from "react-native";

// File imports
import CreateModal from "../components/modals/CreateModal";
import { PostBox, PostBoxType } from "../components/PostBox";
import { getPosts } from "../functions/PostFunctions";
import { getTheses, extractThesesIDs } from "../functions/ThesesFunctions";
import { useDispatch } from 'react-redux';
import { resetLikes } from "../redux/actions/PostReactionsActions";

const FeedScreen = ({ navigation, route }) => {
	// Global State Management
	const dispatch = useDispatch();

	// Local State Management
	const [refreshing, setRefreshing] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [posts, setPosts] = useState([]);
	const [theses, setTheses] = useState([]);

	if (route.params) {
		const newCreatedPost = route.params.newPost ? route.params.newPost : null;
		if (newCreatedPost) {
			const postsCopy = posts;
			postsCopy.splice(0, 0, newCreatedPost);
			setPosts(postsCopy);
			route.params.newPost = null;
		};
	};

	const handleModalNavigate = (screenToNavigateTo) => {
		navigation.navigate(screenToNavigateTo);
	};

	const onRefresh = async () => {
		setRefreshing(true);
		const postResponseData = await getPosts();
		if (postResponseData) {
			setPosts(postResponseData.records.posts);
			dispatch(resetLikes());
		}
		setRefreshing(false);
	};

	useEffect(() => {
		onRefresh();
	}, []);


	const getThesesAsync = async (uniqueThesesIDs) => {
		// This funciton ONLY exists so we can await getTheses...
		const thesesResponseData = await getTheses({thesesIDs: uniqueThesesIDs});
			if (thesesResponseData) {
				setTheses(thesesResponseData.records.theses);
			}
	};


	useEffect(() => {
		const thesesIDs = [];
		for (const post of posts) {
			if (post.thesis_id) {
				thesesIDs.push(post.thesis_id);
			}
		};
		const unique = (value, index, self) => {
			return self.indexOf(value) === index
		}
		  
		const uniqueThesesIDs = thesesIDs.filter(unique)
		  
		if (thesesIDs.length > 0) {
			getThesesAsync(uniqueThesesIDs);
		}
	}, [posts]);

	return (
		<View style={styles.mainContainer}>
			<FlatList
				data={posts}
				keyExtractor={(item) => item.post_id.toString()}
				renderItem={({ item }) => {
					
					if (item.thesis_id) {
						const thesisInPost = theses.find(thesis => {
							return thesis.thesis_id === item.thesis_id;
						})
						if (thesisInPost) {
							item["thesis"] = thesisInPost;
						}
					}

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
					</View>
				}
			></FlatList>
			<TouchableOpacity
				style={styles.fab}
				onPress={() => setModalVisible(true)}
			>
				<Text style={styles.fabIcon}>+</Text>
			</TouchableOpacity>
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
});
