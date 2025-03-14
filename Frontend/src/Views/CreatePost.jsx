import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import GradientText from '../components/GradientText';
import AppDock from '../components/AppDock';
import { FaCloudUploadAlt, FaImage, FaPen } from 'react-icons/fa';

const CreatePost = () => {
    const [media, setMedia] = useState(null);
    const [preview, setPreview] = useState(null);
    const [caption, setCaption] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleMediaChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMedia(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleDeselect = () => {
        setMedia(null);
        setPreview(null);
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
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <div className="container mx-auto px-4 py-8 flex-grow flex items-center">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 w-full">
                    
                    {/* Left section - Info and Tips - Hidden on mobile */}
                    <div className="hidden md:flex md:flex-1 md:flex-col space-y-6 max-w-md">
                        <div className="space-y-2">
                            <h1 className="text-4xl md:text-5xl font-bold">
                                <GradientText
                                    colors={["#a855f7", "#3b82f6", "#a855f7", "#3b82f6", "#a855f7"]}
                                    animationSpeed={0.2}
                                    showBorder={false}
                                >
                                    Create Post
                                </GradientText>
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-300 font-light">
                                Share your moments with the world
                            </p>
                        </div>
                        <p className="text-gray-400 text-lg max-w-xl">
                            Upload photos, add captions, and share with your followers. Express yourself and connect with others through visual storytelling.
                        </p>
                        <div className="flex flex-col gap-4 pt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center">
                                    <FaImage className="h-5 w-5 text-white" />
                                </div>
                                <span className="text-gray-300">Choose a high-quality image</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                    <FaPen className="h-5 w-5 text-white" />
                                </div>
                                <span className="text-gray-300">Add a meaningful caption</span>
                            </div>
                        </div>
                        <p className="text-gray-500 text-sm mt-6">
                            Tip: Square images look best in your feed
                        </p>
                    </div>

                    {/* Visible heading for mobile only */}
                    <div className="md:hidden w-full text-center mb-6">
                        <h1 className="text-3xl font-bold">
                            <GradientText
                                colors={["#a855f7", "#3b82f6", "#a855f7", "#3b82f6", "#a855f7"]}
                                animationSpeed={0.2}
                                showBorder={false}
                            >
                                Create Post
                            </GradientText>
                        </h1>
                    </div>

                    {/* Right section - Upload Form - Full width on mobile */}
                    <div className="w-full md:flex-1 md:max-w-md">
                        <div className="bg-zinc-900/30 p-6 md:p-8 rounded-xl border-4 border-zinc-800 shadow-2xl">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="text-center mb-6">
                                    <h2 className="text-xl md:text-2xl font-bold mb-2">Upload Your Post</h2>
                                    <p className="text-gray-400">Select an image and add your caption</p>
                                </div>
                                
                                {/* Upload Area */}
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        onChange={handleMediaChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        required
                                    />
                                    <div className={`flex flex-col items-center justify-center h-48 border-2 border-dashed ${preview ? 'border-purple-500' : 'border-zinc-700'} rounded-lg p-4 transition-all`}>
                                        {preview ? (
                                            <div className="relative h-full w-full">
                                                <img
                                                    src={preview}
                                                    alt="Preview"
                                                    className="w-full h-full object-contain rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleDeselect}
                                                    className="absolute top-2 right-2 rounded-full h-8 w-8 text-white bg-black bg-opacity-50 hover:bg-red-600 flex items-center justify-center shadow-lg"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <FaCloudUploadAlt className="text-5xl text-gray-400 mb-3" />
                                                <p className="text-gray-400 text-center">
                                                    Click or drag image here to upload
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Caption Input */}
                                <div>
                                    <label htmlFor="caption" className="block text-sm font-medium text-gray-300 mb-2">
                                        Caption
                                    </label>
                                    <input
                                        id="caption"
                                        type="text"
                                        placeholder="Describe your post..."
                                        value={caption}
                                        onChange={(e) => setCaption(e.target.value)}
                                        className="w-full bg-zinc-800 border-none rounded-lg p-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                </div>
                                        <span className='text-xs'>"Skip the caption, let AI handle it.</span>
                                
                                {error && (
                                    <div className="bg-red-900/30 border border-red-800 text-red-300 p-3 rounded-lg">
                                        {error}
                                    </div>
                                )}
                                
                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg text-white font-medium text-center transition-transform hover:scale-105 disabled:opacity-70 disabled:transform-none"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Uploading...
                                        </div>
                                    ) : (
                                        "Create Post"
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="mt-auto">
                <AppDock />
            </div>
        </div>
    );
};

export default CreatePost;