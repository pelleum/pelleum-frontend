import { Platform } from 'react-native';
import * as SecureStore from "expo-secure-store";
import AsyncStorage from '@react-native-async-storage/async-storage';

class LocalStorage {

    static setItem = async (key, value) => {
        if (Platform.OS == "web") {
            return await AsyncStorage.setItem(key, value);
        } else {
            return await SecureStore.setItemAsync(key, value);
        }
    };

    static getItem = async (key) => {
        if (Platform.OS == "web") {
            return await AsyncStorage.getItem(key);
        } else {
            return await SecureStore.getItemAsync(key);
        }
    };

    static deleteItem = async (key, value) => {
        if (Platform.OS == "web") {
            return await AsyncStorage.removeItem(key);
        } else {
            return await SecureStore.deleteItemAsync(key);
        }
    };
};

export default LocalStorage;