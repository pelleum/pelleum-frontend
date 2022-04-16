// Installed Libraries
import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useScrollToTop } from "@react-navigation/native";

// Components
import AppText from "../components/AppText";
import NotificationBox from "../components/NotificationBox";

// Managers
import NotificationManager from "../managers/NotificationManager";

// Redux
import { useSelector, useDispatch } from "react-redux";

// NotificationsScreen Functional Component
const NotificationsScreen = ({ navigation, route }) => {
  // State Management
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.notificationsReducer);

  // When bottom tab button is pressed, scroll to top
  const ref = useRef(null);
  useScrollToTop(ref);

  // When NotificationsScreen is focused, call onRefresh
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      onRefresh();
    });
    return unsubscribe;
  }, [navigation]);

  // Get the latest notifications
  const onRefresh = async () => {
    await NotificationManager.getNotifications();
  };

  //We should make a component called NotificationBox
  renderItem = ({ item }) => <NotificationBox item={item} nav={navigation} />;

  return (
    <SafeAreaView style={styles.mainContainer}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={notifications}
        keyExtractor={(item) => item.notification_id}
        renderItem={renderItem}
        ref={ref}
      ></FlatList>
    </SafeAreaView>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
});