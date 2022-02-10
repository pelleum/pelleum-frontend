import React, { useState, useCallback, useEffect } from "react";
import {
	StyleSheet,
	View,
	SafeAreaView,
	FlatList,
	TouchableOpacity,
	Platform,
	StatusBar,
	Keyboard,
} from "react-native";
import SwitchSelector from "react-native-switch-selector";
import { Input, Icon, NativeBaseProvider, Center, HStack } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import DismissKeyboard from "../components/DismissKeyboard";
import { useDispatch } from "react-redux";
import { resetReactions } from "../redux/actions/ThesisReactionsActions";
import ThesesManager from "../managers/ThesesManager";
import ThesisBox from "../components/ThesisBox";
import AppText from "../components/AppText";
import {
	TEXT_COLOR,
	MAIN_DIFFERENTIATOR_COLOR,
	LIGHT_GREY_COLOR,
	BAD_COLOR,
	GOOD_COLOR,
	MAIN_SECONDARY_COLOR,
} from "../styles/Colors";
import { THESIS_BOX_HEIGHT } from "../components/ThesisBox";

//need to figure out how to calculate item height, so that we are not bound by a constant item height
//the result of the item heigsht calculation will be fed into getItemLayout
//if THESIS_BOX_HEIGHT is changed here, we must also change the height in ThesisListContainer in ThesisBox

