import React, { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShopContext } from './context/ShopContext';
const OAuthRedirect = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { setToken } = useContext(ShopContext);
    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const token = query.get('token');
        if (token) {
            setToken(token);
            localStorage.setItem('token', token);
            navigate('/');
        } else {
            navigate('/login');
        }
    }, [location, navigate, setToken]);
    return (
        <div className="w-full h-screen flex justify-center items-center">
            <p>Processing login...</p>
        </div>
    );
};
export default OAuthRedirect;