import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "../Views/Register";
import Login from "../Views/Login";
import Profile from "../Views/Profile";
import Protected from "../components/Protected";
import CreatePost from "../Views/CreatePost";
import Home from "../Views/Home";
import NotFound from "../Views/NotFound";
import Search from "../Views/Search";
import SearchProfile from "../Views/SearchProfile";
import Hero from "../Views/Hero"; 

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Hero />} />
                <Route path="/home" element={<Protected><Home /></Protected>} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Protected><Profile /></Protected>} />
                <Route path="/create-post" element={<Protected><CreatePost /></Protected>} />
                <Route path="/search" element={<Protected><Search /></Protected>} />
                <Route path="/profile/:username" element={<Protected><SearchProfile /></Protected>} />
                
                {/* 404 Route (Catch-All) */}
                <Route path="*" element={<NotFound/>} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
