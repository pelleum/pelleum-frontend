import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import SwitchSelector from "react-native-switch-selector";
import { Box, Center, VStack, NativeBaseProvider } from "native-base";

const FeedScreen = ({ navigation }) => {
    const options = [
        { label: "Bull", value: "bullFilter" },
        { label: "Bear", value: "bearFilter" }
    ];

    const manyPostsResponse = {
        "records": {
            "posts": [
                {
                    "title": "Bought 5 shares of TSLA at $645.14/share.",
                    "content": "Tesla is leading the electrical vehicle space, producing best in-class vehicles on almost all meaningful metrics (safety, battery range, acceleration, style, etc.), but this only accounts for a portion of the TAM(s) the company is going after. Tesla is also an industry leader in full self-driving and distributed, software driven solar energy.",
                    "asset_symbol": "TSLA",
                    "sentiment": "Bull",
                    "thesis_id": 12,
                    "post_id": 1,
                    "user_id": "user8013",
                    "created_at": "2021-10-27T02:37:08.716Z",
                    "updated_at": "2021-10-27T02:37:08.717Z"
                },
                {
                    "title": "Draftkings is supporting gambling addictions!",
                    "content": "I would never buy DKNG. The entire business model is built around gambling.",
                    "asset_symbol": "DKNG",
                    "sentiment": "Bear",
                    "thesis_id": 24,
                    "post_id": 2,
                    "user_id": "tester0123",
                    "created_at": "2021-11-27T01:23:08.716Z",
                    "updated_at": "2021-11-27T02:43:08.717Z"
                },
                {
                    "title": "Bought 5 shares of PELL at $43.12/share.",
                    "content": "Pelleum is the future of investing; the retail investing world needs more transparency.",
                    "asset_symbol": "PELL",
                    "sentiment": "Bull",
                    "thesis_id": 95,
                    "post_id": 3,
                    "user_id": "testusername",
                    "created_at": "2021-10-20T06:33:08.716Z",
                    "updated_at": "2021-10-20T08:38:08.717Z"
                },
                {
                    "title": "Bought 5 shares of TSLA at $645.14/share.",
                    "content": "Pelleum is the future of investing; the retail investing world needs more transparency.",
                    "asset_symbol": "TSLA",
                    "sentiment": "Bull",
                    "thesis_id": 2,
                    "post_id": 4,
                    "user_id": "anonymoususer123",
                    "created_at": "2021-09-19T11:17:08.716Z",
                    "updated_at": "2021-10-25T12:57:08.717Z"
                },
                {
                    "title": "Bought 5 shares of TSLA at $645.14/share.",
                    "content": "Pelleum is the future of investing; the retail investing world needs more transparency.",
                    "asset_symbol": "TSLA",
                    "sentiment": "Bull",
                    "thesis_id": 996,
                    "post_id": 5,
                    "user_id": "ernestp1034",
                    "created_at": "2021-07-27T02:32:08.716Z",
                    "updated_at": "2021-07-27T03:35:08.717Z"
                },
            ]
        },
        "meta_data": {
            "page": 1,
            "records_per_page": 50,
            "total_pages": 1,
            "total_records": 5
        }
    };

    let postArray = manyPostsResponse.records.posts;

    //console.log(postArray)

    return (
        <View style={styles.mainContainer}>
            <View style={styles.switchSelectorContainer}>
                <SwitchSelector
                    //https://github.com/App2Sales/react-native-switch-selector
                    options={options}
                    initial={0}
                    onPress={value => console.log({ value })}
                    height={40}
                    buttonColor={"#0782F9"}
                    borderColor={"#0782F9"}
                    selectedColor={'white'}
                    textColor={"#0782F9"}
                    fontSize={16}
                    bold={true}
                    hasPadding
                />
            </View>
            <FlatList
                data={manyPostsResponse.records.posts}
                keyExtractor={item => item.post_id.toString()}
                renderItem={({ item }) => {
                    return (
                        <NativeBaseProvider>
                            <Box
                                style={styles.feedPost}
                            >
                                <VStack>
                                    <Center>
                                        <Box style={styles.topPostBox}>
                                            <Text style={styles.usernameText}>@{item.user_id}</Text>
                                            <Text style={styles.assetText}>{item.asset_symbol}</Text>
                                            <Text style={styles.sentimentText}>{item.sentiment}</Text>
                                        </Box>
                                    </Center>
                                    <Box style={styles.postBox}>
                                        <Text style={styles.titleText}>{item.title}</Text>
                                        <Text style={styles.contentText}>{item.content}</Text>
                                    </Box>
                                </VStack>
                            </Box>
                        </NativeBaseProvider>
                    )
                }}
            />
        </View>
    );
};

FeedScreen.navigationOptions = () => {
    return {
        //headerShown: false,
        //headerLeft: () => null
    };
};

export default FeedScreen;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1, //this ensures that the container (view) fills up max vertical space
        justifyContent: 'flex-start',
        alignItems: 'center',
        //borderWidth: 0.5,
        //borderColor: 'red'
    },
    switchSelectorContainer: {
        width: '85%',
        height: '12%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    feedPost: {
        marginTop: 20,
        padding: 25,
        fontSize: 16,
        borderRadius: 20,
        backgroundColor: "#ebecf0",
        borderWidth: 1,
        borderColor: "#dedfe3",
        overflow: "hidden"
    },
    sentimentText: {
        borderWidth: 0.5,
        backgroundColor: "#0782F9",
        borderColor: "#026bd4",
        borderRadius: 5,
        padding: 5,
        marginBottom: 10,
        justifyContent: "center",
        color: "white",
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
    assetText: {
        borderWidth: 0.5,
        backgroundColor: "white",
        borderColor: "#026bd4",
        borderRadius: 5,
        padding: 5,
        alignSelf: 'flex-end',
        marginBottom: 10,
        justifyContent: "center",
        color: "#026bd4",
        fontSize: 16,
        fontWeight: "bold",
        overflow: "hidden",
        textAlign: 'center'
    },
    postBox: {
        overflow: "visible"
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
        width: 335,
        //borderWidth: 0.5,
        //borderColor: 'red',
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
});

/*
            <Button
                title="Go to Post Detail"
                onPress={() => navigation.navigate('feedPostFlow')}
            />
            <Button
                title="Go to Thesis Detail"
                onPress={() => navigation.navigate('feedThesisFlow')}
            />
*/