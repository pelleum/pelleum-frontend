import { StyleSheet, TouchableOpacity } from "react-native";
import React from 'react';
import { Box, Center, VStack, HStack, NativeBaseProvider } from "native-base";
import { BACKGROUND_COLOR_2 } from '../styles/ComponentStyles';
import AppText from './AppText';
import { useSelector } from "react-redux";

const AssetBox = ({ item, nav }) => {
    const { rationaleLibrary } = useSelector((state) => state.rationaleReducer);

    return (
        <NativeBaseProvider>
            <Center>
                <Box style={styles.assetTableBox}>
                    <Box style={styles.assetRowBox}>
                        <VStack>
                            <TouchableOpacity
                                style={styles.assetButton}
                                onPress={() => {
                                    console.log("Asset button worked.");
                                }}
                            >
                                <AppText style={styles.assetButtonText}>{item.asset_symbol}</AppText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={rationaleLibrary.some(rationale => rationale.asset === item.asset_symbol) ? styles.thesisButton : styles.disabledThesisButton}
                                disabled={rationaleLibrary.some(rationale => rationale.asset === item.asset_symbol) ? false : true}
                                onPress={() => {
                                    nav.navigate("Rationales", {
                                        asset: item.asset_symbol,
                                        userId: item.user_id,
                                    });
                                }}
                            >
                                <AppText style={styles.thesisButtonText}>Rationales</AppText>
                            </TouchableOpacity>
                        </VStack>
                        <VStack>
                            <HStack>
                                <AppText style={styles.valueText}>Shares Owned:</AppText>
                                <AppText style={styles.valueNumbers}>
                                    {item.quantity}
                                </AppText>
                            </HStack>
                            <HStack>
                                <AppText style={styles.valueText}>Avg Buy Price:</AppText>
                                <AppText style={styles.valueNumbers}>
                                    ${item.average_buy_price.toFixed(2)}
                                </AppText>
                            </HStack>
                        </VStack>
                    </Box>
                </Box>
            </Center>
        </NativeBaseProvider>
    );
};

export default React.memo(AssetBox);

const styles = StyleSheet.create({
    assetTableBox: {
        backgroundColor: BACKGROUND_COLOR_2,
        borderRadius: 5,
        width: "98%",
        overflow: "hidden",
    },
    assetRowBox: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
        overflow: "hidden",
    },
    assetButton: {
        overflow: "hidden",
        borderWidth: 0.5,
        borderColor: "#00A8FC",
        backgroundColor: "white",
        borderRadius: 30,
        marginLeft: 5,
        marginVertical: 3,
        height: 30,
        width: 100,
        justifyContent: "center",
        alignItems: "center",
    },
    assetButtonText: {
        fontSize: 15,
        color: "#00A8FC",
        fontWeight: "bold"
    },
    thesisButton: {
        overflow: "hidden",
        borderWidth: 0.5,
        borderColor: "white",
        backgroundColor: "#00A8FC",
        borderRadius: 30,
        marginLeft: 5,
        marginVertical: 3,
        height: 30,
        width: 100,
        justifyContent: "center",
        alignItems: "center",
    },
    disabledThesisButton: {
        overflow: "hidden",
        borderWidth: 0.5,
        borderColor: "white",
        backgroundColor: "#00A8FC",
        borderRadius: 30,
        marginLeft: 5,
        marginVertical: 3,
        height: 30,
        width: 100,
        justifyContent: "center",
        alignItems: "center",
        opacity: 0.33,
    },
    thesisButtonText: {
        fontSize: 15,
        color: "white",
        fontWeight: "bold"
    },
    valueText: {
        width: 105,
        fontSize: 15,
        paddingVertical: 5,
        marginVertical: 3,
    },
    valueNumbers: {
        width: 130,
        textAlign: "right",
        fontSize: 15,
        fontWeight: "bold",
        marginRight: 10,
        marginVertical: 3,
        paddingVertical: 5,
    },
});
