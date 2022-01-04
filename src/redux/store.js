import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import authReducer from './reducers/AuthReducer';
import postReactionsReducer from './reducers/PostReactionsReducer'
import thesisReactionsReducer from './reducers/ThesisReactionsReducer';



const rootReducer = combineReducers({ authReducer, postReactionsReducer, thesisReactionsReducer });

export const store = createStore(rootReducer, applyMiddleware(thunk));