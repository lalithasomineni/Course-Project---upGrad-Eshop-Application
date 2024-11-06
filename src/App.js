import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './components/Login/Login';
import Home from './components/Home/Home';
//import SignUp from './components/Signup/Signup';
import Signup from './components/Signup/Signup';
import Product from './components/Product/Product'; // Assuming you have a Product component

import NotFound from './components/NotFound/NotFound'; // Optionally, you could create a NotFound component
import Editproduct from './components/Home/Editproduct';
import AddProduct from './components/Home/addProduct';
import PlaceOrder from './components/Placeorder/Placeorder';
import Logout from './components/Login/Logout';

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
                
                <Routes>
                    <Route path='/login' element={<Login onLogin={handleLogin} />} />
                    <Route path='/home' element={<Home searchTerm={searchTerm} />} />
                    <Route path='/signup' element={<Signup/>} />
                    <Route path='/products/:id' element={<Product />} /> {/* Fixed the missing '>' */}
                    <Route path = '/placeorder' element = {<PlaceOrder/>}/>
                    <Route path="/" element={<NotFound />} />
                    <Route path = '/editProduct/:id' element = {<Editproduct/>}/> 
                    <Route path = '/logout' element = {<Logout/>}/> 
                    <Route path = '/addproducts' element = {<AddProduct/>}></Route>{/* Optional: Fallback route for undefined paths */}
                </Routes>
            </Router>
        </div>
    );
}

export default App;
