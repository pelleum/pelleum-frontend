import React from "react";
import {
	StyleSheet,
	SafeAreaView,
	FlatList,
	TouchableOpacity,
	Image,
	Dimensions,
} from "react-native";
import { Box, VStack, NativeBaseProvider } from "native-base";
import * as WebBrowser from "expo-web-browser";
import AppText from "../components/AppText";
import {
	MAIN_BACKGROUND_COLOR,
	LIGHT_GREY_COLOR,
	MAIN_DIFFERENTIATOR_COLOR,
} from "../styles/Colors";

const EdScreen = () => {
	const handleSourceLink = async (sourceLink) => {
		await WebBrowser.openBrowserAsync(sourceLink);
	};

	const dimensions = Dimensions.get("window");
	const imageHeight = Math.round((dimensions.width * 9) / 16);

	const blogList = [
		{
			title: 'What is "Skin in the Game"?',
			date: "08/15/2021",
			preview:
				'There is no better indicator for "what one thinks" about an asset than where she moves her money.',
			imageLocation: require("../../assets/blog/skin.jpg"),
			blog_id: "1",
			linkToBlog: "https://www.pelleum.com/learn/blog-post-title-one-4yfk6",
		},
		{
			title: "Starting From Scratch: Spend Less Than You Make",
			date: "08/23/2021",
			preview:
				"Now, while money, itself, will not increase in value over time, you need it to purchase property that will.",
			imageLocation: require("../../assets/blog/spendLess.jpg"),
			blog_id: "2",
			linkToBlog:
				"https://www.pelleum.com/learn/starting-from-scratch-spend-less-than-you-make",
		},
		{
			title: "Set Up an Emergency Fund",
			date: "08/29/2021",
			preview:
				"Once you achieve your goal, stop contributing to your emergency fund!",
			imageLocation: require("../../assets/blog/emergency.jpg"),
			blog_id: "3",
			linkToBlog: "https://www.pelleum.com/learn/setting-up-an-emergency-fund",
		},
		{
			title: "Investing: What Is It?",
			date: "09/06/2021",
			preview:
				"In this light, you can think of investing as a way for you to fund projects that are meaningful to you.",
			imageLocation: require("../../assets/blog/investing.jpg"),
			blog_id: "4",
			linkToBlog: "https://www.pelleum.com/learn/investing-what-is-it",
		},
		{
			title: "Dollar Cost Averaging",
			date: "09/14/2021",
			preview:
				"Dollar cost averaging ensures two main things: that you do not try to time the market, and that you consistently increase the size of your portfolio over time.",
			imageLocation: require("../../assets/blog/dca.jpg"),
			blog_id: "5",
			linkToBlog: "https://www.pelleum.com/learn/dollar-cost-averaging",
		},
		{
			title: "Pay Yourself First",
			date: "10/03/2021",
			preview: "If you don't pay yourself first, no one will.",
			imageLocation: require("../../assets/blog/payYourselfFirst.jpg"),
			blog_id: "6",
			linkToBlog: "https://www.pelleum.com/learn/pay-yourself-first",
		},
	];

	renderItem = ({ item }) => (
		<NativeBaseProvider>
			<TouchableOpacity onPress={() => handleSourceLink(item.linkToBlog)}>
				<Box style={styles.blogPostBox}>
					<VStack>
						<Image
							style={{ width: dimensions.width, height: imageHeight }}
							source={item.imageLocation}
						//resizeMode={"contain"}
						/>
						<AppText style={styles.titleText}>{item.title}</AppText>
						<AppText style={styles.previewText}>{item.preview}</AppText>
					</VStack>
				</Box>
			</TouchableOpacity>
		</NativeBaseProvider>
	);

	return (
		<SafeAreaView style={styles.mainContainer}>
			<FlatList
				width={"100%"}
				data={blogList}
				keyExtractor={(item, index) => item.blog_id}
				renderItem={renderItem}
			></FlatList>
		</SafeAreaView>
	);
};

export default EdScreen;

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		shadowOffset: { width: 2, height: 3 },
		shadowColor: LIGHT_GREY_COLOR,
		shadowOpacity: 0.4,
		elevation: 3,
		backgroundColor: MAIN_BACKGROUND_COLOR,
	},
	blogPostBox: {
		backgroundColor: MAIN_DIFFERENTIATOR_COLOR,
		borderRadius: 15,
		overflow: "hidden",
		marginTop: 9,
	},
	titleText: {
		fontWeight: "bold",
		fontSize: 18,
		marginVertical: 5,
		paddingTop: 3,
		paddingHorizontal: 15,
	},
	previewText: {
		color: LIGHT_GREY_COLOR,
		fontSize: 16,
		marginVertical: 5,
		paddingHorizontal: 15,
		paddingBottom: 5,
	},
});
