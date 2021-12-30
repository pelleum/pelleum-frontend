// Local File Imports
import accountConnectAxios from '../axios/AccountConnectAxios'

async function accountConnectClient({ method, url, headers = null, data = null, queryParams = null } = {}) {

    const requestConfig = { method: method, url: url };

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
        response = await accountConnectAxios(requestConfig);
    } catch (err) {
        response = err.response;
    }
    return response;
}

export default accountConnectClient;