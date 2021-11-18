import axios from 'axios';

export default axios.create({
    //use localhost for iPhone simulator
    //use 10.0.2.2 for Android emulator
    //use local IP address instead of localhost to prevent issues with locally-run server
    baseURL: 'http://192.168.1.6:8000'
    /*
    headers: {
        Authorization: 'Bearer [API key hoes here]'
    }
    */
});