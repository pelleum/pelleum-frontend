import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    FlatList,
    TouchableOpacity,
    Image,
} from "react-native";
import LocalStorage from "../storage/LocalStorage";
import { HStack, NativeBaseProvider } from "native-base";
import { FontAwesome } from "@expo/vector-icons";
import PortfolioManager from "../managers/PortfolioManager";
import AssetBox from "../components/AssetBox";
import AppText from "../components/AppText";
import {
    BAD_COLOR,
    WEB_MAIN_DIFFERENTIATOR_COLOR,
    LIGHT_GREY_COLOR,
    MAIN_SECONDARY_COLOR,
} from "../styles/Colors";

// Profile Screen Functional Component
const ProfileScreen = ({ navigation }) => {
    // State Management
    const [assetList, setAssetList] = useState([]);
    const [username, setUsername] = useState("");

    // Update profile data from source of truth
    const onRefresh = async () => {
        const userObjectString = await LocalStorage.getItem("userObject");
        const userObject = JSON.parse(userObjectString);
        setUsername(userObject.username);
        const retrievedAssets = await PortfolioManager.retrieveAssets(
            userObject.userId
        );
        if (retrievedAssets) {
            setAssetList(retrievedAssets.records);
        }
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
        backgroundColor: WEB_MAIN_DIFFERENTIATOR_COLOR,
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