// Local exports
export const UPDATE_ACCOUNTS_STATUS = 'UPDATE_ACCOUNTS_STATUS';

// Actions
export const updateAccountsStatus = (linkedAccountsInfo) => dispatch => {
    dispatch({
        type: UPDATE_ACCOUNTS_STATUS,
        payload: linkedAccountsInfo,
    });
};