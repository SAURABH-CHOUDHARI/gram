import React from 'react';
import { FaTimes } from "react-icons/fa";

const LikeModal = ({ title, likes, onClose }) => {
    if (!likes || likes.length === 0) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80" onClick={onClose}>
            <div className="bg-zinc-900 w-full max-w-sm rounded-lg overflow-hidden" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-zinc-700">
                    <h3 className="font-semibold text-lg">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white"
                    >
                        <FaTimes size={18} />
                    </button>
                </div>

                {/* Likes list */}
                <div className="max-h-96 overflow-y-auto">
                    <ul>
                        {likes.map((like, index) => (
                            <li key={index} className="flex items-center p-4 border-b border-zinc-800">
                                <img
                                    src={like.profileImage}
                                    alt={like.username}
                                    className="w-10 h-10 rounded-full mr-3"
                                />
                                <p className="font-medium">{like.username}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default LikeModal;