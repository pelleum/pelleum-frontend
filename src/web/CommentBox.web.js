import { Entypo } from "@expo/vector-icons";
// import { useAnalytics } from "@segment/analytics-react-native";
import { HStack, NativeBaseProvider, Box } from "native-base";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { MAXIMUM_POST_VISIBLE_LINES } from "../constants/PostsConstants";
import PostsManager from "../managers/PostsManager";
import UserManager from "../managers/UserManager";
import { removePost, removeComment } from "../redux/actions/PostActions";
import { LIGHT_GREY_COLOR, LIST_SEPARATOR_COLOR } from "../styles/Colors";
import AppText from "../components/AppText";
import PostButtonPanel from "./PostButtonPanel.web";
import commonTextStyles from "../styles/CommonText";
import ManageContentModal from "../web/ManageContentModal.web";
import CustomAlertModal from "../components/modals/CustomAlertModal";

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
};

const CommentBox = ({ item, nav, commentLevel }) => {
    // Local State
    const [manageContentModalVisible, setManageContentModalVisible] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [itemToBlockUser, setItemToBlockUser] = useState(null);
    const [blockUserModalVisible, setBlockUserModalVisible] = useState(null);
    const [blockUserErrorModalVisible, setBlockUserErrorModalVisible] = useState(null);
    const [deleteContentModalVisible, setDeleteContentModalVisible] = useState(false);

    // Universal State
    const dispatch = useDispatch();
    const { userObject } = useSelector((state) => state.authReducer);

    // // Segment Tracking
    // const { track } = useAnalytics();

    // Get the time elapsed since post was created
    const elapsedTime = getTimeElapsed(item);

    // Display nested PostBoxes for comments
    var commentBoxes = item.replies ? (item.replies.map((reply, index) => (
        <CommentBox
            item={reply}
            nav={nav}
            commentLevel={commentLevel + 1}
            key={index}
        />
    ))) : null;


    const deleteContent = async (item) => {
        setItemToDelete(item);
        setDeleteContentModalVisible(true);
    };

    const blockUser = async (item) => {
        const response = await UserManager.blockUser(item.user_id);
        if (response.status == 201) {
            // track("User Blocked", {
            // 	blockedUserId: item.user_id,
            // 	blockedUsername: item.username,
            // });
            setItemToBlockUser(item);
            setBlockUserModalVisible(true);
        } else {
            setItemToBlockUser(item);
            setBlockUserErrorModalVisible(true);
        }
    };

    return (
        <NativeBaseProvider>
            <ManageContentModal
                modalVisible={manageContentModalVisible}
                makeModalDisappear={() => setManageContentModalVisible(false)}
                item={item}
                userId={userObject.userId}
                deleteContent={deleteContent}
                blockUser={blockUser}
            />
            {itemToDelete ? (
                <CustomAlertModal
                    modalVisible={deleteContentModalVisible}
                    makeModalDisappear={() => setDeleteContentModalVisible(false)}
                    alertTitle="Delete Post"
                    alertBody="Are you sure you want to delete this post?"
                    numberOfButtons={2}
                    firstButtonLabel="Cancel"
                    firstButtonStyle="cancel"
                    firstButtonAction={() => {
                        //do nothing and dismiss modal
                        setItemToDelete(null)
                        setDeleteContentModalVisible(false);
                    }}
                    secondButtonLabel="Delete"
                    secondButtonStyle="destructive"
                    secondButtonAction={async () => {
                        const response = await PostsManager.deletePost(itemToDelete.post_id);
                        if (response.status == 204) {
                            dispatch(removeComment(itemToDelete));
                            dispatch(removePost(itemToDelete));
                        }
                        setDeleteContentModalVisible(false);
                    }}
                />
            ) : null}
            {itemToBlockUser ? (
                <>
                    <CustomAlertModal
                        modalVisible={blockUserModalVisible}
                        makeModalDisappear={() => setBlockUserModalVisible(false)}
                        alertTitle="Success"
                        alertBody={`You have successfully blocked @${itemToBlockUser.username}. You will no longer see this user's content on Pelleum. Please pull down to refresh the screen.`}
                        numberOfButtons={1}
                        firstButtonLabel="OK"
                        firstButtonStyle="default"
                        firstButtonAction={() => {
                            //do nothing and dismiss modal
                            setItemToBlockUser(null)
                            setBlockUserModalVisible(false);
                        }}
                    />
                    <CustomAlertModal
                        modalVisible={blockUserErrorModalVisible}
                        makeModalDisappear={() => setBlockUserErrorModalVisible(false)}
                        alertTitle="Error"
                        alertBody={`An unexpected error occurred when attempting to block @${itemToBlockUser.username}. Please try again later.`}
                        numberOfButtons={1}
                        firstButtonLabel="OK"
                        firstButtonStyle="default"
                        firstButtonAction={() => {
                            //do nothing and dismiss modal
                            setItemToBlockUser(null)
                            setBlockUserErrorModalVisible(false);
                        }}
                    />
                </>
            ) : null}
            <TouchableOpacity
                onPress={() => {
                    nav.navigate("PostDetailScreen", { postId: item.post_id });
                }}
            >
                <Box
                    style={
                        commentLevel == 1
                            ? styles.firstOrderComment
                            : commentLevel == 2
                                ? styles.secondOrderComment
                                : commentLevel == 3
                                    ? styles.thirdOrderComment
                                    : commentLevel == 4
                                        ? styles.fourthOrderComment
                                        : null
                    }
                >
                    <View>
                        <HStack style={styles.commentBox}>
                            <HStack alignItems={"center"}>
                                <TouchableOpacity
                                    style={styles.usernameButton}
                                    onPress={() =>
                                        nav.navigate("PortfolioInsightScreen", {
                                            userId: item.user_id,
                                        })
                                    }
                                >
                                    <AppText style={commonTextStyles.usernameText}>
                                        @{item.username}
                                    </AppText>
                                </TouchableOpacity>
                                <AppText style={commonTextStyles.timeElapsedText}>
                                    • {elapsedTime}
                                </AppText>
                            </HStack>
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
                        <AppText
                            numberOfLines={MAXIMUM_POST_VISIBLE_LINES}
                            style={styles.contentText}
                        >
                            {item.content}
                        </AppText>
                        <View style={styles.buttonPanelContainer}>
                            <PostButtonPanel item={item} nav={nav} />
                        </View>
                        {commentBoxes}
                    </View>
                </Box>
            </TouchableOpacity>
        </NativeBaseProvider>
    );
};

export default React.memo(CommentBox);

const styles = StyleSheet.create({
    firstOrderComment: {
        marginLeft: 20,
        borderLeftColor: LIST_SEPARATOR_COLOR,
        borderWidth: 1
    },
    secondOrderComment: {
        marginLeft: 20,
        borderLeftColor: LIST_SEPARATOR_COLOR,
        borderWidth: 1
    },
    thirdOrderComment: {
        marginLeft: 20,
        borderLeftColor: LIST_SEPARATOR_COLOR,
        borderWidth: 1
    },
    fourthOrderComment: {
        marginLeft: 20,
        borderLeftColor: LIST_SEPARATOR_COLOR,
        borderWidth: 1
    },
    commentBox: {
        marginLeft: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    contentText: {
        fontSize: 16,
        padding: 15,
    },
    dotsButton: {
        paddingVertical: 15,
        paddingLeft: 20,
        paddingRight: 14,
    },
    usernameButton: {
        paddingVertical: 10,
    },
    buttonPanelContainer: {
        width: 220,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "flex-end",
    }
});