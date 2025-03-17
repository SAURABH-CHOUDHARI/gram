import axios from 'axios';
import React, { useEffect, useState } from 'react';
import GradientText from '../components/GradientText';
import AppDock from '../components/AppDock';
import PostCard from '../components/PostCard';
import { FaRegCompass } from 'react-icons/fa';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchFeed = async () => {
        setLoading(true);
        try {
            const res = await axios.get("https://gram-ks17.onrender.com/feed", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setPosts(res.data.posts);
            setUser(res.data.username);
        } catch (err) {
            console.error("Error fetching posts:", err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchFeed();
    }, []);

    return (
        <div className='min-h-[100dvh] max-h-[100dvh] bg-black text-white flex flex-col items-center overflow-hidden'>
            {/* Header */}
            <div className='w-full max-w-lg mb-4 flex items-center justify-center'>
                <h2 className='text-3xl font-bold text-center'>
                    <GradientText
                        colors={["#a855f7", "#3b82f6", "#a855f7", "#3b82f6", "#a855f7"]}
                        animationSpeed={0.2}
                        showBorder={false}
                        className="custom-class"
                    >
                        Feed
                    </GradientText>
                </h2>
            </div>
            
            {/* Main Container */}
            <div className='max-w-lg w-full min-w-sm max-h-[83dvh] min-h-[83dvh] border-4 border-zinc-800 rounded-xl bg-zinc-900/30 overflow-hidden flex flex-col'>
                {/* Feed Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="w-8 h-8 border-4 border-zinc-600 border-t-blue-500 rounded-full animate-spin"></div>
                        </div>
                    ) : posts?.length > 0 ? (
                        <div className="flex flex-col gap-6">
                            {posts.map((post) => (
                                <PostCard
                                    key={post._id}
                                    post={post}
                                    author={post.author}
                                    currentUsername={user}
                                    onPostUpdate={fetchFeed}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="bg-zinc-800 rounded-full p-6 mb-4">
                                <FaRegCompass size={48} className="text-purple-500" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
                            <p className="text-gray-400 max-w-xs">
                                Your feed is empty. Start following people to see their posts here.
                            </p>
                        </div>
                    )}
                </div>
                
                {/* Dock */}
                <div className='mt-auto'>
                    <AppDock />
                </div>
            </div>
        </div>
    );
};

export default Home;