import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import SpotlightCard from '../components/SpotlightCard';
import GradientText from '../components/GradientText';
import AppDock from '../components/AppDock';
import Icons from '../assets/Icons';

const CreatePost = () => {
    const [media, setMedia] = useState(null);
    const [preview, setPreview] = useState(null);
    const [caption, setCaption] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null); // Ref to reset input field
    const navigate = useNavigate();

    const handleMediaChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setMedia(file);
            setPreview(URL.createObjectURL(file)); // Generate preview URL
        }
    };

    const handleDeselect = () => {
        setMedia(null);
        setPreview(null);

        // Reset the file input field
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!media) {
            setError("Please select an image to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("media", media);
        formData.append("caption", caption);

        setLoading(true);
        try {
            await axios.post('https://gram-ks17.onrender.com/posts/create', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            navigate("/profile");
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
            setMedia(null);
            setPreview(null);
            setCaption('');

            // Reset the file input field after successful upload
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const items = [
        { icon: <img src={Icons.Feed} alt="Home" width={30} height={30} />, label: 'Home', onClick: () => navigate("/home") },
        { icon: <img src={Icons.Post} alt="Create-Post" width={30} height={30} />, label: 'Create-Post', onClick: () => navigate("/create-post") },
        { icon: <img src={Icons.Profile} alt="Profile" width={30} height={30} />, label: 'Profile', onClick: () => navigate("/profile") },
        { icon: <img src={Icons.Search} alt="Search" width={30} height={30} />, label: 'Search', onClick: () => navigate("/search") },
    ];

    return (
        <div className='flex flex-col items-center justify-center min-h-screen max-h-screen bg-black'>
            <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={1}
                showBorder={false}
                className="custom-class text-3xl mb-2"
            >
                Create Post
            </GradientText>

            <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 129, 155, 0.3)">
                <form onSubmit={handleSubmit} className='flex flex-col w-96 p-6 border-4 border-zinc-800 rounded-lg bg-black'>
                    {/* Media Upload Input */}
                    <input
                        type='file'
                        accept="image/*"
                        ref={fileInputRef} // Attach ref here
                        onChange={handleMediaChange}
                        className='p-3 mb-4 border-4 border-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 bg-black text-white'
                        required
                    />

                    {/* Image Preview Section */}
                    {preview && (
                        <div className="relative mb-4   flex flex-col items-center">
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-full h-full max-h-80 object-cover rounded-lg border border-zinc-700 shadow-md"
                            />
                            <button
                                type="button"
                                onClick={handleDeselect}
                                className="absolute top-[-10px] right-[-10px] rounded-full h-8 w-8 text-zinc-400 bg-zinc-800 hover:bg-red-600 text-sm font-semibold flex items-center justify-center shadow-lg"
                            >
                                ✕
                            </button>
                        </div>
                    )}

                    {/* Caption Input */}
                    <input
                        type='text'
                        placeholder='Ai will Generate Caption or Type yours'
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        className='p-3 mb-4 border-4 border-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 bg-black text-white'
                    />

                    {error && <p className="text-red-500 mb-4">{error}</p>}

                    {/* Submit Button */}
                    <button
                        type='submit'
                        disabled={loading}
                        className='bg-black border-4 border-zinc-800 text-white font-semibold py-4 px-5 rounded-md hover:bg-blue-500 transition duration-300'
                    >
                        {loading ? "Uploading..." : "Create Post"}
                    </button>
                </form>
            </SpotlightCard>

            <AppDock/>
        </div>
    );
};

export default CreatePost;
