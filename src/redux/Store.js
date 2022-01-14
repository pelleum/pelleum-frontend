import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import authReducer from './reducers/AuthReducer';
import postReactionsReducer from './reducers/PostReactionsReducer'
import thesisReactionsReducer from './reducers/ThesisReactionsReducer';
import rationaleReducer from './reducers/RationaleReducer';



const rootReducer = combineReducers({ authReducer, postReactionsReducer, thesisReactionsReducer, rationaleReducer });

export const store = createStore(rootReducer, applyMiddleware(thunk));