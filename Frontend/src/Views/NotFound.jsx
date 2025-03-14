import React from 'react';


import FuzzyText from '../components/FuzzyText';
import AppDock from '../components/AppDock';

const NotFound = () => {

    return (
        <div className="flex items-center justify-center min-h-screen max-h-screen bg-black text-white overflow-hidden">
            <FuzzyText baseIntensity={0.1} hoverIntensity={0.3} enableHover={true}  >
                404 - Not Found
            </FuzzyText>
            <AppDock/>
        </div>
    );
};

export default NotFound;
