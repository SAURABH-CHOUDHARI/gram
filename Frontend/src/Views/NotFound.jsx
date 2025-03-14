import React from 'react';
import { useNavigate } from 'react-router-dom';

import Icons from '../assets/Icons';

import FuzzyText from '../components/FuzzyText';
import Dock from '../components/Dock';

const NotFound = () => {
    const navigate = useNavigate();

    const items = [
        { icon: <img src={Icons.Feed} alt="Home" width={30} height={30} />, label: 'Home', onClick: () => navigate("/home") },
        { icon: <img src={Icons.Post} alt="Create-Post" width={30} height={30} />, label: 'Create-Post', onClick: () => navigate("/create-post") },
        { icon: <img src={Icons.Profile} alt="Profile" width={30} height={30} />, label: 'Profile', onClick: () => navigate("/profile") },
        { icon: <img src={Icons.Search} alt="Search" width={30} height={30} />, label: 'Search', onClick: () => navigate("/search") },
    ];

    return (
        <div className="flex items-center justify-center min-h-screen max-h-screen bg-black text-white overflow-hidden">
            <FuzzyText baseIntensity={0.1} hoverIntensity={0.3} enableHover={true}  >
                404 - Not Found
            </FuzzyText>
            <Dock
                items={items}
                panelHeight={68}
                baseItemSize={50}
                magnification={60}
            />
        </div>
    );
};

export default NotFound;
