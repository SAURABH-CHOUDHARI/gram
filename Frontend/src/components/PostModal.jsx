import React, { useState, useEffect } from 'react';
import { TbDotsVertical } from "react-icons/tb";
import axios from 'axios';
import LikeModal from './LikeModal';
import { FaHeart, FaTimes, FaRegComment, FaShare } from 'react-icons/fa';

const PostModal = ({ post, onClose, currentUsername, onPostUpdate }) => {
    const [postData, setPostData] = useState(post);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [showAllComments, setShowAllComments] = useState(false);
    const [showPostLikes, setShowPostLikes] = useState(false);
    const [showCommentLikes, setShowCommentLikes] = useState(null);
    const [commenting, setCommenting] = useState(false);

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
            setCommenting(true);
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
            setCommenting(false);
            fetchPostDetails();
            if (onPostUpdate) {
                onPostUpdate();
            }
        } catch (error) {
            console.error("Error adding comment:", error.response?.data?.message || error.message);
            setCommenting(false);
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

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80" onClick={onClose}>
                <div className="bg-black w-full max-w-4xl rounded-xl overflow-hidden flex flex-col border-zinc-800 border-4 md:flex-row" onClick={e => e.stopPropagation()}>
                    {/* Left side - Image */}
                    <div className="w-full md:w-3/5 h-96 md:h-auto relative bg-zinc-900 flex items-center justify-center">
                        <img
                            src={postData.media}
                            alt={postData.caption}
                            className="w-full h-full object-contain"
                        />
                    </div>

                    {/* Right side - Details */}
                    <div className="w-full md:w-2/5 flex flex-col h-full max-h-[90vh]">
                        {/* Header */}
                        <div className="flex items-center p-4 border-b border-zinc-800 bg-zinc-900/30">
                            <img
                                src={postData.author.profileImage}
                                alt={postData.author.username}
                                className="w-10 h-10 rounded-full mr-3 ring-2 ring-purple-500 p-0.5"
                            />
                            <div>
                                <p className="font-semibold">{postData.author.username}</p>
                                <p className="text-xs text-gray-400">{formatDate(postData.createdAt)}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="ml-auto text-gray-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-full p-2 transition-colors"
                            >
                                <FaTimes size={16} />
                            </button>
                        </div>

                        {/* Caption and details */}
                        <div className="p-4 border-b border-zinc-800 bg-gradient-to-r from-zinc-900 to-black">
                            <div className="flex items-start">
                                <img
                                    src={postData.author.profileImage}
                                    alt={postData.author.username}
                                    className="w-8 h-8 rounded-full mr-3"
                                />
                                <div>
                                    <p>
                                        <span className="font-semibold mr-2">{postData.author.username}</span>
                                        <span className="text-gray-200">{postData.caption}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Comments section */}
                        <div className="flex-1 overflow-y-auto p-4 border-b border-zinc-800 bg-black">
                            {loading ? (
                                <div className="flex justify-center items-center h-full">
                                    <div className="w-8 h-8 border-4 border-zinc-600 border-t-blue-500 rounded-full animate-spin"></div>
                                </div>
                            ) : postData.comments && postData.comments.length > 0 ? (
                                <>
                                    {displayComments.map((comment) => (
                                        <div key={comment._id} className="flex items-start mb-5 group">
                                            <img
                                                src={comment.user?.profileImage || "https://via.placeholder.com/40"}
                                                alt={comment.user?.username}
                                                className="w-8 h-8 rounded-full mr-3"
                                            />
                                            <div className="flex-1">
                                                <div className="bg-zinc-900/50 p-3 rounded-lg">
                                                    <p className="font-semibold text-sm text-gray-300">{comment.user?.username}</p>
                                                    <p className="mt-1 text-gray-200">{comment.comment}</p>
                                                </div>
                                                <div className="flex items-center mt-1 pl-1 text-xs text-gray-500">
                                                    <span>{formatDate(comment.createdAt)}</span>
                                                    <span className="mx-2">•</span>
                                                    <button 
                                                        onClick={() => handleCommentLike(comment._id)}
                                                        className="hover:text-gray-300 transition-colors flex items-center"
                                                    >
                                                        <FaHeart
                                                            size={10}
                                                            className={`mr-1 ${comment.likes?.some(like => like.username === currentUsername) ? "text-red-500" : ""}`}
                                                        />
                                                        {comment.likes?.length || 0}
                                                    </button>
                                                    {comment.likes?.length > 0 && (
                                                        <button
                                                            className="ml-2 hover:text-gray-300 transition-colors"
                                                            onClick={(e) => openCommentLikes(e, comment._id)}
                                                        >
                                                            View
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            {/* Show three dots only if current user is the comment author */}
                                            {comment.user?.username === currentUsername && (
                                                <button className="opacity-90 group-hover:opacity-100 transition-opacity ml-2 text-gray-200 hover:text-white">
                                                    <TbDotsVertical size={16} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    {postData.comments && postData.comments.length > 3 && (
                                        <button
                                            className="text-blue-400 text-sm hover:underline mt-2"
                                            onClick={() => setShowAllComments(!showAllComments)}
                                        >
                                            {showAllComments ? "Show less" : `View all ${postData.comments.length} comments`}
                                        </button>
                                    )}
                                </>
                            ) : (
                                <div className="h-full flex items-center justify-center">
                                    <p className="text-center text-gray-500">No comments yet. Be the first to comment!</p>
                                </div>
                            )}
                        </div>

                        {/* Like section */}
                        <div className="p-4 border-b border-zinc-800 bg-gradient-to-r from-black to-zinc-900">
                            <div className="flex items-center space-x-4">
                                <button 
                                    onClick={handleLike} 
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
                                <button
                                    className="font-medium ml-auto hover:underline cursor-pointer"
                                    onClick={openPostLikes}
                                >
                                    {postData.likes.length} {postData.likes.length === 1 ? "like" : "likes"}
                                </button>
                            </div>
                        </div>

                        {/* Add comment section */}
                        <form onSubmit={handleAddComment} className="p-4 flex items-center space-x-3 bg-zinc-900/30">
                            <input
                                type="text"
                                placeholder="Add a comment..."
                                className="flex-1 bg-zinc-800 border-none focus:outline-none p-3 rounded-full text-sm"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={!newComment.trim() || commenting}
                                className={`px-4 py-2 rounded-full font-medium text-sm
                                    ${newComment.trim() && !commenting
                                        ? "bg-gradient-to-r from-purple-500 to-blue-600 text-white" 
                                        : "bg-zinc-800 text-gray-500"
                                    } transition-colors`}
                            >
                                {commenting ? "Posting..." : "Post"}
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