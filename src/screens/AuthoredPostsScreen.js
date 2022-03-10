import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, TouchableOpacity } from "react-native";
import PostBox, { PostBoxType } from "../components/PostBox";
import AppText from "../components/AppText";
import PostsManager from "../managers/PostsManager";
import { BAD_COLOR, MAIN_SECONDARY_COLOR } from "../styles/Colors";
// Redux
import { useSelector, useDispatch } from "react-redux";
import { setAuthoredPosts } from "../redux/actions/PostActions";

const AuthoredPostsScreen = ({ navigation, route }) => {
	// Universal State Management
	const { userAuthoredPosts } = useSelector((state) => state.postReducer);
	const dispatch = useDispatch();

	// Local State Management
	const [errorMessage, setErrorMessage] = useState("");

	const userId = route.params.userId ? route.params.userId : null;

	const getAuthoredPosts = async () => {
		const retrievedPosts = await PostsManager.getPosts({ user_id: userId });
		if (retrievedPosts) {
			dispatch(setAuthoredPosts(retrievedPosts.records.posts));
		} else {
			setErrorMessage("There was an error obtaining posts from the backend.");
		}
	};

	//on first render
	useEffect(() => {
		getAuthoredPosts();
	}, []);

	renderItem = ({ item }) => (
		<PostBox
			postBoxType={PostBoxType.UserAuthored}
			item={item}
			nav={navigation}
		/>
	);

	return (
		<View style={styles.mainContainer}>
			{errorMessage ? (
				<AppText style={styles.error}>{errorMessage}</AppText>
			) : null}
			{userAuthoredPosts.length == 0 ? (
				<View>
					<AppText style={styles.noPostsText}>
						You haven't created a post yet. When you do, they'll show up here!💥
					</AppText>
					<TouchableOpacity
						style={styles.createPostButton}
						onPress={() => navigation.navigate("CreatePostScreen")}
					>
						<AppText style={styles.buttonTextStyle}>
							Create Post
						</AppText>
					</TouchableOpacity>
				</View>
			) : (
				<FlatList
					width={"100%"}
					data={userAuthoredPosts}
					keyExtractor={(item) => item.post_id}
					renderItem={renderItem}
				></FlatList>
			)}
		</View>
	);
};

export default AuthoredPostsScreen;

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
	},
	title: {
		fontSize: 16,
		fontWeight: "bold",
		alignSelf: "center",
	},
	error: {
		color: BAD_COLOR,
		marginTop: 15,
		marginBottom: 25,
		fontSize: 14,
		alignSelf: "center",
	},
	createPostButton: {
		alignSelf: "center",
		borderRadius: 30,
		padding: 11,
		marginTop: 30,
		width: "84%",
		backgroundColor: MAIN_SECONDARY_COLOR,
		elevation: 2,
	},
	noPostsText: {
		alignSelf: "center",
		marginTop: 80,
		marginHorizontal: 40,
	},
	buttonTextStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
		fontSize: 15,
	},
});
