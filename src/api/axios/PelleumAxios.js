// Import Installed Libraries
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const pelleumAxios = axios.create({
    //use localhost for iPhone simulator
    //use 10.0.2.2 for Android emulator
    //use local IP address instead of localhost to prevent issues with locally-run server
<<<<<<< HEAD
    baseURL: 'http://192.168.1.64:8000',
=======
    baseURL: 'http://192.168.1.78:8000',
>>>>>>> d3071a4d5933db70237179d388cbeaf4a891b9b6
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