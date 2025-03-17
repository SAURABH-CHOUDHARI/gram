import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GradientText from '../components/GradientText';
import FollowersModal from '../components/FollowersModal';
import NotFound from './NotFound';
import AppDock from '../components/AppDock';
import PostCard from '../components/PostCard';

const SearchProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loggedInProfile, setLoggedInProfile] = useState('');
    const [isFollowing, setIsFollowing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalUsers, setModalUsers] = useState([]);
    const [modalTitle, setModalTitle] = useState("");
    const [notFound, setNotFound] = useState(false);

    const { username } = useParams();

    useEffect(() => {
        fetchSearchedProfile();
    }, [username]);

    const fetchSearchedProfile = async () => {
        try {
            setNotFound(false);
            const response = await axios.post(
                "https://gram-ks17.onrender.com/users/searched-profile",
                { username },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (response.data?.user) {
                setProfile(response.data.user);
                setLoggedInProfile(response.data.name);
                setIsFollowing(response.data.user.followers.some(follower => follower.username === response.data.name));
            }
        } catch (error) {
            console.error("Error fetching searched profile data:", error.response?.data || error.message);
            setNotFound(true);
        }
    };

    const handleFollow = async () => {
        try {
            await axios.patch(
                "https://gram-ks17.onrender.com/users/togglefollow",
                { username },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                }
            );
            fetchSearchedProfile();
        } catch (err) {
            console.error("Error following user:", err.response?.data || err.message);
        }
    };

    if (notFound) return <NotFound />;
    if (!profile) {
        return (
            <div className='h-[100dvh] bg-black flex items-center justify-center'>
                <div role="status">
                    <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-[100dvh] max-h-[100dvh] bg-black text-white flex flex-col items-center '>
            <div className='min-w-[20rem] max-w-[32rem] w-full border border-zinc-800 p-6 rounded-lg bg-zinc-900'>
                {/* Profile header with image and details */}
                <div className='flex mb-6'>
                    {/* Profile image */}
                    <div className='mr-8'>
                        <img
                            src={profile?.profileImage}
                            alt='Profile'
                            className='w-20 h-20 rounded-full border-2 border-zinc-800'
                        />
                    </div>

                    {/* Profile info */}
                    <div className='flex flex-col justify-between'>
                        {/* Username and follow button */}
                        <div className='flex items-center mb-4'>
                            <h2 className='text-xl font-semibold mr-4'>{profile?.username}</h2>
                            {profile?.username !== loggedInProfile && (
                                <button
                                    onClick={handleFollow}
                                    className={`px-4 py-1.5 rounded text-sm font-medium text-white ${isFollowing ? 'bg-red-500' : 'bg-blue-500'}`}
                                >
                                    {isFollowing ? "Unfollow" : "Follow"}
                                </button>
                            )}
                        </div>

                        {/* Stats row */}
                        <div className='flex space-x-6'>
                            <div className='text-center'>
                                <span className='font-semibold'>{profile?.posts.length}</span>
                                <p className='text-gray-400 text-sm'>posts</p>
                            </div>

                            <div
                                onClick={() => { setModalTitle("Followers"); setModalUsers(profile?.followers); setIsModalOpen(true); }}
                                className='cursor-pointer text-center'
                            >
                                <span className='font-semibold'>{profile?.followers.length}</span>
                                <p className='text-gray-400 text-sm'>followers</p>
                            </div>

                            <div
                                onClick={() => { setModalTitle("Following"); setModalUsers(profile?.following); setIsModalOpen(true); }}
                                className='cursor-pointer text-center'
                            >
                                <span className='font-semibold'>{profile?.following.length}</span>
                                <p className='text-gray-400 text-sm'>following</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <FollowersModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle} users={modalUsers} />
            <div className='min-w-[20rem] max-w-[32rem] w-full mt-2 border border-zinc-800 rounded-lg bg-zinc-900 overflow-hidden'>
                <h3 className='text-lg font-semibold px-6 py-4 border-b border-zinc-800'>
                    <GradientText colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]} animationSpeed={1} showBorder={false}>
                        Posts
                    </GradientText>
                </h3>
                <div className='max-sm:h-[58dvh] md:max-h-[70dvh] overflow-y-scroll p-6 scrollbar-hide'>
                    <div className='flex flex-col gap-4'>
                        {profile?.posts?.length > 0 ? (
                            profile.posts.map(post => (
                                <PostCard
                                    key={post._id}
                                    post={post}
                                    author={profile}
                                    currentUsername={loggedInProfile}
                                    onPostUpdate={fetchSearchedProfile}
                                />
                            ))
                        ) : (
                            <p className='text-gray-500 text-center col-span-3'>No posts yet.</p>
                        )}
                    </div>
                </div>
            </div>
            <AppDock />
        </div>
    );
};

export default SearchProfile;
