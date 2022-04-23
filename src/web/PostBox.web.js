// Installed Libraries
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, Alert, Platform, View } from "react-native";
import { HStack, VStack, NativeBaseProvider, Box } from "native-base";
import { Entypo } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
// import { useAnalytics } from '@segment/analytics-react-native';

// Local Components
import PostButtonPanel from "./PostButtonPanel.web";
import ManageContentModal from "./ManageContentModal.web";
import ThesisBox, { ThesesBoxType } from "../components/ThesisBox";
import AppText from "../components/AppText";
import SentimentPill, { Sentiment } from "../components/SentimentPill";
import { MAXIMUM_POST_VISIBLE_LINES } from "../constants/PostsConstants";

// Managers
import PostsManager from "../managers/PostsManager";
import UserManager from "../managers/UserManager";

// Universal Styles
import commonTextStyles from "../styles/CommonText";
import commonButtonStyles from "../styles/CommonButtons";
import {
    MAIN_BACKGROUND_COLOR,
    LIGHT_GREY_COLOR,
    LIST_SEPARATOR_COLOR,
} from "../styles/Colors";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { removePost, removeAuthoredPost, removeComment } from "../redux/actions/PostActions";

export class PostBoxType {
    static Feed = new PostBoxType("feed");
    static PostDetail = new PostBoxType("postDetail");
    static PostCommentedOn = new PostBoxType("postCommentedOn");
    static ThesisCommentedOn = new PostBoxType("thesisCommentedOn");
    static UserAuthored = new PostBoxType("userAuthored");

    constructor(type) {
        this.type = type;
    }
}

const getTimeElapsed = (item) => {
    // new Date() gives time in device's time zone, but we need it in UTC
    // To do this, we get the ISO string, remove the Z from the end, and create a new date
    const nowIsoString = new Date().toISOString();
    const nowStringWithNoZ = nowIsoString.slice(0, -1);
    const now = new Date(nowStringWithNoZ).getTime();
    const createdAt = new Date(item.created_at).getTime();
    const elapsedTimeMinutes = Math.round((now - createdAt) / (1000 * 60));

    // Calculate elapsed time figure to present
    if (elapsedTimeMinutes > 60 && elapsedTimeMinutes <= 60 * 24) {
        const elapsedHours = Math.round(elapsedTimeMinutes / 60);
        return `${elapsedHours}h`;
    } else if (elapsedTimeMinutes > 60 * 24) {
        const elapsedDays = Math.round(elapsedTimeMinutes / (60 * 24));
        return `${elapsedDays}d`;
    } else {
        return `${elapsedTimeMinutes} min`;
    }
}

