
import { createStore, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';
import authReducer from './authReducer'; 


const token = localStorage.getItem('token');
const initialState = {
    isAuthenticated: !!token, 
    token: token,
};

const store = createStore(
    authReducer,
    initialState, 
    applyMiddleware(thunk) 
);

export default store;
