import React, { useState } from 'react';
import { FaHeart } from "react-icons/fa";
import axios from 'axios';
import PostModal from './PostModal';

const PostCard = ({ post, author, currentUsername, onPostUpdate }) => {
    const [showModal, setShowModal] = useState(false);
    const isLiked = post.likes.some(like => like.username === currentUsername);

    const handleLike = async (e) => {
        e.stopPropagation(); // Prevent opening modal when clicking like button
        try {
            await axios.patch(
                "https://gram-ks17.onrender.com/posts/like",
                { postId: post._id },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            // Callback to refresh data in parent component
            if (onPostUpdate) {
                onPostUpdate();
            }
        } catch (error) {
            console.error("Error liking post:", error.response?.data?.message || error.message);
        }
    };

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <>
            <div 
                className="relative w-full h-96 bg-zinc-800 rounded-md overflow-hidden group"
                onClick={openModal}
            >
                {/* Post Header */}
                <div className="flex items-center bg-black p-3 border-b border-zinc-700 gap-3">
                    <img
                        src={author.profileImage}
                        alt={author.username}
                        className="w-10 h-10 rounded-full border border-zinc-700"
                    />
                    <p className="text-lg font-semibold">{author.username}</p>
                </div>

                {/* Post Image */}
                <img
                    src={post.media}
                    alt={post.caption}
                    className="w-full h-full object-cover cursor-pointer"
                    onDoubleClick={(e) => {
                        e.stopPropagation(); // Prevent opening modal on double click
                        handleLike(e);
                    }}
                />

                {/* Post Footer */}
                <div className="absolute h-14 bottom-0 w-full bg-black bg-opacity-60 text-white text-sm py-2 px-3 flex items-center">
                    <button 
                        onClick={(e) => handleLike(e)} 
                        className="mr-1"
                    >
                        <FaHeart
                            size={22}
                            className={`${isLiked ? "text-red-500" : "text-gray-400"}`}
                        />
                    </button>
                    <span className="mr-2">{post?.likes ? post.likes.length : 0}</span>
                    <span className="line-clamp-2">{post.caption}</span>
                </div>
            </div>

            {/* Post Modal */}
            {showModal && (
                <PostModal 
                    post={post}
                    onClose={closeModal}
                    currentUsername={currentUsername}
                    onPostUpdate={onPostUpdate}
                />
            )}
        </>
    );
};

export default PostCard;