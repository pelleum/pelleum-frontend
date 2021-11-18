import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { Box, Center, VStack, HStack, NativeBaseProvider } from "native-base";

const ProfileScreen = ({ navigation }) => {
    const assetsOwned = [
        { assetSymbol: "TSLA", contribution: "$8,533.06", currentValue: "$19,215.48" },
        { assetSymbol: "AAPL", contribution: "$2,568.72", currentValue: "$5,651.18" },
        { assetSymbol: "COIN", contribution: "$1,225.99", currentValue: "$992.79" },
        { assetSymbol: "GOOGL", contribution: "$4,850.19", currentValue: "$7,125.35" },
        { assetSymbol: "VdOO", contribution: "$14,041.45", currentValue: "$22,378.63" },
        //{ assetSymbol: "VOddO", contribution: "$14,041.45", currentValue: "$22,378.63" },
        //{ assetSymbol: "VOdddO", contribution: "$14,041.45", currentValue: "$22,378.63" },
        //{ assetSymbol: "VOddsdO", contribution: "$14,041.45", currentValue: "$22,378.63" }
    ];
    return (
        <View style={styles.mainContainer}>
            <NativeBaseProvider>
                <FlatList
                    data={assetsOwned}
                    keyExtractor={item => item.assetSymbol}
                    renderItem={({ item }) => (
                        <Center>
                            <Box style={styles.assetTableBox}>
                                <Box style={styles.assetRowBox}>
                                    <VStack>
                                        <Text style={styles.assetText}>{item.assetSymbol}</Text>
                                        <Text style={styles.thesisText}>Thesis</Text>
                                    </VStack>
                                    <VStack>
                                        <HStack>
                                            <Text style={styles.valueText}>Contribution:</Text>
                                            <Text style={styles.valueNumbers}>{item.contribution}</Text>
                                        </HStack>
                                        <HStack>
                                            <Text style={styles.valueText}>Current Value:</Text>
                                            <Text style={styles.valueNumbers}>{item.currentValue}</Text>
                                        </HStack>
                                    </VStack>
                                </Box>
                            </Box>
                        </Center>
                    )}
                    ListHeaderComponent={
                        <Center>
                            <Text style={styles.usernameText}>@user0123</Text>
                        </Center>
                    }
                    ListFooterComponent={
                        <Center>
                            <TouchableOpacity
                                style={styles.settingsButton}
                                onPress={() => { navigation.navigate('Settings') }}
                            >
                                <Text style={styles.settingsText}>Settings</Text>
                            </TouchableOpacity>
                        </Center>
                    }
                >
                </FlatList>
            </NativeBaseProvider>
        </View>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    usernameText: {
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 10,
        padding: 15,
    },
    assetTableBox: {
        backgroundColor: '#ebecf0',
        borderWidth: 1,
        borderColor: "#dedfe3",
        borderRadius: 5,
        width: '98%',
        overflow: "hidden"
    },
    assetRowBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: "#dedfe3",
        paddingVertical: 8,
        overflow: "hidden"
    },
    assetText: {
        color: '#026bd4',
        borderWidth: 0.5,
        backgroundColor: "white",
        borderColor: "#026bd4",
        borderRadius: 15,
        width: 75,
        padding: 5,
        marginLeft: 5,
        marginVertical: 3,
        textAlign: 'center',
        fontSize: 15,
        fontWeight: 'bold',
        overflow: 'hidden'
    },
    thesisText: {
        color: 'white',
        borderWidth: 0.5,
        backgroundColor: "#026bd4",
        borderColor: "white",
        borderRadius: 15,
        width: 75,
        padding: 5,
        marginLeft: 5,
        marginVertical: 3,
        textAlign: 'center',
        fontSize: 15,
        fontWeight: 'bold',
        overflow: 'hidden'
    },
    valueText: {
        width: 105,
        color: '#575757',
        fontSize: 15,
        paddingVertical: 5,
        marginVertical: 3
    },
    valueNumbers: {
        width: 130,
        textAlign: 'right',
        fontSize: 15,
        marginRight: 5,
        marginVertical: 3,
        paddingVertical: 5
    },
    settingsButton: {
        borderWidth: 0.5,
        backgroundColor: "#026bd4",
        borderColor: "white",
        borderRadius: 15,
        width: '75%',
        padding: 10,
        marginVertical: 10,
        alignItems: 'center',
        overflow: 'hidden'
    },
    settingsText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    }
});

/*
            <Text>Profile Screen</Text>
            <Button
                title="Go to Post Detail"
                onPress = {() => navigation.navigate('feedPostFlow')}
            />
            <Button
                title="Go to Thesis Detail"
                onPress = {() => navigation.navigate('feedThesisFlow')}
            />
            <Button
                title="Go to Settings"
                onPress = {() => navigation.navigate('Settings')}
            />
*/