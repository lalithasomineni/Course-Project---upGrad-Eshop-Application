// src/hooks/useAuth.js

import { useSelector } from 'react-redux';

const useAuth = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth || {}); // Ensure default value

    const isAdmin = () => {
        return user?.role === 'ADMIN'; // Check if the user role is 'ADMIN'
    };

    return { isAuthenticated, user, isAdmin };
};

export default useAuth;
