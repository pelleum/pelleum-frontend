import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import SwitchSelector from "react-native-switch-selector";
import { Input, Icon, NativeBaseProvider, Center, Box } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import DismissKeyboard from '../components/DismissKeyboard';
import pelleumClient from '../api/PelleumClient';

const SearchScreen = () => {
    const [term, setTerm] = useState('');
    const [bullResults, setBullResults] = useState([]);
    const [bearResults, setBearResults] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [sentiment, setSentiment] = useState("Bull");
    const [page, setPage] = useState(1);

    // 1. Make the API call onEndEditing, get the results (the array of theses objects)
    // Let's look into making the enter button be the only way to send the API call
    // 2. Filter them, creating an array for bull results and bear results (2 arrays)
    // 3. In the FlatList:
    //        If sentiment is "Bull", use bullResults as data object
    //        If sentiment is "Bear", use bearResults as data object



    const getResults = async () => {
        if (term.length > 0) {
            const authorizedResponse = await pelleumClient({
                method: "get",
                url: `/public/theses/retrieve/many?asset_symbol=${term}&records_per_page=250&page=${page}`,
            });

            if (authorizedResponse) {
                if (authorizedResponse.status == 200) {
                    const theses = authorizedResponse.data.records.theses;
                    setBullResults(theses.filter(value => value.sentiment === "Bull"));
                    setBearResults(theses.filter(value => value.sentiment === "Bear"));
                } else {
                    //We are not getting an appropriate response in authorizedResponse.data when we trigger an error (i.e., 404)
                    //setErrorMessage(authorizedResponse.data);
                    //For now, let's hardcode a string into setErrorMessage
                    setErrorMessage("There was an error obtaining theses from the backend.")
                    console.log("There was an error obtaining theses from the backend.");
                };
            };
        };
    };

    //*** onRefresh function ***
    //this function will load the next page ONLY IF the previous response contained >= 250 theses
    //if response contains < 250 theses, tell the user that there are no more theses to load.

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
                            onSubmitEditing={() => getResults()}
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
                            style={styles.flatList}
                            data={sentiment === "Bull" ? bullResults : bearResults}
                            keyExtractor={item => item.thesis_id.toString()}
                            renderItem={({ item }) => {
                                return (
                                    <TouchableOpacity onPress={() => console.log('\nThis should navigate to ThesisDetailScreen.')}>
                                        <Box style={styles.thesisListContainer}>
                                            <Text style={styles.thesisTitleText}>{item.title}</Text>
                                        </Box>
                                    </TouchableOpacity>
                                )
                            }}
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
    flatList: {
        width: '100%'
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
        borderWidth: 0.5,
        borderColor: 'red'
    },
    error: {
        color: 'red',
        marginTop: 15,
        marginBottom: 25,
        fontSize: 14,
    }
});