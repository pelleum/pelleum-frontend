import { TouchableOpacity, View, Platform } from 'react-native'
import { useNavigation } from "@react-navigation/native";
import React from 'react'
import { MaterialIcons } from "@expo/vector-icons";
import { MAIN_SECONDARY_COLOR } from "../styles/Colors";

const BackButton = () => {

    const navigation = useNavigation();

    return (
        <View>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
            >
                {Platform.OS === "ios" ? (
                    <MaterialIcons
                        name="arrow-back-ios"
                        size={25}
                        color={MAIN_SECONDARY_COLOR}
                    />
                ) : (
                    <MaterialIcons
                        name="arrow-back"
                        size={25}
                        color={MAIN_SECONDARY_COLOR}
                    />
                )}
            </TouchableOpacity>
        </View>
    )
}

export default BackButton