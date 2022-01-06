// Import Installed Libraries
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const accountConnectAxios = axios.create({
    //use localhost for iPhone simulator
    //use 10.0.2.2 for Android emulator
    //use local IP address instead of localhost to prevent issues with locally-run server
    //Ernesto Condo IP Address:  192.168.1.10
    //Adam's house IP Address:   192.168.1.78
    baseURL: 'http://10.0.0.137:1201',
});

accountConnectAxios.interceptors.request.use(
    async (config) => {
        const userObjectString = await SecureStore.getItemAsync('userObject');
        const userObject = JSON.parse(userObjectString);
        if (userObject) {
            config.headers.Authorization = `Bearer ${userObject.access_token}`
        }
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
);

export default accountConnectAxios;