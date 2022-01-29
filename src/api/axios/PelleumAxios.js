// Import Installed Libraries
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const pelleumAxios = axios.create({
    //use localhost for iPhone simulator
    //use 10.0.2.2 for Android emulator
    //use local IP address instead of localhost to prevent issues with locally-run server
<<<<<<< HEAD
    baseURL: 'http://10.0.0.136:8000',
=======
    baseURL: 'http://192.168.1.8:8000',
>>>>>>> 34b5a237e99c2127ecaa2f344dc819d9d42f491e
});

pelleumAxios.interceptors.request.use(
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

export default pelleumAxios;

//****************************************************//
//*****      Rename file -> PelleumAxios.js      *****//
//****************************************************//