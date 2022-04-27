import { StyleSheet, View } from 'react-native';
import AppText from '../components/AppText';
import React from 'react'

const NotFoundScreen = () => {
  return (
    <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
      <AppText style={{ fontSize: 20 }}>This page was not found for the supplied resource.</AppText>
    </View>
  )
}

export default NotFoundScreen

const styles = StyleSheet.create({})