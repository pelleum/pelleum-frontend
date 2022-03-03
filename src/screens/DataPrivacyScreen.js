import React, { useState } from 'react';
import { StyleSheet, View, Switch, TouchableOpacity } from 'react-native';
import { NativeBaseProvider, HStack } from 'native-base';
import * as WebBrowser from "expo-web-browser";
import { useAnalytics } from '@segment/analytics-react-native';
import AppText from '../components/AppText';
import { LIGHT_GREY_COLOR, MAIN_DIFFERENTIATOR_COLOR, MAIN_SECONDARY_COLOR, TEXT_COLOR } from '../styles/Colors';

const DataPrivacyScreen = () => {
    // State Management
    const [isEnabled, setIsEnabled] = useState(false);

    // Segment Tracking
    const { track } = useAnalytics();

    //replace with handleToggleSwitch
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    handleToggleSwitch = async () => {

    
    };

    const handleWebLink = async (webLink) => {
        await WebBrowser.openBrowserAsync(webLink);
    };

    return (
        <View style={styles.mainContainer}>
            <NativeBaseProvider>
                <HStack style={styles.toggleSwitchContainer}>
                    {isEnabled ?
                        (<AppText style={styles.enabled}>Enabled</AppText>) :
                        (<AppText style={styles.disabled}>Disabled</AppText>)
                    }
                    <Switch
                        trackColor={{ false: LIGHT_GREY_COLOR, true: MAIN_SECONDARY_COLOR }}
                        thumbColor={isEnabled ? TEXT_COLOR : TEXT_COLOR}
                        ios_backgroundColor={MAIN_DIFFERENTIATOR_COLOR}
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                </HStack>
                <AppText style={styles.regularText}>Pelleum collects product usage data to improve the app's performance and user experience.</AppText>
                <AppText style={styles.emphasizeText}>WE DO NOT SELL ANY DATA TO THIRD PARTIES.</AppText>
                <AppText style={styles.regularText}>Please consider leaving this setting enabled so we can continue making Pelleum better for everyone.</AppText>
                <View style={styles.termsContainer}>
                    <AppText style={styles.regularText}>For more information, please refer to Pelleum's </AppText>
                    <HStack>
                        <TouchableOpacity onPress={() => handleWebLink("https://www.pelleum.com/privacy-policy")}>
                            <AppText style={styles.termsButton}>Priacy Policy</AppText>
                        </TouchableOpacity>
                        <AppText style={styles.regularText}>.</AppText>
                    </HStack>
                </View>
            </NativeBaseProvider>
        </View>
    );
};

export default DataPrivacyScreen

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 15,
        marginHorizontal: 20,
    },
    regularText: {
        fontSize: 15,
    },
    emphasizeText: {
        fontSize: 15,
        fontWeight: "bold",
        marginVertical: 10
    },
    toggleSwitchContainer: {
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 20,
        paddingHorizontal: 15,
        marginVertical: 20,
        borderBottomWidth: 0.5,
        borderColor: LIGHT_GREY_COLOR,
    },
    enabled: {
        color: TEXT_COLOR,
        fontSize: 15,
        width: 75,
    },
    disabled: {
        color: LIGHT_GREY_COLOR,
        fontSize: 15,
        width: 75,
    },
    termsContainer: {
        width: "100%",
        marginVertical: 10
    },
    termsButton: {
        fontSize: 15,
        color: MAIN_SECONDARY_COLOR,
    },
})