import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Icons from '../assets/Icons';
import axios from 'axios';
import SpotlightCard from '../components/SpotlightCard';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const Navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        axios.post('https://gram-ks17.onrender.com/users/login', {
            email,
            password
        }).then(response => {
            localStorage.setItem("token", response.data.token);
            Navigate("/profile");
        }).catch(err => {
            setError(err.response?.data?.message || "Login failed. Please try again.");
            setIsLoading(false);
        });
    };


    return (
        <div className='min-h-screen bg-black text-white flex flex-col items-center justify-center relative'>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(101,39,149,0.15),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.15),transparent_50%)]"></div>
            
            <div className="container mx-auto px-4 py-12 flex flex-col items-center z-10">
                {/* Logo/Branding */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                        Gram
                    </h1>
                    <p className="text-gray-400 mt-2">Sign in to continue your experience</p>
                </div>
                
                <SpotlightCard className="custom-spotlight-card w-full max-w-md" spotlightColor="rgba(0, 129, 155, 0.3)">
                    <div className='bg-black border-4 border-zinc-800 p-6 rounded-xl shadow-2xl w-full'>
                        <h2 className='text-2xl font-semibold text-center mb-6'>Welcome Back</h2>
                        
                        <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 pl-1">Email</label>
                                <input
                                    type='email'
                                    placeholder='Enter your email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className='w-full p-3 border-4 border-zinc-800 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all'
                                    required
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <label className="text-sm text-gray-400 pl-1">Password</label>
                                    <Link to="#" className="text-sm text-blue-400 hover:text-blue-300">Forgot password?</Link>
                                </div>
                                <input
                                    type='password'
                                    placeholder='Enter your password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className='w-full p-3 border-4 border-zinc-800 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all'
                                    required
                                    minLength={6}
                                    maxLength={20}
                                />
                            </div>
                            
                            <button
                                type='submit'
                                disabled={isLoading}
                                className='bg-gradient-to-r from-purple-500 to-blue-600 text-white font-medium py-4 px-5 rounded-md hover:opacity-90 transition duration-300 mt-4 flex items-center justify-center'
                            >
                                {isLoading ? (
                                    <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : "Sign In"}
                            </button>
                        </form>
                        
                        {error && (
                            <div className="mt-4 p-3 bg-red-900/30 border border-red-500/50 rounded-md text-red-400 text-center text-sm">
                                {error}
                            </div>
                        )}
                        
                        <div className="mt-6 text-center">
                            <p className="text-gray-400">
                                Don't have an account?{" "}
                                <Link to="/register" className="text-blue-400 hover:text-blue-300">
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>
                </SpotlightCard>
            </div>

        </div>
    );
};

export default Login;