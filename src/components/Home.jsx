import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import ChatList from '../components/ChatList';
import CreateGroupModal from '../components/CreateGroupModal';
import UserSuggestionsModal from '../components/UserSuggestionsModal';
import ChatWindow from '../components/ChatWindow';

/**
 * HomePage component - Main chat interface
 * Displays chat list sidebar and main chat area
 * Handles chat selection and group creation
 */
const Home = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
    const [isSuggestionsModalOpen, setIsSuggestionsModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleChatSelect = (chat) => {
        setSelectedChat(chat);
    };

    const handleCreateGroup = () => {
        setIsCreateGroupModalOpen(true);
    };

    const handleGroupCreated = (newGroup) => {
        console.log('New group created:', newGroup);
        // Refresh chat list by changing the key
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="flex h-[calc(100vh-4rem)] bg-gray-50">
            {/* Left Sidebar - Chat List */}
            <ChatList
                key={refreshKey}
                onChatSelect={handleChatSelect}
                onCreateGroup={handleCreateGroup}
                onDiscoverUsers={() => setIsSuggestionsModalOpen(true)}
            />

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {selectedChat ? (
                    // Chat selected - Show chat interface
                    <div className="flex-1 flex flex-col">
                        {/* Chat Header */}
                        <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
                            <div className="flex items-center space-x-3">
                                {selectedChat.photoUrl ? (
                                    <img
                                        src={selectedChat.photoUrl}
                                        alt={selectedChat.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 bg-gradient-to-br from-[#003366] to-[#2C7A7B] rounded-full flex items-center justify-center">
                                        <span className="text-white font-semibold text-sm">
                                            {selectedChat.name?.charAt(0).toUpperCase() || 'C'}
                                        </span>
                                    </div>
                                )}
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        {selectedChat.name || 'Chat'}
                                    </h2>
                                    {selectedChat.isGroup && selectedChat.participantCount && (
                                        <p className="text-sm text-gray-500">
                                            {selectedChat.participantCount} members
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Chat Window Component */}
                        <ChatWindow chat={selectedChat} />
                    </div>
                ) : (
                    // No chat selected - Show placeholder
                    <div className="flex-1 flex items-center justify-center bg-white">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#E6F2F5] to-[#FFE5DC] rounded-full mb-6">
                                <MessageSquare className="w-12 h-12 text-[#003366]" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                                Welcome to anonyKIET
                            </h2>
                            <p className="text-gray-600 mb-6 max-w-md">
                                Select a room from the sidebar to start messaging, or create a new room to get started
                            </p>
                            <button
                                onClick={handleCreateGroup}
                                className="px-6 py-3 bg-gradient-to-r from-[#003366] to-[#2C7A7B] text-white rounded-lg hover:from-[#002244] hover:to-[#1A5F5F] transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                            >
                                Create Your First Room
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Group Modal */}
            <CreateGroupModal
                isOpen={isCreateGroupModalOpen}
                onClose={() => setIsCreateGroupModalOpen(false)}
                onGroupCreated={handleGroupCreated}
            />

            {/* User Suggestions Modal */}
            <UserSuggestionsModal
                isOpen={isSuggestionsModalOpen}
                onClose={() => setIsSuggestionsModalOpen(false)}
            />
        </div>
    );
};

export default Home;
