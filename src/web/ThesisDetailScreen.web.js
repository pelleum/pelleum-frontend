// Import Installed Libraries
import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Keyboard,
    FlatList
} from "react-native";
import { HStack, VStack, NativeBaseProvider } from "native-base";
import * as WebBrowser from "expo-web-browser";
import { Entypo } from "@expo/vector-icons";
// import { useAnalytics } from "@segment/analytics-react-native";

//Import Local Files
import CustomAlertModal from "../components/modals/CustomAlertModal";
import AppText from "../components/AppText";
import ThesisButtonPanel from "./ThesisButtonPanel.web";
import CommentBox from "./CommentBox.web";
import CommentInput from "../components/CommentInput";
import ManageContentModal from "./ManageContentModal.web";
import SentimentPill, { Sentiment } from "../components/SentimentPill";
import PostsManager from "../managers/PostsManager";
import UserManager from "../managers/UserManager";
import ThesesManager from "../managers/ThesesManager";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { setComments, addComment } from "../redux/actions/PostActions";

// Universal Styles
import commonTextStyles from "../styles/CommonText";
import commonButtonStyles from "../styles/CommonButtons";
import {
    MAIN_SECONDARY_COLOR,
    BAD_COLOR,
    LIGHT_GREY_COLOR,
    LIST_SEPARATOR_COLOR,
} from "../styles/Colors";

