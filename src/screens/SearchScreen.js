import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import SwitchSelector from "react-native-switch-selector";
import { Input, Icon, NativeBaseProvider, Center, Box } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import DismissKeyboard from '../components/DismissKeyboard';
import pelleumClient from '../api/clients/PelleumClient';
import { useDispatch } from "react-redux";
import { resetReactions } from '../redux/actions/ThesisReactionsActions';

const SearchScreen = ({ navigation }) => {
    const [term, setTerm] = useState('');
    const [bullResults, setBullResults] = useState([]);
    const [bearResults, setBearResults] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [sentiment, setSentiment] = useState("Bull");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1)

    const dispatch = useDispatch();

    const getResults = async () => {
        if (term.length > 0) {
            const authorizedResponse = await pelleumClient({
                method: "get",
                url: `/public/theses/retrieve/many?asset_symbol=${term}&records_per_page=10&page=1`,
            });

            if (authorizedResponse) {
                if (authorizedResponse.status == 200) {
                    const theses = authorizedResponse.data.records.theses;
                    const metaData = authorizedResponse.data.meta_data;
                    setBullResults(theses.filter(value => value.sentiment === "Bull"));
                    setBearResults(theses.filter(value => value.sentiment === "Bear"));
                    setTotalPages(metaData.total_pages);
                    dispatch(resetReactions())
                } else {
                    setErrorMessage("There was an error obtaining theses from the backend.")
                    console.log("There was an error obtaining theses from the backend.");
                };
            };
        };
    };

    const handleRefresh = async () => {
        const newPage = currentPage + 1;
        setCurrentPage(newPage);
        if (newPage < totalPages) {
            const authorizedResponse = await pelleumClient({
                method: "get",
                url: `/public/theses/retrieve/many?asset_symbol=${term}&records_per_page=10&page=${newPage}`,
            });

            if (authorizedResponse) {
                if (authorizedResponse.status == 200) {
                    const newTheses = authorizedResponse.data.records.theses;
                    const newBullTheses = newTheses.filter(value => value.sentiment === "Bull");
                    const newBearTheses = newTheses.filter(value => value.sentiment === "Bear");
                    setBullResults(oldBullTheses => [...oldBullTheses, ...newBullTheses]);
                    setBearResults(oldBearTheses => [...oldBearTheses, ...newBearTheses]);
                    console.log("\nCurent Page: ", newPage);
                    console.log("\nTotal Pages: ", totalPages);
                }
            }
        }
    }

    const sentimentOptions = [
        { label: "Bull", value: "Bull" },
        { label: "Bear", value: "Bear" }
    ];

    const handleSentiment = (value) => {
        const newSentiment = value;
        setSentiment(newSentiment);
    }

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
                                setCurrentPage(1);
                                getResults()
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
                        <Text>Number of results: {sentiment === "Bull" ? bullResults.length : bearResults.length}</Text>
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
                                            <Text color={'red'}>Thesis ID: {item.thesis_id}</Text>
                                        </Box>
                                    </TouchableOpacity>
                                )
                            }}
                        onEndReached={handleRefresh}
                        onEndReachedThreshold={1}
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