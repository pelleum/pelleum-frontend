export const ADD_TO_LIBRARY = 'ADD_TO_LIBRARY';
export const REMOVE_FROM_LIBRARY = 'REMOVE_FROM_LIBRARY';
export const REFRESH_LIBRARY = 'REFRESH_LIBRARY';


export const addToLibrary = (rationaleInfo) => dispatch => {
    dispatch({
        type: ADD_TO_LIBRARY,
        payload: rationaleInfo,
    });
};

export const removeFromLibrary = (rationaleInfo) => dispatch => {
    dispatch({
        type: REMOVE_FROM_LIBRARY,
        payload: rationaleInfo,
    });
};

export const refreshLibrary = (rationaleInfoArray) => (dispatch) => {
    dispatch({
        type: REFRESH_LIBRARY,
        payload: rationaleInfoArray,
    });
};