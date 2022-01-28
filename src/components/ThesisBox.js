import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { HStack, NativeBaseProvider, Box } from "native-base";

const ThesisBox = ({ item, nav }) => {

    const dateWritten = new Date(item.created_at);

    return (
        <NativeBaseProvider>
            <TouchableOpacity
                onPress={() => {
                    nav.navigate("Thesis", item);
                }}
            >
                <Box style={styles.thesisListContainer}>
                    <HStack justifyContent="space-between">
                        <Text style={styles.usernameText}>@{item.username}</Text>
                        <Text style={styles.usernameText}>{dateWritten.toLocaleDateString()}</Text>
                        {item.asset_symbol ? (
                            <TouchableOpacity
                                style={styles.assetButton}
                                onPress={() => {
                                    console.log("Asset button worked.");
                                }}
                            >
                                <Text style={styles.assetText}>{item.asset_symbol}</Text>
                            </TouchableOpacity>
                        ) : null}
                        <Text
                            style={
                                item.sentiment
                                    ? item.sentiment === "Bull"
                                        ? styles.bullSentimentText
                                        : styles.bearSentimentText
                                    : null
                            }
                        >
                            {item.sentiment}
                        </Text>
                    </HStack>
                    <Text style={styles.thesisTitleText}>{item.title} thesis_id: {item.thesis_id}</Text>
                    <Text numberOfLines={5}>{item.content}...</Text>
                </Box>
            </TouchableOpacity>
        </NativeBaseProvider>
    );
};

export default React.memo(ThesisBox);

const styles = StyleSheet.create({
    thesisListContainer: {
        width: '100%',
        height: 175,
        padding: 10,
        fontSize: 16,
        backgroundColor: "#ebecf0",
        borderBottomWidth: 2,
        borderBottomColor: "#bfc6c9",
        overflow: "hidden",
    },
    thesisTitleText: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
    },
    usernameText: {
        padding: 5,
        marginBottom: 10,
        justifyContent: "center",
        color: "#026bd4",
        fontSize: 16,
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
});
