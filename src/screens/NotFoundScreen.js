// Installed Libraries
import { StyleSheet, View } from 'react-native';
import React from 'react'

// Local Files
import AppText from '../components/AppText';
import { LIGHT_GREY_COLOR } from '../styles/Colors';

const NotFoundScreen = () => {

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <AppText style={{ padding: 20, fontSize: 18 }}>This page was not found for the supplied resource.</AppText>
      <AppText style={{ padding: 20, fontSize: 18, color: LIGHT_GREY_COLOR }}>
        Press the Pelleum logo above to return to the app.
      </AppText>
    </View>
  );
};

export default NotFoundScreen

const styles = StyleSheet.create({})