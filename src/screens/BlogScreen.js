import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import { VStack, NativeBaseProvider } from "native-base"

const BlogScreen = props => {
    const dataReceived = props.navigation.state.params;
    //console.log(dataReceived);
    
    return (
        <View style={styles.mainContainer}>
            <ScrollView>
                <NativeBaseProvider>
                    <VStack>
                        <Image source={dataReceived.imageSource} resizeMode={'contain'} />
                        <Text style={styles.dateText}>{dataReceived.blogDate}</Text>
                        <Text style={styles.titleText}>{dataReceived.blogTitle}</Text>
                        <Text style={styles.blogText}>{dataReceived.blogContent}</Text>
                    </VStack>
                </NativeBaseProvider>
            </ScrollView>
        </View>
    );
};

export default BlogScreen;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        alignItems: 'center',
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
    blogText: {
        fontSize: 16,
        marginVertical: 5,
        paddingHorizontal: 5
    },
});
