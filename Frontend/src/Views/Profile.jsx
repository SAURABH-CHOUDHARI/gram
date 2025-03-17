import axios from 'axios';
import React, { useEffect, useState } from 'react';
import AppDock from "../components/AppDock";
import GradientText from '../components/GradientText';
import FollowersModal from '../components/FollowersModal';
import PostCard from '../components/PostCard'; // Import the new component

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalUsers, setModalUsers] = useState([]);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        await axios.get("https://gram-ks17.onrender.com/users/profile", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then((response) => {
                setProfile(response.data);
            })
            .catch((error) => {
                console.error("Error fetching profile data:", error);
            });
    }

    const handleOpenModal = (type) => {
        if (type === "followers") {
            setModalTitle("Followers");
            setModalUsers(profile.followers);
        } else {
            setModalTitle("Following");
            setModalUsers(profile.following);
        }
        setIsModalOpen(true);
    };

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
            {/* Profile Header Section */}
            <div className='min-w-[20rem] max-w-[32rem] w-full border flex-col border-zinc-800 p-6 rounded-lg bg-zinc-900 flex'>
                <div className='flex items-center justify-between w-full px-2'>
                    <div className='text-center'>
                        <img src={profile?.profileImage} alt='Profile' className='w-14 h-14 rounded-full border-2 border-zinc-800 ' />
                        <h2 className='text-xl font-bold'>{profile?.username}</h2>
                    </div>
                    <div className='flex flex-col gap-4 text-center'>
                        <div className='flex gap-10'>
                            <div>
                                <p className='text-xl font-semibold'>{profile?.posts.length}</p>
                                <p className='text-gray-400 text-sm'>Posts</p>
                            </div>
                            <div onClick={() => handleOpenModal("followers")} className='cursor-pointer'>
                                <p className='text-xl font-semibold'>{profile?.followers.length}</p>
                                <p className='text-gray-400 text-sm'>Followers</p>
                            </div>
                            <div onClick={() => handleOpenModal("following")} className='cursor-pointer'>
                                <p className='text-xl font-semibold'>{profile?.following.length}</p>
                                <p className='text-gray-400 text-sm'>Following</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mt-5 text-zinc-400 text-center'>
                    {profile?.bio}
                </div>
            </div>

            {/* Scrollable Posts Section */}
            <div className="min-w-[20rem] max-w-[32rem] h-[65dvh] md:h-[72dvh] w-full mt-2 border border-zinc-800 rounded-lg bg-zinc-900 flex flex-col">
                <h3 className="text-lg font-semibold px-6 py-4 border-b border-zinc-800">
                    <GradientText
                        colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                        animationSpeed={1}
                        showBorder={false}
                        className="custom-class"
                    >
                        Posts
                    </GradientText>
                </h3>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-auto p-6 scrollbar-hide">
                    <div className="flex flex-col gap-4">
                        {profile?.posts?.length > 0 ? (
                            profile.posts.map((post) => (
                                <PostCard
                                    key={post._id}
                                    post={post}
                                    author={profile}
                                    currentUsername={profile.username}
                                    onPostUpdate={fetchProfile}
                                />
                            ))
                        ) : (
                            <p className="text-gray-500 text-center col-span-3">No posts yet.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Followers Modal */}
            <FollowersModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalTitle}
                users={modalUsers}
            />

            {/* Dock Navigation */}
            <AppDock />
        </div>
    );
};

export default Profile;