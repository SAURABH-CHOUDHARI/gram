import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Dock from "./Dock";
import Icons from '../assets/Icons';
import axios from 'axios';

const AppDock = ({ additionalItems = [] }) => {
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogOut = async () => {
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                navigate('/login');
                return;
            }

            await axios.get('https://gram-ks17.onrender.com/users/logout',  {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            // Clear token from localStorage
            localStorage.removeItem('token');
            
            // Redirect to login page
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
            // Even if the server request fails, we should still log out the user locally
            localStorage.removeItem('token');
            navigate('/login');
        }
    };

    // Base items that appear on all docks
    const baseItems = [
        { icon: <img src={Icons.Feed} alt="Home" width={30} height={30} />, label: 'Home', onClick: () => navigate("/home") },
        { icon: <img src={Icons.Post} alt="Create-Post" width={30} height={30} />, label: 'Create Post', onClick: () => navigate("/create-post") },
        { icon: <img src={Icons.Profile} alt="Profile" width={30} height={30} />, label: 'Profile', onClick: () => navigate("/profile") },
        { icon: <img src={Icons.Search} alt="Search" width={30} height={30} />, label: 'Search', onClick: () => navigate("/search") },
        { icon: <img src={Icons.Logout} alt="Search" width={30} height={30} />, label: 'Log Out', onClick: () => setShowLogoutModal(true) },
        // ... other common routes
    ];

    const allItems = [...baseItems, ...additionalItems];

    return (
        <>
            <Dock
                items={allItems}
                panelHeight={68}
                baseItemSize={50}
                magnification={55}
            />
            
            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-zinc-900 border text-zinc-200 border-red-500 p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h2 className="text-xl  font-semibold mb-4">Confirm Logout</h2>
                        <p className="mb-6">Are you sure you want to log out?</p>
                        <div className="flex justify-end space-x-4">
                            <button 
                                onClick={() => setShowLogoutModal(false)}
                                className="px-4 py-2 border border-zinc-700 rounded hover:bg-zinc-950"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => {
                                    setShowLogoutModal(false);
                                    handleLogOut();
                                }}
                                className="px-4 py-2 bg-red-500 text-zinc-100 rounded hover:bg-red-600"
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AppDock;