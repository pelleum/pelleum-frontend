import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import authReducer from './reducers/authReducer';
import likesReducer from './reducers/likesReducer';


const rootReducer = combineReducers({ authReducer, likesReducer });

export const store = createStore(rootReducer, applyMiddleware(thunk));