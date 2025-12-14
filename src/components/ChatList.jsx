import { useState, useEffect } from 'react';
import { MessageCircle, Users, Plus, UserSearch } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '@/utils/constants';
// import api from '../utils/api';

/**
 * ChatList component displays all user chats in a sidebar
 * Shows individual and group chats with create group button
 */
const ChatList = ({ onChatSelect, onCreateGroup, onDiscoverUsers }) => {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedChatId, setSelectedChatId] = useState(null);

    useEffect(() => {
        fetchChats();
    }, []);

    const fetchChats = async () => {
        try {
            setLoading(true);
            const response = await axios.get(BASE_URL+'/user/chats', { withCredentials: true });
            // Handle the response - extract chats array from response
            const rooms = response.data.chats || [];
            // Map rooms to chat format
            const formattedChats = rooms.map(room => ({
                id: room._id,
                name: room.name,
                isGroup: room.isGroupChat,
                participantCount: room.members?.length || 0,
                description: room.description || '',
                photoUrl: room.photoUrl,
                members: room.members || [],
                lastMessage: '', // No last message in current response
                lastMessageTime: room.updatedAt,
                unreadCount: 0, // No unread count in current response
                createdAt: room.createdAt,
            }));
            setChats(formattedChats);
        } catch (error) {
            console.error('Error fetching rooms:', error);
            // For demo purposes, set empty array
            setChats([]);
        } finally {
            setLoading(false);
        }
    };

    const handleChatClick = (chat) => {
        setSelectedChatId(chat.id);
        onChatSelect(chat);
    };

    return (
        <div className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col h-full">
            {/* Header with Create Room button */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Rooms</h2>
                    <button
                        onClick={onCreateGroup}
                        className="flex items-center space-x-2 px-3 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#002244] transition-colors duration-200 shadow-sm"
                        aria-label="Create Room"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="text-sm font-medium">Room</span>
                    </button>
                </div>

                {/* Discover Users Button */}
                <button
                    onClick={onDiscoverUsers}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 mb-4 bg-gradient-to-r from-[#2C7A7B] to-[#1A5F5F] text-white rounded-lg hover:from-[#1A5F5F] hover:to-[#0D4F4F] transition-all duration-200 shadow-sm"
                >
                    <UserSearch className="w-4 h-4" />
                    <span className="text-sm font-medium">Discover Users</span>
                </button>

                {/* Search bar */}
                <input
                    type="text"
                    placeholder="Search rooms..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            {/* Chat list */}
            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="flex items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : chats.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                        <MessageCircle className="w-12 h-12 mb-2 text-gray-400" />
                        <p className="text-sm">No rooms yet</p>
                        <p className="text-xs mt-1">Create a room to get started</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {chats.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => handleChatClick(chat)}
                                className={`p-4 cursor-pointer transition-colors duration-150 hover:bg-gray-50 ${selectedChatId === chat.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    {/* Chat avatar */}
                                    {chat.photoUrl ? (
                                        <img
                                            src={chat.photoUrl}
                                            alt={chat.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${chat.isGroup ? 'bg-purple-100' : 'bg-blue-100'
                                            }`}>
                                            {chat.isGroup ? (
                                                <Users className="w-6 h-6 text-purple-600" />
                                            ) : (
                                                <MessageCircle className="w-6 h-6 text-blue-600" />
                                            )}
                                        </div>
                                    )}

                                    {/* Chat info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline">
                                            <h3 className="text-sm font-semibold text-gray-900 truncate">
                                                {chat.name || 'Unknown'}
                                            </h3>
                                            {chat.lastMessageTime && (
                                                <span className="text-xs text-gray-500 ml-2">
                                                    {new Date(chat.lastMessageTime).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </span>
                                            )}
                                        </div>
                                        {(chat.description || chat.lastMessage) && (
                                            <p className="text-sm text-gray-600 truncate mt-1">
                                                {chat.description || chat.lastMessage}
                                            </p>
                                        )}
                                    </div>

                                    {/* Unread badge */}
                                    {chat.unreadCount > 0 && (
                                        <div className="bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                            {chat.unreadCount}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatList;
