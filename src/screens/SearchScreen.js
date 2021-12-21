import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import SwitchSelector from "react-native-switch-selector";
import { Input, Icon, NativeBaseProvider, Center, Box } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import DismissKeyboard from '../components/DismissKeyboard';
import pelleumClient from '../api/PelleumClient';

const SearchScreen = () => {
    const [term, setTerm] = useState('');
    const [results, setResults] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [sentiment, setSentiment] = useState("Bull");
    const [page, setPage] = useState("1");

    const getResults = async () => {
        if (term.length > 0) {
            const response = await pelleumClient({
                method: "get",
                url: `/public/theses/retrieve/many?asset_symbol=${term}&sentiment=${sentiment}&page=${page}`,
            });

            if (response.status == 200) {
                setResults(response.data.records.theses)
            } else {
                setErrorMessage(err.response.data)
                console.log("There was an error obtaining theses from the backend.")
            }
        };
    };

    const sentimentOptions = [
        { label: "Bull", value: "Bull" },
        { label: "Bear", value: "Bear" }
    ];

    return (
        <DismissKeyboard>
            <View style={styles.mainContainer}>
                <View style={styles.switchSelectorContainer}>
                    <SwitchSelector
                        //https://github.com/App2Sales/react-native-switch-selector
                        options={sentimentOptions}
                        initial={0}
                        //onPress={value => filteredResults(value)}
                        onPress={(value) => setSentiment(value)}
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
                            onChangeText={(newTerm) => setTerm(newTerm.toUpperCase())}
                            maxLength={5}
                            autoCorrect={false}
                            onEndEditing={() => getResults()}
                            placeholder="Search for theses by ticker symbol"
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
                        {errorMessage ? <Text color={'red'}>{errorMessage}</Text> : null}
                        <Text>Number of results: {results.length}</Text>
                        <FlatList
                            style={styles.flatList}
                            data={results}
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
    }
});