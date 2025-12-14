import { useState, useEffect } from 'react';
import { X, Users, RefreshCw, MessageCircle } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '@/utils/constants';
// import api from '../utils/api';

/**
 * UserSuggestionsModal component for discovering random users
 * Fetches 4 random user suggestions from /users/suggestions endpoint
 */
const UserSuggestionsModal = ({ isOpen, onClose }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchSuggestions = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await axios.get(BASE_URL+'/users/suggestions', { withCredentials: true });
            setUsers(response.data.users || []);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setError('Failed to load suggestions. Please try again.');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch suggestions when modal opens
    useEffect(() => {
        if (isOpen && users.length === 0) {
            fetchSuggestions();
        }
    }, [isOpen]);

    const handleStartChat = (user) => {
        // TODO: Implement start chat functionality
        console.log('Start chat with:', user);
        // You can navigate to a chat page or open a chat interface
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Discover Users</h2>
                            <p className="text-sm text-gray-500">Find people to connect with</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    {/* Refresh Button */}
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-sm text-gray-600">
                            {users.length > 0 ? `Showing ${users.length} suggestions` : 'Click refresh to see suggestions'}
                        </p>
                        <button
                            onClick={fetchSuggestions}
                            disabled={loading}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            <span>{loading ? 'Loading...' : 'Refresh'}</span>
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && users.length === 0 && (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">Finding users...</p>
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && users.length === 0 && !error && (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                            <Users className="w-16 h-16 mb-4 text-gray-400" />
                            <p className="text-lg font-medium">No suggestions available</p>
                            <p className="text-sm mt-2">Click refresh to load suggestions</p>
                        </div>
                    )}

                    {/* User Cards Grid */}
                    {!loading && users.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {users.map((user) => (
                                <div
                                    key={user._id}
                                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                                >
                                    {/* User Header */}
                                    <div className="flex items-start space-x-3 mb-3">
                                        <img
                                            src={user.photoUrl}
                                            alt={user.username}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-base font-semibold text-gray-900 truncate">
                                                {user.username}
                                            </h3>
                                            <p className="text-xs text-gray-500">
                                                {user.rooms?.length || 0} rooms joined
                                            </p>
                                        </div>
                                    </div>

                                    {/* About */}
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                        {user.about || 'No bio available'}
                                    </p>

                                    {/* Skills */}
                                    {user.skills && user.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {user.skills.slice(0, 3).map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                            {user.skills.length > 3 && (
                                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                                    +{user.skills.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Action Button */}
                                    <button
                                        onClick={() => handleStartChat(user)}
                                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-white rounded-lg hover:from-[#FF5722] hover:to-[#FF6B35] transition-all duration-200 text-sm font-medium"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        <span>Start Chat</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserSuggestionsModal;