const ThesisDetailScreen = ({ navigation, route }) => {
    // Universal State
    const dispatch = useDispatch();
    const { userObject } = useSelector((state) => state.authReducer);
    const { comments } = useSelector((state) => state.postReducer);

    // State Management
    const [thesis, setThesis] = useState(null);
    const [contentAvailability, setContentAvailability] = useState("available");
    const [commentContent, setCommentContent] = useState("");
    const [commentContentValidity, setCommentContentValidity] = useState(false);
    const [disableStatus, setDisableStatus] = useState(true);
    const [error, setError] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const [manageContentModalVisible, setManageContentModalVisible] = useState(false);
    const [blockUserModalVisible, setBlockUserModalVisible] = useState(null);
    const [blockUserErrorModalVisible, setBlockUserErrorModalVisible] = useState(null);
    const [deleteContentModalVisible, setDeleteContentModalVisible] = useState(false);

    // // Segment Tracking
    // const { track } = useAnalytics();

    // When ThesisDetailScreen is focused, call onRefresh
    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            onRefresh();
        });
        return unsubscribe;
    }, [navigation]);


    const cryptoData = require("../constants/crypto-list.json");

    const handleWebLink = async (webLink) => {
        await WebBrowser.openBrowserAsync(webLink);
    };

    // Might not need these separate functions?
    const handleChangeContent = (newContent) => {
        setCommentContent(newContent);
    };

    const handleChangeCommentContentValidity = (newValidity) => {
        setCommentContentValidity(newValidity);
        if (newValidity == true) {
            setDisableStatus(false);
        } else {
            setDisableStatus(true);
        }
    };

    const replyButtonPressed = async () => {
        Keyboard.dismiss();
        const createdComment = await PostsManager.createPost({
            content: commentContent,
            is_thesis_comment_on: thesis.thesis_id,
        });

        if (createdComment) {
            // track("Post Created", {
            // 	authorUserId: createdComment.user_id,
            // 	authorUsername: createdComment.username,
            // 	assetSymbol: createdComment.asset_symbol,
            // 	postId: createdComment.post_id,
            // 	sentiment: createdComment.sentiment,
            // 	postType: "comment",
            // 	containsThesis: false,
            // 	organic: true,
            // });
            dispatch(addComment(createdComment));
            setCommentContent("");
            setDisableStatus(true);
        }
    };

    const editContent = async (item) => {
        navigation.navigate("CreateThesisScreen", { thesis: item });
    };

    const deleteContent = async () => {
        setDeleteContentModalVisible(true);
    };

    const blockUser = async (item) => {
        const response = await UserManager.blockUser(item.user_id);
        if (response.status == 201) {
            // track("User Blocked", {
            //     blockedUserId: item.user_id,
            //     blockedUsername: item.username,
            // });
            setBlockUserModalVisible(true);
        } else {
            setBlockUserErrorModalVisible(true);
        }
    };

    const handleThesisResponse = (thesisResponse) => {
        if (thesisResponse.status == 200) {
            setError("");
            setContentAvailability("available");
            setThesis(thesisResponse.data);
        } else if (thesisResponse.status == 400) {
            setError("");
            setContentAvailability("deleted");
        } else if (thesisResponse.status == 403) {
            setError("");
            setContentAvailability("forbidden");
        } else {
            setError(
                "An unexpected error occured retrieving this thesis. Please try again later."
            );
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        // 1. Get thesis and set it in state
        const thesisResponse = await ThesesManager.getThesis(
            route.params.thesisId
        );
        if (thesisResponse) {
            handleThesisResponse(thesisResponse);
            // 2. Retrieve thesis comments
            const commentsResponseData = await PostsManager.getComments({
                is_thesis_comment_on: route.params.thesisId,
            });
            if (commentsResponseData) {
                dispatch(setComments(commentsResponseData.records.posts));
            }
        }
        setRefreshing(false);
    };

    let sourcesToDisplay;
    if (!thesis) {
        return <View></View>;
    } else {
        // Display thesis sources
        if (thesis.sources) {
            sourcesToDisplay = thesis.sources.map((source, index) => (
                <TouchableOpacity key={index} onPress={() => handleWebLink(source)}>
                    <AppText style={styles.linkText}>{source}</AppText>
                </TouchableOpacity>
            ));
        } else {
            <AppText>This thesis has no linked sources😕</AppText>
        }
        // Set date
        const dateWritten = new Date(thesis.created_at);

        // Return JSX
        return (
            <NativeBaseProvider>
                <FlatList
                    marginBottom={18}
                    showsVerticalScrollIndicator={false}
                    // enableAutomaticScroll={true}
                    // enableOnAndroid={true} 				  //enable Android native softwareKeyboardLayoutMode
                    // extraHeight={185}					  //when keyboard comes up, scroll enough to see the Reply button
                    // keyboardShouldPersistTaps={'handled'} //scroll or tap the Reply button without dismissing the keyboard first
                    width={"100%"}
                    data={comments}
                    keyExtractor={(item) => item.post_id}
                    renderItem={({ item }) => <CommentBox item={item} nav={navigation} commentLevel={1} />}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    // Do infinate scroll in the future
                    // onEndReached={getMoreComments}
                    // onEndReachedThreshold={1}
                    ListHeaderComponent={
                        <View style={styles.mainContainer}>
                            <CustomAlertModal
                                modalVisible={deleteContentModalVisible}
                                makeModalDisappear={() => setDeleteContentModalVisible(false)}
                                alertTitle="Delete Thesis"
                                alertBody="Are you sure you want to delete this thesis?"
                                numberOfButtons={2}
                                firstButtonLabel="Cancel"
                                firstButtonStyle="cancel"
                                firstButtonAction={() => {
                                    //do nothing and dismiss modal
                                    setDeleteContentModalVisible(false);
                                }}
                                secondButtonLabel="Delete"
                                secondButtonStyle="destructive"
                                secondButtonAction={async () => {
                                    const response = await ThesesManager.deleteThesis(thesis);
                                    if (response.status == 204) {
                                        setContentAvailability("deleted");
                                    }
                                    setDeleteContentModalVisible(false);
                                }}
                            />
                            <CustomAlertModal
                                modalVisible={blockUserModalVisible}
                                makeModalDisappear={() => setBlockUserModalVisible(false)}
                                alertTitle="Success"
                                alertBody={`You have successfully blocked @${thesis.username}. You will no longer see this user's content on Pelleum. Please pull down to refresh the screen.`}
                                numberOfButtons={1}
                                firstButtonLabel="OK"
                                firstButtonStyle="default"
                                firstButtonAction={() => {
                                    //do nothing and dismiss modal
                                    setBlockUserModalVisible(false);
                                }}
                            />
                            <CustomAlertModal
                                modalVisible={blockUserErrorModalVisible}
                                makeModalDisappear={() => setBlockUserErrorModalVisible(false)}
                                alertTitle="Error"
                                alertBody={`An unexpected error occurred when attempting to block @${thesis.username}. Please try again later.`}
                                numberOfButtons={1}
                                firstButtonLabel="OK"
                                firstButtonStyle="default"
                                firstButtonAction={() => {
                                    //do nothing and dismiss modal
                                    setBlockUserErrorModalVisible(false);
                                }}
                            />
                            {error ? (
                                <AppText style={styles.errorText}>{error}</AppText>
                            ) : contentAvailability == "deleted" ? (
                                <AppText style={styles.nonAvailableThesis}>
                                    This thesis has been deleted.
                                </AppText>
                            ) : contentAvailability == "forbidden" ? (
                                <AppText style={styles.nonAvailableThesis}>
                                    This user's account is blocked.
                                </AppText>
                            ) : (
                                <>
                                    <View style={styles.thesisContainer}>
                                        <AppText style={styles.thesisTitle}>
                                            {thesis.title}
                                        </AppText>
                                        <HStack
                                            alignItems={"center"}
                                            justifyContent="space-between"
                                            marginBottom={5}
                                        >
                                            <TouchableOpacity
                                                style={styles.usernameButton}
                                                onPress={() =>
                                                    navigation.navigate("PortfolioInsightScreen", {
                                                        userId: thesis.user_id,
                                                    })
                                                }
                                            >
                                                <AppText style={commonTextStyles.usernameText}>
                                                    @{thesis.username}
                                                </AppText>
                                            </TouchableOpacity>
                                            <AppText style={commonTextStyles.dateText}>
                                                {dateWritten.toLocaleDateString()}
                                            </AppText>
                                        </HStack>
                                        <HStack style={styles.topThesisBox}>
                                            <TouchableOpacity
                                                style={commonButtonStyles.assetButton}
                                                onPress={() => {
                                                    cryptoData.hasOwnProperty(thesis.asset_symbol)
                                                        ? handleWebLink(cryptoData[thesis.asset_symbol])
                                                        : handleWebLink(
                                                            `https://finance.yahoo.com/quote/${thesis.asset_symbol}`
                                                        );
                                                }}
                                            >
                                                <AppText style={commonButtonStyles.assetText}>
                                                    #{thesis.asset_symbol}
                                                </AppText>
                                            </TouchableOpacity>
                                            {thesis.sentiment === "Bull" ? (
                                                <SentimentPill
                                                    item={thesis}
                                                    sentiment={Sentiment.Bull}
                                                />
                                            ) : (
                                                <SentimentPill
                                                    item={thesis}
                                                    sentiment={Sentiment.Bear}
                                                />
                                            )}
                                        </HStack>
                                        <TouchableOpacity
                                            style={styles.portfolioInsightButton}
                                            onPress={() =>
                                                navigation.navigate("PortfolioInsightScreen", {
                                                    userId: thesis.user_id,
                                                })
                                            }
                                        >
                                            <AppText style={styles.buttonTextStyle}>
                                                View Author's Portfolio
                                            </AppText>
                                        </TouchableOpacity>
                                        <ThesisButtonPanel thesis={thesis} nav={navigation} />
                                        <HStack style={styles.thesisHeaderContainer}>
                                            <AppText style={styles.thesisLabel}>Thesis</AppText>
                                            <ManageContentModal
                                                modalVisible={manageContentModalVisible}
                                                makeModalDisappear={() => setManageContentModalVisible(false)}
                                                item={thesis}
                                                userId={userObject.userId}
                                                deleteContent={deleteContent}
                                                blockUser={blockUser}
                                                editContent={editContent}
                                            />
                                            <TouchableOpacity
                                                style={styles.dotsButton}
                                                onPress={() => {
                                                    setManageContentModalVisible(true);
                                                }}
                                            >
                                                <Entypo
                                                    name="dots-three-horizontal"
                                                    size={18}
                                                    color={LIGHT_GREY_COLOR}
                                                />
                                            </TouchableOpacity>
                                        </HStack>
                                        <AppText style={styles.contentText}>
                                            {thesis.content}
                                        </AppText>
                                        <AppText style={styles.sourcesLabel}>Sources</AppText>
                                        {thesis.sources ? (
                                            thesis.sources.length > 0 ? (
                                                sourcesToDisplay
                                            ) : (
                                                <AppText>This thesis has no linked sources😕</AppText>
                                            )
                                        ) : (
                                            <AppText>This thesis has no linked sources😕</AppText>
                                        )}
                                    </View>
                                    <VStack>
                                        <CommentInput
                                            commentContent={commentContent}
                                            commentContentValidity={commentContentValidity}
                                            changeContent={handleChangeContent}
                                            changeCommentContentValidity={
                                                handleChangeCommentContentValidity
                                            }
                                        />
                                        <TouchableOpacity
                                            style={
                                                disableStatus
                                                    ? styles.replyButtonDisabled
                                                    : styles.replyButtonEnabled
                                            }
                                            onPress={() => replyButtonPressed()}
                                            disabled={disableStatus}
                                        >
                                            <AppText style={styles.buttonTextStyle}>Reply</AppText>
                                        </TouchableOpacity>
                                    </VStack>
                                </>
                            )}
                        </View>
                    }
                ></FlatList>
            </NativeBaseProvider>
        );
    }
};

