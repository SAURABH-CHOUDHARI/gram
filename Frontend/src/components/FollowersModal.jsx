import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "./ui/dialog";
import { useNavigate } from "react-router-dom";

const FollowersModal = ({ isOpen, onClose, title, users }) => {
    const navigate = useNavigate();
    
    const handleNavigate = (username) => {
        navigate(`/profile/${username}`);
        onClose(); // Close the modal after navigating
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-zinc-900 min-w-[20rem] max-w-[28rem] w-full text-white p-6 rounded-lg">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        {title === "Followers" ? "People who follow this user" : "People this user follows"}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-3 mt-3 max-h-[50vh] overflow-y-auto">
                    {users.length > 0 ? (
                        users.map((user, index) => (
                            <div key={index} className="flex items-center justify-between gap-3 p-2 border-b border-gray-700">
                                <div className="flex items-center gap-4">
                                    <img src={user.profileImage} alt={user.username} className="w-10 h-10 rounded-full" />
                                    <p>{user.username}</p>
                                </div>
                                <button
                                    onClick={() => handleNavigate(user.username)} // ✅ Navigate & close modal
                                    className="h-full bg-purple-700 text-zinc-200 font-bold w-20 p-2 rounded-lg border border-zinc-800"
                                >
                                    View
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No {title.toLowerCase()} yet.</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FollowersModal;
