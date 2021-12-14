import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Dimensions } from 'react-native';
import { VStack, NativeBaseProvider } from "native-base"

const BlogScreen = ({ route, navigation })  => {

    const { imageSource,
    blogDate,
    blogTitle,
    blogContent } = route.params;

    const dimensions = Dimensions.get("window");
	const imageHeight = Math.round((dimensions.width * 9) / 16);
    
    return (
        <View style={styles.mainContainer}>
            <ScrollView>
                <NativeBaseProvider>
                    <VStack>
                        <Image style={{width: dimensions.width, height: imageHeight}} source={imageSource} />
                        <Text style={styles.titleText}>{blogTitle}</Text>
                        <Text style={styles.blogText}>{blogContent}</Text>
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
