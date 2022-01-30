import React, { useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { NativeBaseProvider, HStack } from 'native-base';
import LinkAccountsManager from '../managers/LinkAccountsManager';
import { useSelector } from "react-redux";
import AppText from '../components/AppText';
import { BAD_COLOR, GOOD_COLOR } from '../styles/Colors';

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
                    width={"100%"}
                    data={activeAccounts}
                    keyExtractor={(item) => item.connection_id}
                    renderItem={({ item }) => (
                        <HStack style={styles.itemBox}>
                            <AppText style={styles.accountNameText}>{item.name}</AppText>
                            {item.is_active ? (
                                <AppText style={styles.activeText}>ACTIVE</AppText>
                            ) : (
                                <AppText style={styles.inactiveText}>NOT ACTIVE</AppText>
                            )}
                        </HStack>
                    )}
                    ListHeaderComponent={
                        <>
                            {activeAccounts.some(account => account.is_active) == false ? (
                                <>
                                    <AppText style={styles.inactiveAccountWarning}>It looks like one (or more) of your accounts needs to be linked to Pelleum again. </AppText>
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate("Link")}
                                    >
                                        <AppText style={styles.linkButtonText}>Re-link your account(s) now!</AppText>
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
        color: GOOD_COLOR,
        marginLeft: 10,
    },
    inactiveText: {
        color: BAD_COLOR,
        marginLeft: 10,
    },
    inactiveAccountWarning: {
        alignSelf: "center",
        marginVertical: 15,
        fontSize: 16,
        color: BAD_COLOR,
    },
    linkButtonText: {
        alignSelf: "center",
        marginBottom: 20,
        fontSize: 16,
        fontWeight: "bold",
        color: "#026bd4"
    },
});
