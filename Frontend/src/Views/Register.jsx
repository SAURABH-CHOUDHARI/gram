import axios from 'axios';
import React, { useState } from 'react';
import Dock from "../components/Dock";
import { useNavigate } from 'react-router-dom';
import Icons from '../assets/Icons';
import SpotlightCard from '../components/SpotlightCard';



const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("")
    const Navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();


        axios.post('https://gram-ks17.onrender.com/users/register', {
            username,
            email,
            password
        }).then(response => {
            localStorage.setItem("token", response.data.token)
            Navigate("/profile")
        }).catch(err => {
            
            setError(err.response.data.message)
        })



        setUsername('');
        setEmail('');
        setPassword('');
    };


    const items = [
        { icon: <img src={Icons.Login} alt="Login" width={40} height={40} />, label: 'Login', onClick: () => Navigate("/login") },

    ];

    return (
        <div className='flex flex-col gap-2 items-center justify-center min-h-screen text-zinc-200 bg-black '>
            <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 129, 155, 0.3)">

                <form className='flex flex-col  gap-4 bg-black border-4 border-zinc-800 border-solid p-4 rounded-lg shadow-lg w-96' onSubmit={handleSubmit}>
                    <h2 className='text-2xl font-semibold text-center text-zinc-100'>Register</h2>
                    <input
                        type='text'
                        placeholder='Username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className='p-3  border-zinc-800 border-4  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600'
                        minLength={3}
                        maxLength={20}
                    />
                    <input
                        type='email'
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='p-3  border-zinc-800 border-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600'
                        minLength={3}
                        maxLength={20}
                    />
                    <input
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='p-3 border-4  border-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600'
                        minLength={6}
                        maxLength={20}
                    />
                    <button
                        type='submit'
                        className='bg-black border-4 border-zinc-800 text-white font-semibold py-4 px-5 rounded-md hover:bg-linear-to-r hover:from-black hover:to-blue-500 transition duration-300'
                    >
                        Register
                    </button>
                </form>
            </SpotlightCard>
            {error && <h3 className="text-red-500 text-center">{error}</h3>}

            <Dock
                items={items}
                panelHeight={68}
                baseItemSize={50}
                magnification={55}
            />

        </div>
    );
};

export default Register;
