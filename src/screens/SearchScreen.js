import React from 'react';
import { StyleSheet, View } from 'react-native';
import SwitchSelector from "react-native-switch-selector";
import {Input, Icon, NativeBaseProvider, Center } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

const SearchScreen = () => {
    const options = [
        { label: "Bull", value: "bullFilter" },
        { label: "Bear", value: "bearFilter" }
    ];

    return (
        <View style={styles.mainContainer}>
            <View style={styles.switchSelectorContainer}>
                <SwitchSelector
                    //https://github.com/App2Sales/react-native-switch-selector
                    options={options}
                    initial={0}
                    onPress={value => console.log({ value })}
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
                </Center>
            </NativeBaseProvider>
        </View>
    );
};

export default SearchScreen;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    switchSelectorContainer: {
        width: '85%',
        height: 55,
        alignSelf: 'center',
        justifyContent: 'center',
    }
});