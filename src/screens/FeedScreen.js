import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Box, Center, VStack, NativeBaseProvider } from "native-base";
import PelleumPublic from "../api/PelleumPublic";
import { MaterialIcons, FontAwesome, Ionicons, Fontisto, SimpleLineIcons } from '@expo/vector-icons';
import colorScheme from "../components/ColorScheme";

const FeedScreen = ({ navigation }) => {
    const [posts, setPosts] = useState([]);
    // 1. State is initialiized to empty list
    // 2. Make API call, and get latest posts
    // 3. When a user pulls down, make another API call and update list with latest posts

    const onRefresh = async () => {
        console.log('\nRefresh worked!');
        let response;
        try {
            response = await PelleumPublic.get('/public/posts/retrieve/many');
            setPosts(response.data.records.posts)
            console.log("\n", response.status);
        } catch (err) {
            console.log("\n", err);
            console.log("\n", err.response.status);
            console.log("\n", err.response.data);
        };
    };

    useEffect(() => {
        console.log("\nFirst render!")
        onRefresh()
    }, []);

    return (
        <View style={styles.mainContainer}>
            <FlatList
                data={posts}
                keyExtractor={item => item.post_id.toString()}
                renderItem={({ item }) => {
                    return (
                        <NativeBaseProvider>
                            <TouchableOpacity onPress={() => { navigation.navigate("Post") }} >
                                <Box style={styles.feedPost}>
                                    <VStack>
                                        <Center>
                                            <Box style={styles.topPostBox}>
                                                <Text style={styles.usernameText}>@{item.username}</Text>
                                                <TouchableOpacity
                                                    style={styles.assetButton}
                                                    onPress={() => {
                                                        console.log("Asset button worked.");
                                                        console.log(colorScheme)
                                                    }}
                                                >
                                                    <Text style={styles.assetText}>{item.asset_symbol}</Text>
                                                </TouchableOpacity>
                                                <Text
                                                    style={item.sentiment === "Bull" ? styles.bullSentimentText : styles.bearSentimentText}
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
                                                    console.log(colorScheme)
                                                }}
                                            >
                                                <Ionicons name="ios-thumbs-up-outline" size={23} color="#00A8FC" />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.iconButton}
                                                onPress={() => {
                                                    console.log("Comment button worked.");
                                                    console.log(colorScheme)
                                                }}
                                            >
                                                <Fontisto name="comment" size={22} color="#00A8FC" />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.iconButton}
                                                onPress={() => {
                                                    console.log("Share button worked.");
                                                    console.log(colorScheme)
                                                }}
                                            >
                                                <SimpleLineIcons name="action-redo" size={24} color="#00A8FC" />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.iconButton}
                                                onPress={() => {
                                                    console.log("Link button worked.");
                                                    console.log(colorScheme)
                                                }}
                                            >
                                                <MaterialIcons name="add-link" size={29} color="#00A8FC" />
                                            </TouchableOpacity>
                                        </Box>
                                    </VStack>
                                </Box>
                            </TouchableOpacity>
                        </NativeBaseProvider>
                    )
                }}
                refreshControl={< RefreshControl
                    enabled={true}
                    colors={["#9Bd35A", "#689F38"]}
                    //refreshing={console.log('loading worked')}
                    onRefresh={onRefresh} />}
            >
            </FlatList >
        </View >
    );
};

export default FeedScreen;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1, //this ensures that the container (view) fills up max vertical space
    },
    feedPost: {
        width: '100%',
        padding: 25,
        paddingBottom: 0,
        fontSize: 16,
        backgroundColor: "#ebecf0",
        borderBottomWidth: 2,
        borderBottomColor: "#bfc6c9",
        overflow: "hidden"
    },
    bullSentimentText: {
        textAlign: 'center',
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
        overflow: "hidden"
    },
    bearSentimentText: {
        textAlign: 'center',
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
        overflow: "hidden"
    },
    usernameText: {
        padding: 5,
        marginBottom: 10,
        justifyContent: "center",
        color: "#026bd4",
        fontSize: 16
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
        alignItems: 'center'
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
        fontWeight: "bold"
    },
    contentText: {
        fontSize: 16,
        marginTop: 10
    },
    topPostBox: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    buttonBox: {
        alignSelf: 'center',
        alignItems: "center",
        width: '95%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        //borderWidth: 0.5,
        //borderColor: 'red'
    },
    iconButton: {
        paddingHorizontal: 20,
        paddingTop: 5,
        //borderWidth: 0.5,
        //borderColor: 'red'
    }
});