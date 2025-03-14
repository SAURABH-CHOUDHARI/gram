import axios from 'axios';
import React, { useEffect, useState } from 'react';
import GradientText from '../components/GradientText';
import AppDock from '../components/AppDock';
import PostCard from '../components/PostCard';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState("");



    const fetchFeed = async () => {
        await axios.get("https://gram-ks17.onrender.com/feed", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(res => {
                setPosts(res.data.posts);
                setUser(res.data.username);
            })
            .catch(err => {
                console.error("Error fetching posts:", err.response?.data?.message || err.message);
            });
        };
        useEffect(() => {
            fetchFeed();
        }, []);


    return (
        <div className='min-h-screen max-h-screen bg-black text-white flex flex-col items-center p-6'>
            <h2 className='text-3xl font-bold mb-4 text-center'>
                <GradientText
                    colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                    animationSpeed={0.2}
                    showBorder={false}
                    className="custom-class"
                >
                    Feed
                </GradientText>
            </h2>
            <div className='max-w-lg min-w-sm max-h-[83dvh] min-h-[83dvh] border border-zinc-800 p-6 rounded-lg bg-zinc-900 overflow-y-scroll'>
                {posts?.length > 0 ? (
                    <div className="flex flex-col gap-4 min-h-96 overflow-y-auto">
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
                    <p className='text-gray-500 text-center'>No posts yet.</p>
                )}
            </div>
            <AppDock />
        </div>
    );
};

export default Home;
