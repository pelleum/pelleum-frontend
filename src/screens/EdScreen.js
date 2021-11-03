import React from 'react'
import { StyleSheet, View, FlatList, Text, TouchableOpacity, Image } from 'react-native'
import SwitchSelector from "react-native-switch-selector";
import {
    Box,
    AspectRatio,
    Center,
    VStack,
    HStack,
    NativeBaseProvider,
} from "native-base"

const EdScreen = ({ navigation }) => {
    //need to add the full text of each blog to the object array below, then render it in the BlogScreen
    const blogList = [
        { title: "What is \"Skin in the Game\"?", date: "08/15/2021", preview: "There is no better indicator for \"what one thinks\" about an asset than where she moves hermoney.", imageLocation: require('../../assets/blog/skin.jpg'), blog_id: "1" },
        { title: "Starting From Scratch: Spend Less Than You Make", date: "08/23/2021", preview: "Now, while money, itself, will not increase in value over time, you need it to purchase property that will.", imageLocation: require('../../assets/blog/spendLess.jpg'), blog_id: "2" },
        { title: "Set Up an Emergency Fund", date: "08/29/2021", preview: "Once you achieve your goal, stop contributing to your emergency fund!", imageLocation: require('../../assets/blog/emergency.jpg'), blog_id: "3" },
        { title: "Investing: What Is It?", date: "09/06/2021", preview: "In this light, you can think of investing as a way for you to fund projects that are meaningful to you.", imageLocation: require('../../assets/blog/investing.jpg'), blog_id: "4" },
        { title: "Dollar Cost Averaging", date: "09/14/2021", preview: "Dollar cost averaging ensures two main things: that you do not try to time the market, and that you consistently increase the size of your portfolio over time.", imageLocation: require('../../assets/blog/dca.jpg'), blog_id: "5" },
        { title: "Pay Yourself First", date: "10/03/2021", preview: "If you don't pay yourself first, no one will.", imageLocation: require('../../assets/blog/payYourselfFirst.jpg'), blog_id: "6" }
    ];
    return (
        <View style={styles.mainContainer}>
            <FlatList
                data={blogList}
                keyExtractor={item => item.blog_id}
                renderItem={({ item }) => (
                    <NativeBaseProvider>
                        <Center>
                            <Box style={styles.blogPostBox}>
                                <VStack>
                                    <Text style={styles.dateText}>{item.date}</Text>
                                    <Image
                                        source={item.imageLocation}
                                        resizeMode={'contain'}
                                    />
                                    <Text style={styles.titleText}>{item.title}</Text>
                                    <Text style={styles.previewText}>{item.preview}</Text>
                                    <TouchableOpacity
                                        style={styles.readMoreButton}
                                        onPress={() => navigation.navigate('Blog')}
                                    >
                                        <Text style={styles.readMoreText}>Read More</Text>
                                    </TouchableOpacity>
                                </VStack>
                            </Box>
                        </Center>
                    </NativeBaseProvider>
                )}
            >
            </FlatList>
        </View>
    );
};

export default EdScreen;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    blogPostBox: {
        backgroundColor: '#ebecf0',
        borderRadius: 5,
        width: 365,
        marginTop: 25,
        overflow: "hidden"
    },
    dateText: {
        fontSize: 15,
        marginVertical: 5,
        paddingHorizontal: 5
    },
    titleText: {
        fontWeight: 'bold',
        fontSize: 18,
        marginVertical: 5,
        paddingHorizontal: 5
    },
    previewText: {
        fontSize: 16,
        marginVertical: 5,
        paddingHorizontal: 5
    },
    readMoreButton: {
        padding: 10,
        alignSelf: 'center'
    },
    readMoreText: {
        color: 'blue'
    }
});



/*
        <View>
            <Text>Education Screen</Text>
            <Button
                title="Go to Blog"
                onPress={() => navigation.navigate('Blog')}
            />
        </View>
*/