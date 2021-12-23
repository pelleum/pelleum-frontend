import React, { useState } from "react";
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
import * as WebBrowser from 'expo-web-browser';

const ThesisDetailScreen = ({ navigation, route }) => {
    const item = route.params;
    const sources = item.sources;
    const [result, setResult] = useState(null);

    const handleSourceLink = async (sourceLink) => {
        let result = await WebBrowser.openBrowserAsync(sourceLink);
        setResult(result);
    };

    /*
        Object {
        "asset_symbol": "GOOGL",
        "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "created_at": "2021-12-02T07:13:01.717972",
        "is_authors_current": true,
        "sentiment": "Bull",
        "sources": Array [
            "https://www.pelleum.com",
            "https://www.youtube.com",
        ],
        "thesis_id": 14,
        "title": "Google is the most valuable company ever created.",
        "updated_at": "2021-12-02T07:13:01.717972",
        "user_id": 1,
        "username": "ern123",
    }
    */

    //Need to conditionally render sources (links) at the bottom of the thesis.
    //Look into making the links clickable and open up with default browser.

    return (<NativeBaseProvider>
        <View style={styles.thesisContainer}>
            <HStack style={styles.topThesisBox}>
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
            <Text style={styles.sourcesTitle}>Sources</Text>
            {sources.length == 1 ?
                <TouchableOpacity onPress={() => handleSourceLink(sources[0])}>
                    <Text style={styles.linkText}>{sources[0]}</Text>
                </TouchableOpacity> :
                sources.length == 2 ?
                    <>
                        <TouchableOpacity onPress={() => handleSourceLink(sources[0])}>
                            <Text style={styles.linkText}>{sources[0]}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleSourceLink(sources[1])}>
                            <Text style={styles.linkText}>{sources[1]}</Text>
                        </TouchableOpacity>
                    </> :
                    sources.length == 3 ?
                        <>
                            <TouchableOpacity onPress={() => handleSourceLink(sources[0])}>
                                <Text style={styles.linkText}>{sources[0]}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleSourceLink(sources[1])}>
                                <Text style={styles.linkText}>{sources[1]}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleSourceLink(sources[2])}>
                                <Text style={styles.linkText}>{sources[2]}</Text>
                            </TouchableOpacity>
                        </> :
                        null}
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

export default ThesisDetailScreen;

const styles = StyleSheet.create({
    thesisContainer: {
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
    topThesisBox: {
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
        marginTop: 15,
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
    linkText: {
        color: 'blue',
        marginTop: 10,
    },
    sourcesTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 20
    },
});
