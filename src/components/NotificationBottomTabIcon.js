// Installed Libraries
import { StyleSheet, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

// Components
import AppText from "./AppText";

// Universal Styles
import { MAIN_SECONDARY_COLOR } from "../styles/Colors";

// Redux
import { useSelector } from "react-redux";

const NotificationBottomTabIcon = ({ color }) => {
    // Global State
    const { notificationCount } = useSelector((state) => state.notificationsReducer);

    return (
        <View>
            <Ionicons name="notifications-sharp" size={25} color={color} />
            {notificationCount > 0 ? (
                <View style={styles.badgeIcon}>
                    <AppText>{notificationCount}</AppText>
                </View>
            ) : null}
        </View>
    );
};

export default NotificationBottomTabIcon;

const styles = StyleSheet.create({
    badgeIcon: {
        position: 'absolute',
        left: 15,
        bottom: 16,
        backgroundColor: MAIN_SECONDARY_COLOR,
        borderRadius: 9,
        width: 19,
        height: 19,
        justifyContent: 'center',
        alignItems: 'center'
    },
});