// src/assets/redux/authActions.js
import {jwtDecode} from 'jwt-decode'; 
import axios from 'axios';

export const loginUser = (username, password) => async (dispatch) => {
    try {
        // Make the API call
        const response = await axios.post("http://localhost:8080/api/auth/signin", {
            username,
            password,
        });

        const { token } = response.data; 
        localStorage.setItem('token', token); 
        const decodedToken = jwtDecode(token); 
        console.log(decodedToken);

        dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { token, role: decodedToken.role },
        });
        console.log("Login successful");
    } catch (error) {
       
        if (error.response) {
            console.error("Login error response:", error.response.data); // Logs the server response
        } else {
            console.error("Login error:", error.message); // Logs the error message
        }
        dispatch({
            type: 'LOGIN_FAILURE',
            payload: error.response ? error.response.data.message : error.message,
        });
    }
};

export const logoutUser = () => (dispatch) => {
    localStorage.removeItem('token'); // Clear token on logout
    dispatch({ type: 'LOGOUT_SUCCESS' });
};
