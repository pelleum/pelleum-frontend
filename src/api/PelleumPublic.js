import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const instance = axios.create({
    //use localhost for iPhone simulator
    //use 10.0.2.2 for Android emulator
    //use local IP address instead of localhost to prevent issues with locally-run server
    //Ernesto Condo IP Address:   192.168.1.5
    baseURL: 'http://192.168.1.5:8000',
    //headers: {Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlcm4xMjMiLCJleHAiOjE2Mzc0NDA3Mjl9.evhhilsacPWh_3SxNksbtBrxGntWfL02VpQ1mszlbKE'}
});

instance.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
);

export default instance;