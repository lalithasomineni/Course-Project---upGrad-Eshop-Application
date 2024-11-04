import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import Signup from './components/Signup/Signup';
import Product from './components/Product/Product'; // Assuming you have a Product component

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    const handleLogin = (token) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('token');
    };

    return (
        <div className="App">
            <Router>
                <Navbar isAuthenticated={isAuthenticated} onSearch={handleSearch} onLogout={handleLogout} />
                <Routes>
                    <Route path='/login' element={<Login onLogin={handleLogin} />} />
                    <Route path='/home' element={<Home searchTerm={searchTerm} />} />
                    <Route path='/signup' element={<Signup />} />
                    <Route path='/products/:id' element={<Product />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
