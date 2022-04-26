// Installed Libraries
import React from "react";
import { StyleSheet, TouchableOpacity, Platform, View } from "react-native";
import { HStack, NativeBaseProvider, Box } from "native-base";
import { FontAwesome } from "@expo/vector-icons";

// Components
import AppText from "./AppText";
import { LIGHT_GREY_COLOR, LIST_SEPARATOR_COLOR, MAIN_BACKGROUND_COLOR, MAIN_SECONDARY_COLOR } from "../styles/Colors";

// Managers
import NotificationManager from "../managers/NotificationManager";

// Universal Styles
import commonTextStyles from "../styles/CommonText";

const NotificationBox = ({ item, nav }) => {
    return (
        <NativeBaseProvider>
            <View style={styles.mainContainer}>
                <TouchableOpacity
                    onPress={async () => {
                        await NotificationManager.acknowledge(item.notification_id);
                        item.post ? (
                            nav.navigate("PostDetailScreen", { postId: item.post.post_id })
                        ) : item.comment ? (
                            nav.navigate("PostDetailScreen", { postId: item.comment.post_id })
                        ) : item.thesis ? (
                            nav.navigate("ThesisDetailScreen", { thesisId: item.thesis.thesis_id })
                        ) : null
                    }}
                >
                    <Box style={styles.notificationBox}>
                        {item.type == "THESIS_REACTION" ? (
                            <>
                                <HStack style={{ alignItems: "center", justifyContent: "space-between" }}>
                                    <TouchableOpacity
                                        onPress={() =>
                                            nav.navigate("PortfolioInsightScreen", {
                                                userId: item.user_id,
                                            })}
                                    >
                                        <AppText style={commonTextStyles.usernameText}>@{item.username} </AppText>
                                    </TouchableOpacity>
                                    {item.acknowledged ? (
                                        <FontAwesome name="circle-o" size={15} color={LIGHT_GREY_COLOR} />
                                    ) : (
                                        <FontAwesome name="circle" size={15} color={MAIN_SECONDARY_COLOR} />
                                    )}
                                </HStack>
                                <HStack style={{ alignItems: "center" }}>
                                    <AppText style={styles.notificationText}>reacted to your thesis</AppText>
                                    <AppText style={{ fontSize: 15 }}> 💥</AppText>
                                </HStack>
                                <AppText
                                    style={styles.contentPreview}
                                    numberOfLines={2}
                                >
                                    {item.thesis.title}...
                                </AppText>
                            </>
                        ) : null}
                        {item.type == "POST_REACTION" ? (
                            <>
                                <HStack style={{ alignItems: "center", justifyContent: "space-between" }}>
                                    <TouchableOpacity
                                        onPress={() =>
                                            nav.navigate("PortfolioInsightScreen", {
                                                userId: item.user_id,
                                            })}
                                    >
                                        <AppText style={commonTextStyles.usernameText}>@{item.username} </AppText>
                                    </TouchableOpacity>
                                    {item.acknowledged ? (
                                        <FontAwesome name="circle-o" size={15} color={LIGHT_GREY_COLOR} />
                                    ) : (
                                        <FontAwesome name="circle" size={15} color={MAIN_SECONDARY_COLOR} />
                                    )}
                                </HStack>
                                <HStack style={{ alignItems: "center" }}>
                                    <AppText style={styles.notificationText}>liked your post</AppText>
                                    <AppText style={{ fontSize: 12 }}> ♥️</AppText>
                                </HStack>
                                <AppText
                                    style={styles.contentPreview}
                                    numberOfLines={2}
                                >
                                    {item.post.content}...
                                </AppText>
                            </>
                        ) : null}
                        {item.type == "COMMENT" ? (
                            <>
                                <HStack style={{ alignItems: "center", justifyContent: "space-between" }}>
                                    <TouchableOpacity
                                        onPress={() =>
                                            nav.navigate("PortfolioInsightScreen", {
                                                userId: item.user_id,
                                            })}
                                    >
                                        <AppText style={commonTextStyles.usernameText}>@{item.username} </AppText>
                                    </TouchableOpacity>
                                    {item.acknowledged ? (
                                        <FontAwesome name="circle-o" size={15} color={LIGHT_GREY_COLOR} />
                                    ) : (
                                        <FontAwesome name="circle" size={15} color={MAIN_SECONDARY_COLOR} />
                                    )}
                                </HStack>
                                <HStack style={{ alignItems: "center" }}>
                                    <AppText style={styles.notificationText}>left a comment</AppText>
                                    <AppText style={{ fontSize: 13 }}> 💬</AppText>
                                </HStack>
                                <AppText
                                    style={styles.contentPreview}
                                    numberOfLines={2}
                                >
                                    {item.comment.content}...
                                </AppText>
                            </>
                        ) : null}
                    </Box>
                </TouchableOpacity>
            </View>
        </NativeBaseProvider>
    );
};

export default NotificationBox;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    notificationBox: {
        width: "100%",
        padding: 8,
        backgroundColor: MAIN_BACKGROUND_COLOR,
        borderBottomWidth: Platform.OS === "ios" ? 0.17 : 0.29,
        borderBottomColor: LIST_SEPARATOR_COLOR,
        overflow: "hidden",
    },
    notificationText: {
        marginTop: 5,
        marginLeft: 18,
        fontSize: 16,
    },
    contentPreview: {
        alignSelf: "center",
        width: "90%",
        textAlign: "left",
        textAlignVertical: "center",
        marginTop: 10,
        marginBottom: 5,
        padding: 10,
        fontSize: 16,
        backgroundColor: MAIN_BACKGROUND_COLOR,
        borderWidth: 0.3,
        borderColor: LIGHT_GREY_COLOR,
        borderRadius: Platform.OS === "ios" ? 15 : 8.5,
        overflow: "hidden",
    },
});