export default ThesisDetailScreen;

const styles = StyleSheet.create({
    mainContainer: {
        marginHorizontal: 8,
    },
    thesisContainer: {
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: LIST_SEPARATOR_COLOR,
    },
    topThesisBox: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    contentText: {
        fontSize: 16,
        marginTop: 20,
        marginHorizontal: 15,
        marginBottom: 30,
    },
    portfolioInsightButton: {
        alignSelf: "center",
        borderRadius: 30,
        padding: 11,
        marginTop: 15,
        marginBottom: 5,
        width: "100%",
        backgroundColor: MAIN_SECONDARY_COLOR,
        elevation: 2,
    },
    buttonTextStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 15,
    },
    linkText: {
        color: MAIN_SECONDARY_COLOR,
        marginTop: 10,
    },
    sourcesLabel: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 10,
    },
    thesisLabel: {
        paddingVertical: 15,
        fontSize: 16,
        fontWeight: "bold",
    },
    thesisTitle: {
        fontSize: 25,
        fontWeight: "bold",
        marginBottom: 20,
        alignSelf: "center",
    },
    replyButtonEnabled: {
        alignSelf: "flex-end",
        borderRadius: 30,
        paddingVertical: 8,
        paddingHorizontal: 11,
        marginBottom: 5,
        width: "22%",
        backgroundColor: MAIN_SECONDARY_COLOR,
        elevation: 2,
    },
    replyButtonDisabled: {
        alignSelf: "flex-end",
        borderRadius: 30,
        paddingVertical: 8,
        paddingHorizontal: 11,
        marginBottom: 5,
        width: "22%",
        backgroundColor: MAIN_SECONDARY_COLOR,
        elevation: 2,
        opacity: 0.33,
    },
    errorText: {
        color: BAD_COLOR,
    },
    dotsButton: {
        paddingVertical: 15,
        paddingLeft: 20,
        paddingRight: 10,
    },
    thesisHeaderContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 5,
    },
    nonAvailableThesis: {
        alignSelf: "center",
        marginVertical: 15,
    },
    usernameButton: {
        paddingVertical: 10,
    },
});