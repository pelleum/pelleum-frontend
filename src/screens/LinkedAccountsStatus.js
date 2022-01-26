import React, { useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { NativeBaseProvider, HStack } from 'native-base';
import LinkAccountsManager from '../managers/LinkAccountsManager';
import { useSelector } from "react-redux";

const LinkedAccountsStatus = ({ navigation }) => {
    const { activeAccounts } = useSelector((state) => state.linkedAccountsReducer);

    const getAccountsStatus = async () => {
        await LinkAccountsManager.getLinkedAccountsStatus();
    };

    useEffect(() => {
        getAccountsStatus();
    }, []);

    return (
        <View style={styles.mainContainer}>
            <NativeBaseProvider>
                <FlatList
                    data={activeAccounts}
                    keyExtractor={(item) => item.connection_id}
                    renderItem={({ item }) => (
                        <HStack style={styles.itemBox}>
                            <Text style={styles.accountNameText}>{item.name}</Text>
                            {item.is_active ? (
                                <Text style={styles.activeText}>ACTIVE</Text>
                            ) : (
                                <Text style={styles.inactiveText}>NOT ACTIVE</Text>
                            )}
                        </HStack>
                    )}
                    ListHeaderComponent={
                        <>
                            {activeAccounts.some(account => account.is_active) == false ? (
                                <>
                                    <Text style={styles.inactiveAccountWarning}>It looks like one (or more) of your accounts needs to be linked to Pelleum again. </Text>
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate("Link")}
                                    >
                                        <Text style={styles.linkButtonText}>Re-link your account(s) now!</Text>
                                    </TouchableOpacity>
                                </>
                            ) : null}
                        </>
                    }
                >
                </FlatList>
            </NativeBaseProvider>
        </View >
    );
};

export default LinkedAccountsStatus;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    itemBox: {
        borderWidth: 1,
        backgroundColor: "#ebecf0",
        borderColor: "#dedfe3",
        paddingVertical: 8
    },
    accountNameText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    activeText: {
        color: 'green',
        marginLeft: 10,
    },
    inactiveText: {
        color: 'red',
        marginLeft: 10,
    },
    inactiveAccountWarning: {
        alignSelf: "center",
        marginVertical: 15,
        fontSize: 16,
        color: "red"
    },
    linkButtonText: {
        alignSelf: "center",
        marginBottom: 20,
        fontSize: 16,
        fontWeight: "bold",
        color: "#026bd4"
    },
});
