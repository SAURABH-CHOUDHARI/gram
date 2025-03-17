import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import AppDock from "../components/AppDock";
import GradientText from '../components/GradientText';
import { FaPaperPlane, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';

const Messages = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const messagesEndRef = useRef(null);

    // Connect to socket on component mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const socketInstance = io('https://gram-ks17.onrender.com', {
            extraHeaders: {
                token
            }
        });

        socketInstance.on('connect', () => {
            console.log('Connected to socket server');
        });

        socketInstance.on('chat-message', (message) => {
            setMessages(prev => [...prev, message]);
        });

        setSocket(socketInstance);

        // Clean up on unmount
        return () => {
            socketInstance.disconnect();
        };
    }, []);

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (selectedUser && socket) {
            setLoading(true);
            socket.emit('get-conversation', selectedUser.userId);

            socket.on('conversation-history', (data) => {
                setMessages(data);
                setLoading(false);
            });

            return () => {
                socket.off('conversation-history');
            };
        }
    }, [selectedUser, socket]);

    useEffect(() => {
        // Check if there's a stored user to open chat with
        const storedUser = localStorage.getItem('openChatUser');
        if (storedUser) {
            const userToOpen = JSON.parse(storedUser);

            // Find the user in conversations
            const foundUser = conversations.find(convo => convo.userId === userToOpen.userId);

            if (foundUser) {
                // If user exists in conversations, select them
                setSelectedUser(foundUser);
            } else {
                // If user is not in conversations, create a new conversation object
                const newConversation = {
                    userId: userToOpen.userId,
                    username: userToOpen.username,
                    profileImage: userToOpen.profileImage,
                    lastMessage: ''
                };

                // Add to conversations and select
                setConversations(prev => [...prev, newConversation]);
                setSelectedUser(newConversation);
            }

            // Clear the stored user after using it
            localStorage.removeItem('openChatUser');
        }
    }, [conversations]);

    const fetchConversations = async () => {
        try {
            const response = await axios.get("https://gram-ks17.onrender.com/users/conversations", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            
            // Check if we have a pending conversation to add
            const storedUser = localStorage.getItem('openChatUser');
            if (storedUser) {
                const userToOpen = JSON.parse(storedUser);
                // Check if this user is already in the conversations
                const exists = response.data.conversations.some(
                    convo => convo.userId === userToOpen.userId
                );
                
                if (!exists) {
                    // Add the new user to conversations
                    response.data.conversations.push({
                        userId: userToOpen.userId,
                        username: userToOpen.username,
                        profileImage: userToOpen.profileImage,
                        lastMessage: ''
                    });
                }
            }
            
            setConversations(response.data.conversations);
            setCurrentUser(response.data.currentUser);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching conversations:", error);
            setLoading(false);
        }
    };

    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedUser || !socket) return;

        // Send the message
        socket.emit('chat-message', {
            receiver: selectedUser.userId,
            text: newMessage
        });

        // If this is a new conversation, we can add the message to the UI immediately
        // This provides instant feedback even if the server hasn't returned the message yet
        if (messages.length === 0) {
            const tempMessage = {
                _id: 'temp-' + Date.now(),
                sender: currentUser?._id,
                text: newMessage,
                createdAt: new Date().toISOString()
            };
            setMessages([tempMessage]);
        }

        setNewMessage('');
    };

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        // Close sidebar on mobile after selecting a conversation
        setSidebarOpen(false);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Loading state
    if (loading && !selectedUser) {
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
        <div className='min-h-screen max-h-screen bg-black text-white flex flex-col items-center p-2 sm:p-6'>
            {/* Messages Header */}
            <div className='w-full max-w-[42rem] flex items-center mb-2 px-1'>
                {/* Hamburger menu for mobile */}
                <button
                    className="mr-2 text-white md:hidden"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    <FaBars size={20} />
                </button>

                <h1 className="text-2xl sm:text-3xl font-bold">
                    <GradientText
                        colors={["#a855f7", "#3b82f6", "#a855f7", "#3b82f6", "#a855f7"]}
                        animationSpeed={0.2}
                        showBorder={false}
                    >
                        Messages
                    </GradientText>
                </h1>

                {selectedUser && (
                    <div className="flex items-center ml-auto md:hidden">
                        <div className="h-6 w-6 rounded-full mr-2">
                            <img src={selectedUser.profileImage} alt={selectedUser.username} className="h-6 w-6 rounded-full" />
                        </div>
                        <p className="font-medium text-sm">{selectedUser.username}</p>
                    </div>
                )}
            </div>

            {/* Messages Container */}
            <div className='w-full max-w-[42rem] h-[85dvh] flex relative'>
                {/* Mobile sidebar overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                )}

                {/* Conversations List - Mobile Sidebar */}
                <div className={`fixed md:relative top-0 left-0 h-full w-3/4 max-w-[280px] md:w-1/3 border border-zinc-800 rounded-r-lg md:rounded-l-lg bg-zinc-900 flex flex-col z-20 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                    <div className="flex items-center justify-between px-3 py-3 border-b border-zinc-800">
                        <h3 className="text-lg font-semibold">Chats</h3>
                        <button
                            className="text-white md:hidden"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <FaTimes size={18} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-auto scrollbar-hide">
                        {conversations.length > 0 ? (
                            conversations.map((convo) => (
                                <div
                                    key={convo.userId}
                                    className={`flex items-center p-2 sm:p-3 hover:bg-zinc-800 cursor-pointer ${selectedUser && selectedUser.userId === convo.userId ? 'bg-zinc-800' : ''}`}
                                    onClick={() => handleSelectUser(convo)}
                                >
                                    <div className="h-10 w-10 rounded-full flex items-center justify-center mr-2">
                                        <img src={convo.profileImage} alt={convo.username} className="h-10 w-10 rounded-full" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="font-medium truncate">{convo.username}</p>
                                        <p className="text-xs text-gray-400 truncate">{convo.lastMessage || 'Start a conversation'}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-gray-500">No conversations yet.</div>
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className='w-full md:w-2/3 md:ml-auto border border-zinc-800 rounded-lg md:rounded-l-none bg-zinc-900 flex flex-col'>
                    {selectedUser ? (
                        <>
                            {/* Chat Header - only visible on larger screens */}
                            <div className="hidden md:flex px-4 py-3 border-b border-zinc-800 items-center">
                                <div className="h-8 w-8 rounded-full flex items-center justify-center mr-3">
                                    <img src={selectedUser.profileImage} alt={selectedUser.username} className="h-8 w-8 rounded-full" />
                                </div>
                                <div>
                                    <p className="font-medium">{selectedUser.username}</p>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 p-2 sm:p-4  overflow-y-auto scrollbar-hide flex flex-col gap-2">
                                {loading ? (
                                    <div className="flex justify-center items-center h-full">
                                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : messages.length > 0 ? (
                                    messages.map((msg) => {
                                        const isCurrentUser = currentUser && msg.sender === currentUser._id;
                                        return (
                                            <div
                                                key={msg._id}
                                                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-[80%] sm:max-w-[70%] rounded-lg px-3 py-2 ${isCurrentUser
                                                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                                                        : 'bg-zinc-800 text-white'
                                                        }`}
                                                >
                                                    <p className="text-sm sm:text-base">{msg.text}</p>
                                                    <p className="text-xs text-right mt-1 opacity-70">
                                                        {formatTime(msg.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center text-gray-500 mt-4">
                                        No messages yet. Start a conversation!
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message Input */}
                            <div className="p-2 sm:p-3 border-t border-zinc-800">
                                <div className="flex">
                                    <input
                                        type="text"
                                        placeholder="Type a message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        className="flex-1 bg-zinc-800 border-none rounded-l-lg p-2 text-white text-sm sm:text-base focus:outline-none"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-3 rounded-r-lg flex items-center justify-center"
                                    >
                                        <FaPaperPlane size={16} />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500 px-4 text-center">
                            Select a conversation to start messaging
                        </div>
                    )}
                </div>
            </div>

            {/* Dock Navigation */}
            <div className="mt-auto">
                <AppDock />
            </div>
        </div>
    );
};

export default Messages;