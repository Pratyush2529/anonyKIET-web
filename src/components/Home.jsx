import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Users, UserSearch, Plus } from 'lucide-react';
// import api from '../utils/api';
import UserSuggestionsModal from '../components/UserSuggestionsModal';
import axios from 'axios';
import { BASE_URL } from '@/utils/constants';

/**
 * ChatsListPage - Displays all user's chats
 * Full page view with discover users functionality
 */
const Home = () => {
    const navigate = useNavigate();
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSuggestionsModalOpen, setIsSuggestionsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchChats();
    }, []);

    const fetchChats = async () => {
        try {
            setLoading(true);
            const response = await axios.get(BASE_URL+'/chats/myChats', { withCredentials: true });
            const rooms = response.data.chats || [];
            const formattedChats = rooms.map(room => ({
                _id: room._id,
                name: room.name,
                isGroup: room.isGroupChat,
                participantCount: room.members?.length || 0,
                description: room.description || '',
                photoUrl: room.photoUrl,
                members: room.members || [],
                lastMessage: '',
                lastMessageTime: room.updatedAt,
                unreadCount: 0,
                createdAt: room.createdAt,
                isBlocked: room.isBlocked ?? false
            }));
            setChats(formattedChats);
        } catch (error) {
            console.error('Error fetching chats:', error);
            setChats([]);
        } finally {
            setLoading(false);
        }
    };

    const handleChatClick = (chat) => {
        navigate(`/chat/${chat._id}`, { state: { chat } });
    };

    const handleChatCreated = (newChat) => {
        console.log('New private chat created:', newChat);
        fetchChats(); // Refresh the list
        navigate(`/chat/${newChat._id}`, { state: { chat: newChat } });
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const filteredChats = chats.filter(chat =>
        chat.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-16">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
                        <button
                            onClick={() => setIsSuggestionsModalOpen(true)}
                            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#003366] to-[#2C7A7B] text-white rounded-lg hover:from-[#002244] hover:to-[#1A5F5F] transition-all duration-200 shadow-sm"
                        >
                            <UserSearch className="w-4 h-4" />
                            <span className="text-sm font-medium">Discover</span>
                        </button>
                    </div>

                    {/* Search Bar */}
                    <input
                        type="text"
                        placeholder="Search chats..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C7A7B] focus:border-transparent"
                    />
                </div>
            </div>

            {/* Chats List */}
            <div className="max-w-4xl mx-auto px-4 py-4">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003366]"></div>
                    </div>
                ) : filteredChats.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-[#E6F2F5] to-[#FFE5DC] rounded-full flex items-center justify-center mb-6">
                            <MessageCircle className="w-10 h-10 text-[#003366]" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            {searchQuery ? 'No chats found' : 'No chats yet'}
                        </h2>
                        <p className="text-gray-600 mb-6 max-w-sm">
                            {searchQuery
                                ? 'Try searching with a different name'
                                : 'Discover new people and start conversations'}
                        </p>
                        {!searchQuery && (
                            <button
                                onClick={() => setIsSuggestionsModalOpen(true)}
                                className="px-6 py-3 bg-gradient-to-r from-[#003366] to-[#2C7A7B] text-white rounded-lg hover:from-[#002244] hover:to-[#1A5F5F] transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                            >
                                Discover People
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filteredChats.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => handleChatClick(chat)}
                                className="bg-white rounded-lg p-4 cursor-pointer hover:shadow-md transition-all duration-200 border border-gray-100"
                            >
                                <div className="flex items-center space-x-3">
                                    {/* Avatar */}
                                    {chat.photoUrl ? (
                                        <img
                                            src={chat.photoUrl}
                                            alt={chat.name}
                                            className="w-14 h-14 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#003366] to-[#2C7A7B] flex items-center justify-center">
                                            <span className="text-white font-semibold text-lg">
                                                {chat.name?.charAt(0).toUpperCase() || 'C'}
                                            </span>
                                        </div>
                                    )}

                                    {/* Chat Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="text-base font-semibold text-gray-900 truncate">
                                                {chat.name || 'Unknown'}
                                            </h3>
                                            {chat.lastMessageTime && (
                                                <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                                                    {formatTime(chat.lastMessageTime)}
                                                </span>
                                            )}
                                        </div>
                                        {(chat.description || chat.lastMessage) && (
                                            <p className="text-sm text-gray-600 truncate">
                                                {chat.description || chat.lastMessage}
                                            </p>
                                        )}
                                    </div>

                                    {/* Unread Badge */}
                                    {chat.unreadCount > 0 && (
                                        <div className="bg-[#FF6B35] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                                            {chat.unreadCount}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* User Suggestions Modal */}
            <UserSuggestionsModal
                isOpen={isSuggestionsModalOpen}
                onClose={() => setIsSuggestionsModalOpen(false)}
                onChatCreated={handleChatCreated}
            />



            {/* Add this below the "Discover People" button */}
<div className="mt-8 text-center">
  <p className="text-sm text-gray-500">
    Crafted with{' '}
    <span className="inline-block animate-pulse text-red-500">♥</span>
    {' '}by{' '}
    <a 
      href="https://x.com/pratyu_sh_arma"
      target="_blank"
      rel="noopener noreferrer"
      className="text-cyan-500 hover:text-cyan-400 font-medium transition-colors duration-200 relative group"
    >
      Pratyush
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
    </a>
  </p>
</div>
        </div>
    );
};

export default Home;
