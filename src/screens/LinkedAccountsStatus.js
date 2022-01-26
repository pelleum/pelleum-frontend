import React, { useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { NativeBaseProvider, HStack } from 'native-base';
import LinkAccountsManager from '../managers/LinkAccountsManager';
import { useSelector } from "react-redux";

const LinkedAccountsStatus = () => {
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
                        <HStack>
                            <Text>{item.name}</Text>
                            {item.is_active ? (
                                <Text style={styles.activeText}>ACTIVE</Text>
                            ) : (
                                <Text style={styles.inactiveText}>NOT ACTIVE</Text>
                            )}
                        </HStack>
                    )}        
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
    activeText: {
        color: 'green',
        marginLeft: 10,
    },
    inactiveText: {
        color: 'red',
        marginLeft: 10,
    }
});
