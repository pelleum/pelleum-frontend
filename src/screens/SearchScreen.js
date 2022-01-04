import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import SwitchSelector from "react-native-switch-selector";
import { Input, Icon, NativeBaseProvider, Center, Box } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import DismissKeyboard from '../components/DismissKeyboard';
import pelleumClient from '../api/clients/PelleumClient';

const SearchScreen = ({ navigation }) => {
    const [term, setTerm] = useState('');
    const [bullResults, setBullResults] = useState([]);
    const [bearResults, setBearResults] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [sentiment, setSentiment] = useState("Bull");
    const [currentBullPage, setCurrentBullPage] = useState(1);
    const [currentBearPage, setCurrentBearPage] = useState(1);
    const [totalBullPages, setlTotalBullPages] = useState(1);
    const [totalBearPages, setlTotalBearPages] = useState(1);
    const [lastBullItemIndex, setLastBullItemIndex] = useState(0);
    const [lastBearItemIndex, setLastBearItemIndex] = useState(0);
    const [tempIndex, setTempIndex] = useState(0);
    const recordsPerPage = 15;

    const viewableItemsRef = useCallback(({ viewableItems }) => {
        const lastItem = viewableItems[viewableItems.length - 1];
        lastItem ? setTempIndex(lastItem.index) : null;
    }, []);

    const flatListRef = React.useRef();

    //need to figure out how to calculate item height, so that we are not bound by a constant item height
    //the result of the item height calculation will be fed into getItemLayout
    const ITEM_HEIGHT = 150;

    // get initial results when user presses 'search' button on keyboard
    const onSearch = async () => {
        // Bull API Call
        if (term.length > 0) {
            const authorizedBullResponse = await pelleumClient({
                method: "get",
                url: `/public/theses/retrieve/many?asset_symbol=${term}&sentiment=Bull&records_per_page=${recordsPerPage}&page=1`,
            });

            if (authorizedBullResponse) {
                if (authorizedBullResponse.status == 200) {
                    setBullResults(authorizedBullResponse.data.records.theses);
                    const bullMetaData = authorizedBullResponse.data.meta_data;
                    setlTotalBullPages(bullMetaData.total_pages);
                } else {
                    setErrorMessage("There was an error obtaining theses from the backend.")
                    console.log("There was an error obtaining theses from the backend.");
                };
            };

            // Bear API Call
            const authorizedBearResponse = await pelleumClient({
                method: "get",
                url: `/public/theses/retrieve/many?asset_symbol=${term}&sentiment=Bear&records_per_page=${recordsPerPage}&page=1`,
            });

            if (authorizedBearResponse) {
                if (authorizedBearResponse.status == 200) {
                    setBearResults(authorizedBearResponse.data.records.theses);
                    const bearMetaData = authorizedBearResponse.data.meta_data;
                    setlTotalBearPages(bearMetaData.total_pages);
                } else {
                    setErrorMessage("There was an error obtaining theses from the backend.")
                    console.log("There was an error obtaining theses from the backend.");
                };
            };
        };
    };

    // get more bull results when user reaches the bottom of the FlatList
    const getMoreBullResults = async () => {
        const newBullPage = currentBullPage + 1;
        setCurrentBullPage(newBullPage);
        if (newBullPage < totalBullPages) {
            const authorizedBullResponse = await pelleumClient({
                method: "get",
                url: `/public/theses/retrieve/many?asset_symbol=${term}&sentiment=Bull&records_per_page=${recordsPerPage}&page=${newBullPage}`,
            });

            if (authorizedBullResponse) {
                if (authorizedBullResponse.status == 200) {
                    const newBullTheses = authorizedBullResponse.data.records.theses;
                    setBullResults(oldBullTheses => [...oldBullTheses, ...newBullTheses]);
                } else {
                    setErrorMessage("There was an error obtaining theses from the backend.")
                    console.log("There was an error obtaining theses from the backend.");
                };
            };
        };

    };

    // get more bear results when user reaches the bottom of the FlatList
    const getMoreBearResults = async () => {
        const newBearPage = currentBearPage + 1;
        setCurrentBearPage(newBearPage);
        if (newBearPage < totalBearPages) {
            const authorizedBearResponse = await pelleumClient({
                method: "get",
                url: `/public/theses/retrieve/many?asset_symbol=${term}&sentiment=Bear&records_per_page=${recordsPerPage}&page=${newBearPage}`,
            });
            if (authorizedBearResponse) {
                if (authorizedBearResponse.status == 200) {
                    const newBearTheses = authorizedBearResponse.data.records.theses;
                    setBearResults(oldBearTheses => [...oldBearTheses, ...newBearTheses]);
                } else {
                    setErrorMessage("There was an error obtaining theses from the backend.")
                    console.log("There was an error obtaining theses from the backend.");
                };
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

                                let index;
                                if (value === "Bull") {
                                    index = lastBullItemIndex >= 2 ? lastBullItemIndex - 2 : lastBullItemIndex;
                                } else {
                                    index = lastBearItemIndex >= 2 ? lastBearItemIndex - 2 : lastBearItemIndex;
                                }
                                flatListRef.current.scrollToIndex({ index: index, animated: false })
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
                        >
                        </Input>
                        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
                        <Text marginBottom={5}>Number of results: {sentiment === "Bull" ? bullResults.length : bearResults.length}</Text>
                        <FlatList
                            data={sentiment === "Bull" ? bullResults : bearResults}
                            keyExtractor={(item) => item.thesis_id}
                            renderItem={({ item }) => {
                                return (
                                    <TouchableOpacity
                                        onPress={() => {
                                            navigation.navigate("Thesis", item);
                                        }}
                                    >
                                        <Box style={styles.thesisListContainer}>
                                            <Text style={styles.thesisTitleText}>{item.title}</Text>
                                            <Text numberOfLines={5}>{item.content}...</Text>
                                        </Box>
                                    </TouchableOpacity>
                                )
                            }}
                            onEndReached={() => sentiment === "Bull" ? getMoreBullResults() : getMoreBearResults()}
                            onEndReachedThreshold={1}
                            onViewableItemsChanged={viewableItemsRef}
                            // a threshold of X means that at least X percentage of the item's area must be visible to be considered 'visible'
                            viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
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
    thesisListContainer: {
        width: '100%',
        height: 150,
        padding: 15,
        fontSize: 16,
        backgroundColor: "#ebecf0",
        borderBottomWidth: 2,
        borderBottomColor: "#bfc6c9",
        overflow: "hidden",
    },
    thesisTitleText: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5
    },
    thesisContentText: {
        fontSize: 14
    },
    error: {
        color: 'red',
        marginTop: 15,
        marginBottom: 25,
        fontSize: 14,
    }
});