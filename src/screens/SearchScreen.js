import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import SwitchSelector from "react-native-switch-selector";
import { Input, Icon, NativeBaseProvider, Center, Box } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import DismissKeyboard from '../components/DismissKeyboard';
import { useDispatch } from "react-redux";
import { resetReactions } from '../redux/actions/ThesisReactionsActions';
import { getTheses } from '../functions/ThesesFunctions';
import { ThesisBox } from '../components/ThesisBox';

const SearchScreen = ({ navigation }) => {
    const [term, setTerm] = useState('');
    const [bullResults, setBullResults] = useState([]);
    const [bearResults, setBearResults] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [sentiment, setSentiment] = useState("Bull");
    const [currentBullPage, setCurrentBullPage] = useState(1);
    const [currentBearPage, setCurrentBearPage] = useState(1);
    const [totalBullPages, setTotalBullPages] = useState(1);
    const [totalBearPages, setTotalBearPages] = useState(1);
    const [lastBullItemIndex, setLastBullItemIndex] = useState(0);
    const [lastBearItemIndex, setLastBearItemIndex] = useState(0);
    const [tempIndex, setTempIndex] = useState(0);
    const recordsPerPage = 15;

    const viewableItemsRef = useCallback(({ viewableItems }) => {
        const lastItem = viewableItems[viewableItems.length - 1];
        if (lastItem) {
        }
        lastItem ? setTempIndex(lastItem.index) : null;
    }, []);

    const flatListRef = React.useRef();

    //need to figure out how to calculate item height, so that we are not bound by a constant item height
    //the result of the item height calculation will be fed into getItemLayout
    //if ITEM_HEIGHT is changed here, we must also change the height in ThesisListContainer in ThesisBox
    const ITEM_HEIGHT = 175;
    

    const dispatch = useDispatch();

    useEffect(() => {
        let index;
        if (sentiment === "Bull") {
            index = lastBullItemIndex >= 2 ? lastBullItemIndex - 2 : lastBullItemIndex;
            bullResults.length > 0 ? flatListRef.current.scrollToIndex({ index: index, animated: false }) : null;
        } else {
            index = lastBearItemIndex >= 2 ? lastBearItemIndex - 2 : lastBearItemIndex;
            bearResults.length > 0 ? flatListRef.current.scrollToIndex({ index: index, animated: false }) : null;
        }
    }, [sentiment]);

    // get initial results when user presses 'search' button on keyboard
    const onSearch = async () => {
        let successfulResponses = [];
        const retrievedThesesArrayLengths = { bull: 0, bear: 0 };
        if (term.length > 0) {
            for (const sent of ["Bull", "Bear"]) {
                const queryParams = { asset_symbol: term, sentiment: sent, records_per_page: recordsPerPage, page: 1 };
                const responseData = await getTheses({queryParams: queryParams});
                if (responseData) {
                    successfulResponses.push(true)
                    if (sent == "Bull") {
                        retrievedThesesArrayLengths.bull = responseData.records.theses.length;
                        setBullResults(responseData.records.theses);
                        setTotalBullPages(responseData.meta_data.total_pages);
                        setLastBullItemIndex(0);
                    } else {
                        retrievedThesesArrayLengths.bear = responseData.records.theses.length;
                        setBearResults(responseData.records.theses);
                        setTotalBearPages(responseData.meta_data.total_pages);
                        setLastBearItemIndex(0);
                        dispatch(resetReactions());
                    }
                } else {
                    successfulResponses.push(false)
                }
            };
            const thesesArrayLength = sentiment === "Bull" ? retrievedThesesArrayLengths.bull : retrievedThesesArrayLengths.bear
            if (successfulResponses.every(responseSuccess => responseSuccess === true) && thesesArrayLength > 0) {
                flatListRef.current.scrollToIndex({ index: 0, animated: false });
            };
        };
    };

    const getMoreResults = async () => {
        let newPageNumber;
        let responseData;
        let queryParams
        if (sentiment === "Bull") {
            newPageNumber = currentBullPage + 1;
            setCurrentBullPage(newPageNumber);
            if (newPageNumber < totalBullPages) {
                queryParams = { asset_symbol: term, sentiment: sentiment, records_per_page: recordsPerPage, page: newPageNumber };
                responseData = await getTheses({queryParams: queryParams});
                if (responseData) {
                    setBullResults(oldBullTheses => [...oldBullTheses, ...responseData.records.theses]);
                }
            }
        } else {
            newPageNumber = currentBearPage + 1;
            setCurrentBearPage(newPageNumber);
            if (newPageNumber < totalBearPages) {
                queryParams = { asset_symbol: term, sentiment: sentiment, records_per_page: recordsPerPage, page: newPageNumber };
                responseData = await getTheses({queryParams: queryParams});
                if (responseData) {
                    setBearResults(oldBearTheses => [...oldBearTheses, ...responseData.records.theses]);
                }
            };
        };
    };

    const sentimentOptions = [
        { label: "Bull", value: "Bull" },
        { label: "Bear", value: "Bear" },
    ];

    const handleSentiment = (value) => {
        const newSentiment = value;
        setSentiment(newSentiment);
    };

    return (
        <DismissKeyboard>
            <View style={styles.mainContainer}>
                <View style={styles.switchSelectorContainer}>
                    <SwitchSelector
                        //https://github.com/App2Sales/react-native-switch-selector
                        options={sentimentOptions}
                        initial={0}
                        onPress={(value) => {
                            if (value === sentiment) {
                                //do nothing
                            } else {
                                handleSentiment(value)
                                value === "Bull" ? setLastBearItemIndex(tempIndex) : setLastBullItemIndex(tempIndex);
                            }
                        }}
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
                <NativeBaseProvider>
                    <Center>
                        <Input
                            value={term}
                            onChangeText={(newTerm) => setTerm(newTerm.replace(/\s/g, ''))} //.replace(/\s/g, '') removes spacebar
                            maxLength={5}
                            autoCapitalize="characters"
                            autoCorrect={false}
                            onSubmitEditing={() => {
                                setCurrentBullPage(1);
                                setCurrentBearPage(1);
                                onSearch()
                            }}
                            placeholder="Search for theses by ticker symbol"
                            returnKeyType="search"
                            bg="transparent"
                            width="100%"
                            marginBottom={5}
                            borderRadius="4"
                            borderColor="gray.400"
                            py="3"
                            px="1"
                            fontSize="16"
                            InputLeftElement={
                                <Icon
                                    m="2"
                                    ml="3"
                                    size="6"
                                    color="gray.400"
                                    as={<MaterialIcons name="search" />}
                                />
                            }
                            enablesReturnKeyAutomatically={true} //this only works on iOS -> we need an Android equivalent!
                        >
                        </Input>
                        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
                        <Text marginBottom={5}>Number of results: {sentiment === "Bull" ? bullResults.length : bearResults.length}</Text>
                        <FlatList
                            data={sentiment === "Bull" ? bullResults : bearResults}
                            keyExtractor={(item) => item.thesis_id}
                            renderItem={({ item }) => {
                                return (
                                    <ThesisBox
                                        item={item}
                                        nav={navigation}
                                    />
                                );
                            }}
                            onEndReached={getMoreResults}
                            onEndReachedThreshold={1}
                            onViewableItemsChanged={viewableItemsRef}
                            // a threshold of X means that at least X percentage of the item's area must be visible to be considered 'visible'
                            viewabilityConfig={{ viewAreaCoveragePercentThreshold: 75 }}
                            getItemLayout={(data, index) => (
                                { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
                            )}
                            ref={flatListRef}
                        >
                        </FlatList>
                    </Center>
                </NativeBaseProvider>
            </View>
        </DismissKeyboard>
    );
};

export default SearchScreen;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    switchSelectorContainer: {
        width: '85%',
        height: 55,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    error: {
        color: 'red',
        marginTop: 15,
        marginBottom: 25,
        fontSize: 14,
    },
});