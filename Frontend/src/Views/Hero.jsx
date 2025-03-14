import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <div className="container mx-auto px-4 py-8 flex-grow flex items-center">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                    {/* Left section - Branding */}
                    <div className="flex-1 space-y-6">
                        <div className="space-y-2">
                            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                                Gram
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-300 font-light">
                                Share your moments, connect with friends
                            </p>
                        </div>
                        <p className="text-gray-400 text-lg max-w-xl">
                            A modern social platform designed for sharing experiences and building connections.
                            Create posts, follow friends, and discover content that matters to you.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <span className="text-gray-300">Create your profile</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <span className="text-gray-300">Share your content</span>
                            </div>
                        </div>
                        <p className="text-gray-500 text-sm mt-6">
                            Coming soon: TypeScript migration and more exciting features!
                        </p>
                    </div>

                    {/* Right section - Auth buttons */}
                    <div className="flex-1 max-w-md w-full bg-gray-900 p-8 rounded-xl border border-gray-800 shadow-2xl">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold mb-2">Join the community</h2>
                            <p className="text-gray-400">Connect with friends and share your moments</p>
                        </div>
                        <div className="space-y-4">
                            <Link
                                to="/register"
                                className="block w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg text-white font-medium text-center transition-transform hover:scale-105"
                            >
                                Sign Up
                            </Link>
                            <Link
                                to="/login"
                                className="block w-full py-3 px-4 bg-transparent border border-gray-600 rounded-lg text-white font-medium text-center transition-all hover:bg-gray-800"
                            >
                                Log In
                            </Link>
                        </div>
                        <div className="mt-6 text-center">
                            <p className="text-gray-500 text-sm">
                                By signing up, you agree to our Terms of Service and Privacy Policy
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="bg-gray-900 py-4">
                <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} Gram. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Hero;