export const ADD_TO_LIBRARY = 'ADD_TO_LIBRARY';
export const REMOVE_FROM_LIBRARY = 'REMOVE_FROM_LIBRARY';
export const REFRESH_LIBRARY = 'REFRESH_LIBRARY';


export const addToLibrary = (thesis_id) => dispatch => {
    dispatch({
        type: ADD_TO_LIBRARY,
        payload: thesis_id,
    });
};

export const removeFromLibrary = (thesis_id) => dispatch => {
    dispatch({
        type: REMOVE_FROM_LIBRARY,
        payload: thesis_id,
    });
};

export const refreshLibrary = (thesis_id_array) => (dispatch) => {
    dispatch({
        type: REFRESH_LIBRARY,
        payload: thesis_id_array,
    });
};