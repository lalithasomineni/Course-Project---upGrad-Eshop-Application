// src/components/Login/Login.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../assets/redux/authAction';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async(e) => {
        e.preventDefault();
        // Dispatch login action (you need to create this action)
        await dispatch(loginUser(username, password)); // Implement your login logic
       
        navigate('/home'); // Redirect to home page after successful login
    };

    return (
        <form onSubmit={handleLogin}>
            <input
                type="email"
                placeholder="Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
