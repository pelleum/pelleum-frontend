import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    FlatList,
    TouchableOpacity,
    Image,
    Alert,
} from "react-native";
import { HStack, NativeBaseProvider } from "native-base";
import {
    MaterialCommunityIcons,
    Ionicons,
    Octicons,
    FontAwesome,
} from "@expo/vector-icons";
import PortfolioManager from "../managers/PortfolioManager";
import { useSelector } from "react-redux";
import AssetBox from "../components/AssetBox";
import CreateModal from "../components/modals/CreateModal";
import AppText from "../components/AppText";
import {
    BAD_COLOR,
    MAIN_DIFFERENTIATOR_COLOR,
    LIGHT_GREY_COLOR,
    MAIN_SECONDARY_COLOR,
    WEB_MAIN_DIFFERENTIATOR_COLOR
} from "../styles/Colors";

// Profile Screen Functional Component
const ProfileScreen = ({ navigation }) => {
    // State Management
    const [assetList, setAssetList] = useState([]);
    const [username, setUsername] = useState("");
    const { linkedAccounts } = useSelector((state) => state.linkedAccountsReducer);
    const { userObject } = useSelector((state) => state.authReducer);

    // // Update profile data from source of truth
    // const onRefresh = async () => {
    //     setUsername(userObject.username);
    //     const retrievedAssets = await PortfolioManager.retrieveAssets(
    //         userObject.userId
    //     );
    //     if (retrievedAssets) {
    //         setAssetList(retrievedAssets.records);
    //     }
    // };

    //DUMMY ASSET LIST
    const noAssets = { "records": [] };
    const withAssets = {
        "records": [
            {
                "thesis_id": null,
                "skin_rating": null,
                "average_buy_price": 902.2642,
                "total_contribution": null,
                "user_id": 4,
                "institution_id": "d75e2cf4-a4ee-4869-88c3-14bfadf7c196",
                "name": "Tesla, Inc. Common Stock",
                "asset_symbol": "TSLA",
                "position_value": null,
                "quantity": 0.371,
                "asset_id": 28,
                "is_up_to_date": true,
                "update_errors": null,
                "created_at": "2022-03-29T22:16:27.592165",
                "updated_at": "2022-04-12T10:37:59.396332"
            },
            {
                "thesis_id": null,
                "skin_rating": null,
                "average_buy_price": 26.1991,
                "total_contribution": null,
                "user_id": 4,
                "institution_id": "d75e2cf4-a4ee-4869-88c3-14bfadf7c196",
                "name": "Palantir Technologies Inc. Class A Common Stock",
                "asset_symbol": "PLTR",
                "position_value": null,
                "quantity": 7.53,
                "asset_id": 29,
                "is_up_to_date": true,
                "update_errors": null,
                "created_at": "2022-03-29T22:16:27.600261",
                "updated_at": "2022-04-12T10:37:59.452881"
            },
            {
                "thesis_id": null,
                "skin_rating": null,
                "average_buy_price": 16.3379,
                "total_contribution": null,
                "user_id": 4,
                "institution_id": "d75e2cf4-a4ee-4869-88c3-14bfadf7c196",
                "name": "Opendoor Technologies Inc Common Stock",
                "asset_symbol": "OPEN",
                "position_value": null,
                "quantity": 7.4,
                "asset_id": 30,
                "is_up_to_date": true,
                "update_errors": null,
                "created_at": "2022-03-29T22:16:27.605932",
                "updated_at": "2022-04-12T10:37:59.495437"
            },
            {
                "thesis_id": null,
                "skin_rating": null,
                "average_buy_price": 341.6383,
                "total_contribution": null,
                "user_id": 4,
                "institution_id": "d75e2cf4-a4ee-4869-88c3-14bfadf7c196",
                "name": "Coinbase Global, Inc. Class A Common Stock",
                "asset_symbol": "COIN",
                "position_value": null,
                "quantity": 0.47,
                "asset_id": 31,
                "is_up_to_date": true,
                "update_errors": null,
                "created_at": "2022-03-29T22:16:27.612184",
                "updated_at": "2022-04-12T10:37:59.523638"
            },
            {
                "thesis_id": null,
                "skin_rating": null,
                "average_buy_price": 30.26,
                "total_contribution": null,
                "user_id": 4,
                "institution_id": "d75e2cf4-a4ee-4869-88c3-14bfadf7c196",
                "name": "Coursera, Inc.",
                "asset_symbol": "COUR",
                "position_value": null,
                "quantity": 3.0,
                "asset_id": 32,
                "is_up_to_date": true,
                "update_errors": null,
                "created_at": "2022-03-29T22:16:27.619142",
                "updated_at": "2022-04-12T10:37:59.552860"
            },
            {
                "thesis_id": null,
                "skin_rating": null,
                "average_buy_price": 10.27,
                "total_contribution": null,
                "user_id": 4,
                "institution_id": "d75e2cf4-a4ee-4869-88c3-14bfadf7c196",
                "name": "Social Capital Hedosophia Holdings Corp. VI",
                "asset_symbol": "IPOF",
                "position_value": null,
                "quantity": 1.0,
                "asset_id": 33,
                "is_up_to_date": true,
                "update_errors": null,
                "created_at": "2022-03-29T22:16:27.625619",
                "updated_at": "2022-04-12T10:37:59.587477"
            }
        ]
    };

    const temp_assets = withAssets;
    // const temp_assets = noAssets;

    // TEMP onRefresh
    const onRefresh = async () => {
        setAssetList(temp_assets.records);
        setUsername("testWebUser");
    };

    // Call onRefresh when ProfileScreen renders for the first time in a session
    useEffect(() => {
        onRefresh();
    }, []);

    return (
        <View style={styles.mainContainer}>
            <NativeBaseProvider>
                <FlatList
                    style={{ paddingBottom: 75 }}
                    showsVerticalScrollIndicator={false}
                    data={assetList}
                    keyExtractor={(item) => item.asset_symbol}
                    renderItem={({ item }) => <AssetBox item={item} nav={navigation} />}
                    ListHeaderComponent={
                        <View style={styles.listHeaderView}>
                            <TouchableOpacity
                                style={styles.settingsButton}
                                onPress={() => navigation.navigate("SettingsScreen")}
                            >
                                <FontAwesome
                                    name="bars"
                                    size={26}
                                    color={MAIN_SECONDARY_COLOR}
                                />
                            </TouchableOpacity>
                            <Image
                                style={styles.image}
                                source={require("../../assets/defaultProfileImage.png")}
                            />
                            <AppText style={styles.usernameText}>@{username}</AppText>
                            <View style={{ alignItems: "center", paddingVertical: 20 }}>
                                <TouchableOpacity
                                    style={styles.buttonGroup}
                                    onPress={async () => {
                                        navigation.navigate("CreateThesisScreen");
                                    }}
                                >
                                    <HStack style={styles.buttonGroupTextContainer}>
                                        <FontAwesome
                                            name="pencil-square-o"
                                            size={25}
                                            color={MAIN_SECONDARY_COLOR}
                                        />
                                        <AppText style={styles.buttonGroupText}>Write a Thesis</AppText>
                                    </HStack>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.headerStyle}>
                                {assetList.length == 0 ? (
                                    <View></View>
                                ) : (
                                    <AppText style={styles.listHeaderText}>Assets</AppText>
                                )}
                            </View>
                            {assetList.length == 0 ? (
                                <AppText style={styles.noBrokerageLinkedText}>
                                    Put your money where your mouth is - link an account to show
                                    your skin in the game!💥
                                </AppText>
                            ) : null}
                        </View>
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
    listHeaderView: {
        margin: 13,
    },
    listHeaderText: {
        marginLeft: 3,
        fontWeight: "bold",
        fontSize: 20,
    },
    usernameText: {
        fontSize: 16,
        marginTop: 10,
        fontWeight: "bold",
        alignSelf: "center",
    },
    image: {
        alignSelf: "center",
        width: 60,
        height: 60,
        borderRadius: 60 / 2,
    },
    buttonGroup: {
        alignItems: "center",
        overflow: "hidden",
        backgroundColor: MAIN_DIFFERENTIATOR_COLOR,
        borderRadius: 30,
        width: "65%",
        marginTop: 6,
    },
    buttonGroupText: {
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 15,
    },
    buttonGroupTextContainer: {
        alignItems: "center",
        justifyContent: "flex-start",
        paddingLeft: 15,
        paddingVertical: 10,
        // marginLeft: 20,
    },
    postIcon: {
        marginLeft: 1.75,
    },
    inactiveAccountWarning: {
        fontSize: 15,
        alignSelf: "center",
        marginTop: 15,
        color: BAD_COLOR,
    },
    inactiveLinkButtonText: {
        fontSize: 15,
        alignSelf: "center",
        paddingTop: 15,
        paddingBottom: 10,
        color: MAIN_SECONDARY_COLOR,
    },
    headerStyle: {
        justifyContent: "center",
        alignItems: "flex-start",
    },
    settingsButton: {
        alignSelf: "flex-end",
        alignItems: "center",
        justifyContent: "center",
        width: 52,
        height: 52,
        borderRadius: 52 / 2,
        shadowOffset: { width: 0, height: 0 },
        shadowColor: LIGHT_GREY_COLOR,
        shadowOpacity: 0.3,
        elevation: 3,
        backgroundColor: "black",
    },
    linkAccountButton: {
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: 2.5,
        width: 52,
        height: 52,
        borderRadius: 52 / 2,
        shadowOffset: { width: 0, height: 0 },
        shadowColor: LIGHT_GREY_COLOR,
        shadowOpacity: 0.3,
        elevation: 3,
        backgroundColor: "black",
    },
    noBrokerageLinkedText: {
        alignSelf: "center",
        marginTop: 35,
        marginHorizontal: 20,
    },
});