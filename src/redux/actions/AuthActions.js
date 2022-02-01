export const AUTH_ERROR = "AUTH_ERROR";
export const CLEAR_AUTH_ERROR = "CLEAR_AUTH_ERROR";
export const LOG_IN = "LOG_IN";
export const LOG_OUT = "LOG_OUT";
export const RESTORE_TOKEN = "RESTORE_TOKEN";

export const authError = (errorMessage) => (dispatch) => {
	dispatch({
		type: AUTH_ERROR,
		payload: errorMessage,
	});
};

export const clearAuthError = () => (dispatch) => {
	dispatch({
		type: CLEAR_AUTH_ERROR,
	});
};

export const login = () => (dispatch) => {
	dispatch({
		type: LOG_IN,
	});
};

export const logout = () => (dispatch) => {
	dispatch({
		type: LOG_OUT,
	});
};

export const restoreToken = () => (dispatch) => {
	dispatch({
		type: RESTORE_TOKEN,
	});
};