const SearchScreen = ({ navigation }) => {
	const [term, setTerm] = useState("");
	const [getMoreResultsTerm, setGetMoreResultsTerm] = useState("");
	const [bullResults, setBullResults] = useState([]);
	const [bearResults, setBearResults] = useState([]);
	const [errorMessage, setErrorMessage] = useState("");
	const [message, setMessage] = useState("");
	const [sentiment, setSentiment] = useState("Bull");
	const [currentBullPage, setCurrentBullPage] = useState(1);
	const [currentBearPage, setCurrentBearPage] = useState(1);
	const [totalBullPages, setTotalBullPages] = useState(1);
	const [totalBearPages, setTotalBearPages] = useState(1);
	const [lastBullItemIndex, setLastBullItemIndex] = useState(0);
	const [lastBearItemIndex, setLastBearItemIndex] = useState(0);
	const [tempIndex, setTempIndex] = useState(0);

	const RECORDS_PER_PAGE = 25;

	const flatListRef = React.useRef();
	const dispatch = useDispatch();

	const viewableItemsRef = useCallback(({ viewableItems }) => {
		const lastItem = viewableItems[viewableItems.length - 1];
		if (lastItem) {
		}
		lastItem ? setTempIndex(lastItem.index) : null;
	}, []);

	useEffect(() => {
		let index;
		if (sentiment === "Bull") {
			index =
				lastBullItemIndex >= 2 ? lastBullItemIndex - 2 : lastBullItemIndex;
			bullResults.length > 0
				? flatListRef.current.scrollToIndex({ index: index, animated: false })
				: null;
		} else {
			index =
				lastBearItemIndex >= 2 ? lastBearItemIndex - 2 : lastBearItemIndex;
			bearResults.length > 0
				? flatListRef.current.scrollToIndex({ index: index, animated: false })
				: null;
		}
	}, [sentiment]);

	const updateStateOnThesesRetrieval = async (sent, theses, totalPages) => {
		// After theses are retrieved, update relavent state variables
		if (sent == "Bull") {
			setBullResults(theses);
			setTotalBullPages(totalPages);
			setLastBullItemIndex(0);
		} else {
			setBearResults(theses);
			setTotalBearPages(totalPages);
			setLastBearItemIndex(0);
			dispatch(resetReactions());
		}
	};

	async function getResults({ discoveryPage = false } = {}) {
		// Gets results to populate the list
		let successfulResponses = [];
		const retrievedThesesArrayLengths = { bull: 0, bear: 0 };
		for (const sent of ["Bull", "Bear"]) {
			if (!discoveryPage && term.length > 0) {
				// Get asset-specific theses when "search" button is pressed
				const queryParams = {
					asset_symbol: term,
					sentiment: sent,
					records_per_page: RECORDS_PER_PAGE,
					page: 1,
				};
				const responseData = await ThesesManager.getTheses(queryParams);
				if (responseData) {
					successfulResponses.push(true);
					if (sent == "Bull") {
						retrievedThesesArrayLengths.bull =
							responseData.records.theses.length;
						await updateStateOnThesesRetrieval(
							sent,
							responseData.records.theses,
							responseData.meta_data.total_pages
						);
					} else {
						retrievedThesesArrayLengths.bear =
							responseData.records.theses.length;
						await updateStateOnThesesRetrieval(
							sent,
							responseData.records.theses,
							responseData.meta_data.total_pages
						);
					}
				} else {
					successfulResponses.push(false);
				}
			} else if (discoveryPage) {
				// Get "random", non-asset-specific assets
				const queryParams = {
					sentiment: sent,
					records_per_page: RECORDS_PER_PAGE,
					page: 1,
				};
				const responseData = await ThesesManager.getTheses(queryParams);
				if (responseData) {
					successfulResponses.push(true);
					if (sent == "Bull") {
						retrievedThesesArrayLengths.bull =
							responseData.records.theses.length;
						await updateStateOnThesesRetrieval(
							sent,
							responseData.records.theses,
							responseData.meta_data.total_pages
						);
					} else {
						retrievedThesesArrayLengths.bear =
							responseData.records.theses.length;
						await updateStateOnThesesRetrieval(
							sent,
							responseData.records.theses,
							responseData.meta_data.total_pages
						);
					}
				} else {
					successfulResponses.push(false);
				}
			}
		}
		// If theses were retrieved properly, scroll to the top of the list
		const thesesArrayLength =
			sentiment === "Bull"
				? retrievedThesesArrayLengths.bull
				: retrievedThesesArrayLengths.bear;
		if (
			successfulResponses.every((responseSuccess) => responseSuccess === true)
		) {
			if (thesesArrayLength > 0) {
				setErrorMessage("");
				setMessage("");
				flatListRef.current.scrollToIndex({ index: 0, animated: false });
			} else {
				setMessage(
					`Looks like no one has written a ${sentiment} thesis on this asset yet. You can be the first! 🥇`
				);
			}
		} else {
			setErrorMessage(
				"There was an error retrieving theses. Please try again later."
			);
		}
	}

	const getMoreResults = async () => {
		let newPageNumber;
		let responseData;
		let queryParams;
		if (sentiment === "Bull") {
			newPageNumber = currentBullPage + 1;
			setCurrentBullPage(newPageNumber);
			if (newPageNumber < totalBullPages) {
				queryParams = {
					asset_symbol: getMoreResultsTerm,
					sentiment: sentiment,
					records_per_page: RECORDS_PER_PAGE,
					page: newPageNumber,
				};
				responseData = await ThesesManager.getTheses(queryParams);
				if (responseData) {
					setBullResults((oldBullTheses) => [
						...oldBullTheses,
						...responseData.records.theses,
					]);
				} else {
					setErrorMessage(
						"There was an error retrieving theses. Please try again later."
					);
				}
			}
		} else {
			newPageNumber = currentBearPage + 1;
			setCurrentBearPage(newPageNumber);
			if (newPageNumber < totalBearPages) {
				queryParams = {
					asset_symbol: getMoreResultsTerm,
					sentiment: sentiment,
					records_per_page: RECORDS_PER_PAGE,
					page: newPageNumber,
				};
				responseData = await ThesesManager.getTheses(queryParams);
				if (responseData) {
					setBearResults((oldBearTheses) => [
						...oldBearTheses,
						...responseData.records.theses,
					]);
				} else {
					setErrorMessage(
						"There was an error retrieving theses. Please try again later."
					);
				}
			}
		}
	};

	useEffect(() => {
		getResults({ discoveryPage: true });
	}, []);

	const sentimentOptions = [
		{ label: "Bull", value: "Bull" },
		{ label: "Bear", value: "Bear" },
	];

	const handleSentiment = (newSentiment) => {
		setSentiment(newSentiment);
		if (newSentiment === "Bull") {
			if (bullResults.length > 0) {
				setMessage("");
			} else {
				setMessage(
					`Looks like no one has written a ${newSentiment} thesis on this asset yet. You can be the first! 🥇`
				);
			}
		} else {
			if (bearResults.length > 0) {
				setMessage("");
			} else {
				setMessage(
					`Looks like no one has written a ${newSentiment} thesis on this asset yet. You can be the first! 🥇`
				);
			}
		}
	};

	renderItem = ({ item }) => (<ThesisBox item={item} nav={navigation} />);

	return (
		<DismissKeyboard>
			<SafeAreaView style={styles.mainContainer}>
				<NativeBaseProvider>
					<Center>
						<HStack>
							{getMoreResultsTerm ? (
								<TouchableOpacity
									style={styles.backButton}
									onPress={() => {
										setTerm("");
										setGetMoreResultsTerm("");
										getResults({ discoveryPage: true });
									}}
								>
									<MaterialIcons
										name="arrow-back-ios"
										size={25}
										color={MAIN_SECONDARY_COLOR}
									/>
								</TouchableOpacity>
							) : null}
							<Input
								value={term}
								onChangeText={(newTerm) => setTerm(newTerm.replace(/\s/g, ""))} //.replace(/\s/g, '') removes spacebar
								maxLength={5}
								autoCapitalize="characters"
								autoCorrect={false}
								onSubmitEditing={() => {
									if(term.length > 0) {
									setGetMoreResultsTerm(term);
									setCurrentBullPage(1);
									setCurrentBearPage(1);
									getResults();
									} else {
										Keyboard.dismiss();
									};
								}}
								color={TEXT_COLOR}
								selectionColor={TEXT_COLOR}
								placeholder="Search by ticker symbol"
								placeholderTextColor={LIGHT_GREY_COLOR}
								returnKeyType="search"
								bg="transparent"
								width="75%"
								marginBottom={1}
								borderRadius="20"
								borderColor={LIGHT_GREY_COLOR}
								py="3"
								px="1"
								fontSize="16"
								InputLeftElement={
									<Icon
										m="2"
										ml="3"
										size="6"
										color={LIGHT_GREY_COLOR}
										as={<MaterialIcons name="search" />}
									/>
								}
								enablesReturnKeyAutomatically={true} //this only works on iOS -> we need an Android equivalent!
								marginTop={3}
								paddingVertical={0}
							></Input>
						</HStack>
						<View style={styles.switchSelectorContainer}>
							<SwitchSelector
								//https://github.com/App2Sales/react-native-switch-selector
								options={sentimentOptions}
								initial={0}
								onPress={(value) => {
									if (value === sentiment) {
										//do nothing
									} else {
										handleSentiment(value);
										value === "Bull"
											? setLastBearItemIndex(tempIndex)
											: setLastBullItemIndex(tempIndex);
									}
								}}
								height={40}
								buttonColor={sentiment === "Bull" ? GOOD_COLOR : BAD_COLOR}
								borderColor={sentiment === "Bull" ? GOOD_COLOR : BAD_COLOR}
								borderColor={MAIN_DIFFERENTIATOR_COLOR}
								backgroundColor={MAIN_DIFFERENTIATOR_COLOR}
								selectedColor={"white"}
								textColor={sentiment === "Bull" ? BAD_COLOR : GOOD_COLOR}
								fontSize={16}
								bold={true}
								hasPadding
							/>
						</View>
						{errorMessage ? (
							<AppText style={styles.error}>{errorMessage}</AppText>
						) : null}
						{message ? (
							<AppText style={styles.message}>{message}</AppText>
						) : null}
						<FlatList
							width={"100%"}
							data={sentiment === "Bull" ? bullResults : bearResults}
							keyExtractor={(item) => item.thesis_id}
							renderItem={renderItem}
							onEndReached={getMoreResults}
							onEndReachedThreshold={1}
							onViewableItemsChanged={viewableItemsRef}
							// a threshold of X means that at least X percentage of the item's area must be visible to be considered 'visible'
							viewabilityConfig={{ viewAreaCoveragePercentThreshold: 75 }}
							getItemLayout={(data, index) => ({
								length: THESIS_BOX_HEIGHT,
								offset: THESIS_BOX_HEIGHT * index,
								index,
							})}
							ref={flatListRef}
						></FlatList>
					</Center>
				</NativeBaseProvider>
			</SafeAreaView>
		</DismissKeyboard>
	);
};

export default SearchScreen;

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
	},
	switchSelectorContainer: {
		width: "85%",
		height: 55,
		alignSelf: "center",
		justifyContent: "center",
	},
	error: {
		color: "red",
		marginTop: 15,
		marginBottom: 25,
		fontSize: 14,
	},
	message: {
		marginTop: 80,
		fontSize: 14,
		width: "80%",
	},
	backButton: {
		alignSelf: "center",
	},
});
