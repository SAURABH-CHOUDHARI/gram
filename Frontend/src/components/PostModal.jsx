import React, { useState, useEffect } from 'react';
import { TbDotsVertical } from "react-icons/tb";
import axios from 'axios';
import LikeModal from './LikeModal';
import { FaHeart, FaTimes } from 'react-icons/fa';

const PostModal = ({ post, onClose, currentUsername, onPostUpdate }) => {
    const [postData, setPostData] = useState(post);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [showAllComments, setShowAllComments] = useState(false);
    const [showPostLikes, setShowPostLikes] = useState(false);
    const [showCommentLikes, setShowCommentLikes] = useState(null);

    const isLiked = postData.likes.some(like => like.username === currentUsername);

    useEffect(() => {
        fetchPostDetails();
    }, [post._id]);

    const fetchPostDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `https://gram-ks17.onrender.com/posts/${post._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setPostData(response.data);
            console.log(response.data)
            setLoading(false);
        } catch (error) {
            console.error("Error fetching post details:", error.response?.data?.message || error.message);
            setLoading(false);
        }
    };

    const handleLike = async () => {
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

            fetchPostDetails();
            if (onPostUpdate) {
                onPostUpdate();
            }
        } catch (error) {
            console.error("Error liking post:", error.response?.data?.message || error.message);
        }
    };

    const handleCommentLike = async (commentId) => {
        try {
            await axios.post(
                `https://gram-ks17.onrender.com/comments/like`,
                { commentId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            fetchPostDetails();
        } catch (error) {
            console.error("Error liking comment:", error.response?.data?.message || error.message);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            await axios.post(
                `https://gram-ks17.onrender.com/comments/create`,
                { comment: newComment, postId: postData._id },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setNewComment('');
            fetchPostDetails();
            if (onPostUpdate) {
                onPostUpdate();
            }
        } catch (error) {
            console.error("Error adding comment:", error.response?.data?.message || error.message);
        }
    };

    const openPostLikes = (e) => {
        e.stopPropagation();
        if (postData.likes.length > 0) {
            setShowPostLikes(true);
        }
    };

    const openCommentLikes = (e, commentId) => {
        e.stopPropagation();
        const comment = postData.comments.find(c => c._id === commentId);
        if (comment && comment.likes && comment.likes.length > 0) {
            setShowCommentLikes(comment);
        }
    };

    const closePostLikes = () => {
        setShowPostLikes(false);
    };

    const closeCommentLikes = () => {
        setShowCommentLikes(null);
    };

    const displayComments = postData.comments && postData.comments.length > 0 ?
        (showAllComments ? postData.comments : postData.comments.slice(0, 3)) : [];

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80" onClick={onClose}>
                <div className="bg-zinc-900 w-full max-w-2xl rounded-lg overflow-hidden flex flex-col border-zinc-700 border-2 md:flex-row" onClick={e => e.stopPropagation()}>
                    {/* Left side - Image */}
                    <div className="w-full md:w-3/5 h-96 md:h-auto relative">
                        <img
                            src={postData.media}
                            alt={postData.caption}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Right side - Details */}
                    <div className="w-full md:w-2/5 flex flex-col h-full max-h-screen">
                        {/* Header */}
                        <div className="flex items-center p-4 border-b border-zinc-700">
                            <img
                                src={postData.author.profileImage}
                                alt={postData.author.username}
                                className="w-8 h-8 rounded-full mr-3"
                            />
                            <p className="font-semibold">{postData.author.username}</p>
                            <button
                                onClick={onClose}
                                className="ml-auto text-gray-400 hover:text-white"
                            >
                                <FaTimes size={18} />
                            </button>
                        </div>

                        {/* Caption and details */}
                        <div className="p-4 border-b border-zinc-700">
                            <div className="flex items-start mb-2">
                                <img
                                    src={postData.author.profileImage}
                                    alt={postData.author.username}
                                    className="w-8 h-8 rounded-full mr-3"
                                />
                                <div>
                                    <p>
                                        <span className="font-semibold mr-2">{postData.author.username}</span>
                                        <span>{postData.caption}</span>
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(postData.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Comments section */}
                        <div className="flex-1 overflow-y-auto p-4 border-b border-zinc-700">
                            {loading ? (
                                <p className="text-center text-gray-500">Loading comments...</p>
                            ) : postData.comments && postData.comments.length > 0 ? (
                                <>
                                    {displayComments.map((comment) => (
                                        <div key={comment._id} className="flex items-start mb-4">
                                            <img
                                                src={comment.user?.profileImage || "https://via.placeholder.com/40"}
                                                alt={comment.user?.username}
                                                className="w-8 h-8 rounded-full mr-3"
                                            />
                                            <div className="flex-1">
                                                <p>
                                                    <span className="font-semibold mr-2">{comment.user?.username}</span>
                                                    <span>{comment.comment}</span>
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {new Date(comment.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="ml-2 flex items-center">
                                                <button onClick={() => handleCommentLike(comment._id)}>
                                                    <FaHeart
                                                        size={14}
                                                        className={`${comment.likes?.some(like => like.username === currentUsername) ? "text-red-500" : "text-gray-400"}`}
                                                    />
                                                </button>
                                                {comment.likes?.length > 0 && (
                                                    <button
                                                        className="text-xs ml-1"
                                                        onClick={(e) => openCommentLikes(e, comment._id)}
                                                    >
                                                        {comment.likes.length}
                                                    </button>
                                                )}
                                                {/* Show three dots only if current user is the comment author */}
                                                {comment.user?.username === currentUsername && (
                                                    <button className="ml-2">
                                                        <TbDotsVertical
                                                            size={14}
                                                            className="text-gray-400"
                                                        />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {postData.comments && postData.comments.length > 3 && (
                                        <button
                                            className="text-blue-400 text-sm hover:underline"
                                            onClick={() => setShowAllComments(!showAllComments)}
                                        >
                                            {showAllComments ? "Show less" : `View all ${postData.comments.length} comments`}
                                        </button>
                                    )}
                                </>
                            ) : (
                                <p className="text-center text-gray-500">No comments yet.</p>
                            )}
                        </div>

                        {/* Like section */}
                        <div className="p-4 border-b border-zinc-700">
                            <div className="flex items-center">
                                <button onClick={handleLike} className="mr-2">
                                    <FaHeart
                                        size={24}
                                        className={`${isLiked ? "text-red-500" : "text-gray-400"}`}
                                    />
                                </button>
                                <button
                                    className="font-semibold cursor-pointer"
                                    onClick={openPostLikes}
                                >
                                    {postData.likes.length} {postData.likes.length === 1 ? "like" : "likes"}
                                </button>
                            </div>
                        </div>

                        {/* Add comment section */}
                        <form onSubmit={handleAddComment} className="p-4 flex">
                            <input
                                type="text"
                                placeholder="Add a comment..."
                                className="flex-1 bg-transparent border-none focus:outline-none"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={!newComment.trim()}
                                className={`font-semibold ${newComment.trim() ? "text-blue-400" : "text-blue-900"}`}
                            >
                                Post
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Likes Modals */}
            {showPostLikes && (
                <LikeModal
                    title="Likes"
                    likes={postData.likes}
                    onClose={closePostLikes}
                />
            )}

            {showCommentLikes && (
                <LikeModal
                    title="Comment Likes"
                    likes={showCommentLikes.likes}
                    onClose={closeCommentLikes}
                />
            )}
        </>
    );
};

export default PostModal;