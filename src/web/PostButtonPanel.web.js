import React from "react";
import { StyleSheet, TouchableOpacity, Share, Alert } from "react-native";
import { HStack, NativeBaseProvider } from "native-base";
import { EvilIcons, Fontisto, Ionicons, FontAwesome } from "@expo/vector-icons";
import PostsManager from "../managers/PostsManager";
import { LIGHT_GREY_COLOR } from "../styles/Colors";
// import { useAnalytics } from "@segment/analytics-react-native";
import AppText from "../components/AppText";

// Redux
import { useSelector } from "react-redux";

const PostButtonPanel = ({ item, nav }) => {
    // State Management
    const { locallyLikedPosts, locallyUnlikedPosts } = useSelector(
        (state) => state.postReactionsReducer
    );

    // // Segment Tracking
    // const { track } = useAnalytics();

    const onShare = async (item) => {
        const postType =
            item.is_post_comment_on || item.is_thesis_comment_on
                ? "comment"
                : "feedPost";
        const containsThesis = item.thesis ? true : false;
        try {
            const result = await Share.share(
                {
                    message: `@${item.username} on Pelleum💥:\n\n"${item.content}"\n\nPut your money where your mouth is — join Pelleum today:\nhttps://www.pelleum.com/download`,
                },
                {
                    excludedActivityTypes: ["com.apple.UIKit.activity.AirDrop"],
                }
            );
            if (result.action === Share.sharedAction) {
                // if (result.activityType) {
                // 	// shared with activity type of result.activityType
                // 	// iOS
                // 	track("Post Shared", {
                // 		authorUserId: item.user_id,
                // 		authorUsername: item.username,
                // 		assetSymbol: item.asset_symbol,
                // 		sentiment: item.sentiment,
                // 		postId: item.post_id,
                // 		postType: postType,
                // 		containsThesis: containsThesis,
                // 	});
                // } else {
                // 	// Shared on Android
                // 	// This does not take into account a user dismissing the Share modal
                // 	// We should only track the event if it is ACTUALLY shared
                // 	// Consider using https://react-native-share.github.io/react-native-share/
                // 	track("Post Shared", {
                // 		authorUserId: item.user_id,
                // 		authorUsername: item.username,
                // 		assetSymbol: item.asset_symbol,
                // 		sentiment: item.sentiment,
                // 		postId: item.post_id,
                // 		postType: postType,
                // 		containsThesis: containsThesis,
                // 	});
                // }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const onRepost = async () => {
        Alert.alert(
            `Coming soon!`,
            `We are still developing the Repost feature. We'll let you know when it's ready!`,
            [
                {
                    text: "Got it!",
                    onPress: () => {
                        /* do nothing */
                    },
                },
            ]
        );
    };

    return (
        <NativeBaseProvider>
            <HStack style={styles.buttonBox}>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => {
                        nav.navigate("PostDetailScreen", item);
                    }}
                >
                    <HStack alignItems={"center"}>
                        <Fontisto name="comment" size={16} color={LIGHT_GREY_COLOR} />
                        {item.comment_count > 0 ? (
                            <AppText style={styles.countStyle}>{item.comment_count}</AppText>
                        ) : null}
                    </HStack>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={() => onRepost()}>
                    <EvilIcons name="retweet" size={30} color={LIGHT_GREY_COLOR} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => {
                        PostsManager.sendPostReaction(item);
                    }}
                >
                    <HStack alignItems={"center"}>
                        <Ionicons
                            name={
                                (item.user_reaction_value == 1 &&
                                    !locallyUnlikedPosts.includes(item.post_id)) ||
                                    locallyLikedPosts.includes(item.post_id)
                                    ? "md-heart"
                                    : "md-heart-outline"
                            }
                            size={21}
                            color={
                                (item.user_reaction_value == 1 &&
                                    !locallyUnlikedPosts.includes(item.post_id)) ||
                                    locallyLikedPosts.includes(item.post_id)
                                    ? "#f01670"
                                    : LIGHT_GREY_COLOR
                            }
                        />
                        {item.like_count > 0 ? (
                            locallyLikedPosts.includes(item.post_id) ? (
                                <AppText style={styles.countStyle}>
                                    {item.like_count + 1}
                                </AppText>
                            ) : (
                                <AppText style={styles.countStyle}>{item.like_count}</AppText>
                            )
                        ) : locallyLikedPosts.includes(item.post_id) ? (
                            <AppText style={styles.countStyle}>
                                {item.like_count + 1}
                            </AppText>
                        ) : null}
                    </HStack>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => onShare(item)}
                >
                    <FontAwesome name="send-o" size={16} color={LIGHT_GREY_COLOR} />
                </TouchableOpacity>
            </HStack>
        </NativeBaseProvider>
    );
};

export default PostButtonPanel;

const styles = StyleSheet.create({
    buttonBox: {
        paddingTop: 5,
        alignSelf: "center",
        alignItems: "center",
        width: "92%",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    iconButton: {
        paddingHorizontal: 13,
        alignItems: "center",
        justifyContent: "center",
        height: 36,
        width: 58,
    },
    countStyle: {
        color: LIGHT_GREY_COLOR,
        marginLeft: 6,
    },
});