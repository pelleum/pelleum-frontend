// Import Installed Libraries
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const instance = axios.create({
    //use localhost for iPhone simulator
    //use 10.0.2.2 for Android emulator
    //use local IP address instead of localhost to prevent issues with locally-run server
    //Ernesto Condo IP Address:   192.168.1.5
    //Adam's house IP Address: 192.168.1.82
    baseURL: 'http://192.168.1.82:8000',
});

instance.interceptors.request.use(
    async (config) => {
        const userToken = await SecureStore.getItemAsync('userToken');
        if (userToken) {
            config.headers.Authorization = `Bearer ${userToken}`
        }
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
);

export default instance;