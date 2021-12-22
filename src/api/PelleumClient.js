
import * as SecureStore from 'expo-secure-store';

// Local File Imports
import axiosInstance from "./AxiosInstance"
import { store } from '../redux/store';
import { logout } from "../redux/actions";
    

async function pelleumClient({method, url, headers=null, data=null, queryParams=null, onLogin=false} = {}) {

    const requestConfig = {method: method, url: url};

    if (headers) {
        requestConfig["headers"] = headers
    }
    if (data) {
        requestConfig["data"] = data
    }
    if (queryParams) {
        requestConfig["params"] = queryParams
    }    

    let response;

    try {
        response = await axiosInstance(requestConfig);
    } catch (err) {
        response = err.response;
    }
    
    if (response.status == 401) {
        // Unauthorized responses
        if (onLogin) {
            return response;
        }
        await SecureStore.deleteItemAsync('userObject');
        store.dispatch(logout());
    } else {
        // Authorized responses
        return response;
    }
}




export default pelleumClient;

