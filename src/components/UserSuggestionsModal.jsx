import { useState, useEffect } from 'react';
import { X, Users, RefreshCw, MessageCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '@/utils/constants';

const UserSuggestionsModal = ({ isOpen, onClose, onChatCreated }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [creatingChatWith, setCreatingChatWith] = useState(null);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get(
        `${BASE_URL}/users/suggestions`,
        { withCredentials: true }
      );

      setUsers(response.data.users || []);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      setError('Failed to load suggestions. Please try again.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSuggestions();
    }
  }, [isOpen]);

  const handleStartChat = async (user) => {
    try {
      setCreatingChatWith(user._id);
      console.log(user._id);
      setError('');

      const response = await axios.get(
        `${BASE_URL}/chat/${user._id}`,
        { withCredentials: true }
      );

      const chatDoc = response.data; // backend returns chat directly

      const chat = {
        _id: chatDoc._id,
        name: user.username,
        isGroupChat: false,
        members: chatDoc.members || [],
        photoUrl: user.photoUrl,
        description: '',
        lastMessage: '',
        lastMessageTime: chatDoc.updatedAt,
        unreadCount: 0,
        createdAt: chatDoc.createdAt,
      };

      onChatCreated?.(chat);
      onClose();
    } catch (err) {
      console.error('Error creating private chat:', err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to start chat. Please try again.');
      }
    } finally {
      setCreatingChatWith(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Discover People
              </h2>
              <p className="text-sm text-gray-500">
                Start a conversation with someone new
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              {users.length
                ? `Showing ${users.length} suggestions`
                : 'Click refresh to see suggestions'}
            </p>

            <button
              onClick={fetchSuggestions}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          {!loading && users.length === 0 && !error && (
            <div className="flex flex-col items-center py-12 text-gray-500">
              <Users className="w-14 h-14 mb-3" />
              <p>No suggestions available</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {users.map((user) => (
              <div
                key={user._id}
                className="border rounded-lg p-4 hover:shadow"
              >
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={user.photoUrl}
                    alt={user.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{user.username}</h3>
                    <p className="text-xs text-gray-500">
                      anonyKIET member
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3">
                  {user.about || 'No bio available'}
                </p>

                <button
                  onClick={() => handleStartChat(user)}
                  disabled={creatingChatWith === user._id}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-white rounded-lg disabled:opacity-50"
                >
                  {creatingChatWith === user._id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSuggestionsModal;
