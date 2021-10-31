import axios from 'axios';

export default axios.create({
    //use localhost for iPhone simulator
    //use 10.0.2.2 for Android emulator
    baseURL: 'http://localhost:8000'
    /*
    headers: {
        Authorization: 'Bearer [API key hoes here]'
    }
    */
});