const PostBox = ({ postBoxType, item, nav }) => {
    // Local State
    const [modalVisible, setModalVisible] = useState(false);

    // Universal State
    const dispatch = useDispatch();
    const { userObject } = useSelector((state) => state.authReducer);

    // // Segment Tracking
    // const { track } = useAnalytics();

    // Get the time elapsed since post was created
    const elapsedTime = getTimeElapsed(item);

    // Determine whether a refresh is needed
    if (
        postBoxType == PostBoxType.PostCommentedOn ||
        postBoxType == PostBoxType.ThesisCommentedOn
    ) {
        item["needsRefresh"] = true;
    };

    const cryptoData = require('../constants/crypto-list.json');

    const handleWebLink = async (webLink) => {
        await WebBrowser.openBrowserAsync(webLink);
    };

    const deleteContent = async (item) => {
        Alert.alert(
            "Delete Post",
            "Are you sure you want to delete this post?",
            [
                {
                    text: "Cancel", onPress: () => { /* Do nothing */ }
                },
                {
                    text: "Delete", style: 'destructive', onPress: async () => {
                        const response = await PostsManager.deletePost(item.post_id);
                        if (response.status == 200) {
                            if (postBoxType.type == "userAuthored") {
                                dispatch(removeAuthoredPost(item));
                            }
                            dispatch(removePost(item));
                        }
                    }
                }
            ]
        );
    };

    const blockUser = async (item) => {
        const response = await UserManager.blockUser(item.user_id);
        if (response.status == 201) {
            // track('User Blocked', {
            // 	blockedUserId: item.user_id,
            // 	blockedUsername: item.username,
            // });
            Alert.alert(
                "Success",
                `You have successfully blocked @${item.username}. You will no longer see this user's content on Pelleum. Please pull down to refresh the screen.`,
                [
                    {
                        text: "OK", onPress: () => { /* Do nothing */ }
                    },
                ]
            );
        } else {
            Alert.alert(
                "Error",
                `An unexpected error occurred when attempting to block @${item.username}. Please try again later.`,
                [
                    {
                        text: "OK", onPress: () => { /* Do nothing */ }
                    },
                ]
            );
        }
    };

    return (
        <NativeBaseProvider>
            <View style={styles.mainContainer}>
                <TouchableOpacity
                    disabled={postBoxType == PostBoxType.PostDetail ? true : false}
                    onPress={() => {
                        nav.navigate("PostDetailScreen", item);
                    }}
                >
                    <Box
                        style={postBoxType == PostBoxType.PostCommentedOn ? styles.postCommentedOn : (postBoxType != PostBoxType.PostDetail ? styles.feedPost : styles.postDetail)}
                    >
                        <VStack>
                            <HStack style={styles.topPostBox}>
                                <HStack alignItems={"center"}>
                                    <TouchableOpacity
                                        style={styles.usernameButton}
                                        onPress={() =>
                                            nav.navigate("PortfolioInsightScreen", {
                                                username: item.username,
                                                userId: item.user_id,
                                            })}
                                    >
                                        <AppText style={commonTextStyles.usernameText}>
                                            @{item.username}
                                        </AppText>
                                    </TouchableOpacity>
                                    <AppText style={commonTextStyles.timeElapsedText}>
                                        • {elapsedTime}
                                    </AppText>
                                </HStack>
                                <ManageContentModal
                                    modalVisible={modalVisible}
                                    makeModalDisappear={() => setModalVisible(false)}
                                    item={item}
                                    userId={userObject.userId}
                                    deleteContent={deleteContent}
                                    blockUser={blockUser}
                                />
                                <TouchableOpacity
                                    style={styles.dotsButton}
                                    onPress={() => {
                                        setModalVisible(true)
                                    }}
                                >
                                    <Entypo name="dots-three-horizontal" size={18} color={LIGHT_GREY_COLOR} />
                                </TouchableOpacity>
                            </HStack>
                            {((item.is_post_comment_on || item.is_thesis_comment_on) && (postBoxType == PostBoxType.Feed || postBoxType == PostBoxType.PostDetail)) ? <AppText style={styles.commentFlagText}>Left a comment:</AppText> : null}
                            <HStack justifyContent="space-between" alignItems="center">
                                {item.asset_symbol ? (
                                    <TouchableOpacity
                                        style={commonButtonStyles.assetButton}
                                        onPress={() => {
                                            cryptoData.hasOwnProperty(item.asset_symbol) ? (
                                                handleWebLink(cryptoData[item.asset_symbol])
                                            ) : (
                                                handleWebLink(`https://finance.yahoo.com/quote/${item.asset_symbol}`)
                                            )
                                        }}
                                    >
                                        <AppText style={commonButtonStyles.assetText}>
                                            #{item.asset_symbol}
                                        </AppText>
                                    </TouchableOpacity>
                                ) : null}
                                {item.sentiment ? (
                                    item.sentiment === "Bull" ? (
                                        <SentimentPill item={item} sentiment={Sentiment.Bull} />
                                    ) : (
                                        <SentimentPill item={item} sentiment={Sentiment.Bear} />
                                    )
                                ) : null}
                            </HStack>
                            {postBoxType != PostBoxType.PostDetail ?
                                (<AppText
                                    numberOfLines={MAXIMUM_POST_VISIBLE_LINES}
                                    style={styles.contentText}>
                                    {item.content}</AppText>) :
                                (<AppText
                                    style={styles.contentText}>{item.content}
                                </AppText>)
                            }
                            {item.thesis ? (
                                <ThesisBox
                                    item={item.thesis}
                                    nav={nav}
                                    thesisBoxType={ThesesBoxType.Contained}
                                />
                            ) : null}
                            <PostButtonPanel item={item} nav={nav} />
                        </VStack>
                    </Box>
                </TouchableOpacity>
            </View>
        </NativeBaseProvider>
    );
};

export default React.memo(PostBox);

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    topPostBox: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    feedPost: {
        width: "100%",
        paddingLeft: 25,
        paddingRight: 10,
        paddingBottom: 7,
        paddingTop: 5,
        fontSize: 16,
        backgroundColor: MAIN_BACKGROUND_COLOR,
        borderBottomWidth: Platform.OS === "ios" ? 0.17 : 0.29,
        borderBottomColor: LIST_SEPARATOR_COLOR,
        overflow: "hidden",
    },
    postCommentedOn: {
        width: "100%",
        paddingBottom: 7,
    },
    contentText: {
        fontSize: 16,
        padding: 15,
    },
    dotsButton: {
        paddingVertical: 15,
        paddingLeft: 20,
        paddingRight: 10,
    },
    commentFlagText: {
        color: LIGHT_GREY_COLOR,
    },
    usernameButton: {
        paddingVertical: 10,
    },
    postDetail: {
        marginLeft: 15,
    }
});
