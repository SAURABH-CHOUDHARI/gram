import React, { useState } from 'react';
import { FaHeart, FaRegComment, FaShare } from "react-icons/fa";
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

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <>
            <div
                className="relative w-full bg-black rounded-xl overflow-hidden group border-zinc-800 border"
                onClick={openModal}
            >
                {/* Post Header */}
                <div className="flex items-center p-4 border-b border-zinc-800 bg-zinc-900/30">
                    <img
                        src={author.profileImage}
                        alt={author.username}
                        className="w-10 h-10 rounded-full mr-3 ring-2 ring-purple-500 p-0.5"
                    />
                    <div>
                        <p className="font-semibold">{author.username}</p>
                        <p className="text-xs text-gray-400">{formatDate(post.createdAt)}</p>
                    </div>
                </div>

                {/* Post Image */}
                <div className="w-full h-96 bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <img
                        src={post.media}
                        alt={post.caption}
                        className="w-full h-full object-cover cursor-pointer"
                        onDoubleClick={(e) => {
                            e.stopPropagation(); // Prevent opening modal on double click
                            handleLike(e);
                        }}
                    />
                </div>



                {/* Caption Section */}
                <div className="px-4 py-2 ">
                    <div className="flex items-center">
                                <span className="font-semibold mr-2">{author.username}</span>
                                <span className="text-gray-200 line-clamp-2">{post.caption}</span>
                    </div>
                    {post.comments && post.comments.length > 0 && (
                        <button
                            className="mt-2 text-sm text-gray-400 hover:text-gray-300"
                            onClick={openModal}
                        >
                            View all {post.comments.length} comments
                        </button>
                    )}
                </div>

                {/* Actions Section */}
                <div className="p-4 border-t border-zinc-800 bg-gradient-to-r from-black to-zinc-900">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={(e) => handleLike(e)}
                            className="transform active:scale-125 transition-transform"
                        >
                            <FaHeart
                                size={24}
                                className={`${isLiked ? "text-red-500" : "text-gray-400 hover:text-gray-200"} transition-colors`}
                            />
                        </button>
                        <button className="text-gray-400 hover:text-gray-200 transition-colors">
                            <FaRegComment size={24} />
                        </button>
                        <button className="text-gray-400 hover:text-gray-200 transition-colors">
                            <FaShare size={20} />
                        </button>
                        <span className="font-medium ml-auto">
                            {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
                        </span>
                    </div>
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