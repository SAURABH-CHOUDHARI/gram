import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Protected = ({ children }) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await axios.get('https://gram-ks17.onrender.com/users/auth', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 200 || response.data.status === true) {
                    setIsAuthenticated(true);
                } else {
                    // Token is invalid
                    localStorage.removeItem("token");
                    navigate("/login");
                }
            } catch (error) {
                console.error("Authentication error:", error);
                localStorage.removeItem("token");
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, [navigate]);

    if (loading) {
        return <div>Loading...</div>; // Or a spinner component
    }

    return isAuthenticated ? children : null;
};

export default Protected;