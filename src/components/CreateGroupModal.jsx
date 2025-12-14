import { useState } from 'react';
import { X, Users } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '@/utils/constants';
// import api from '../utils/api';

/**
 * CreateGroupModal component for creating new forums/rooms
 * Works like a forum - users can create rooms and others can join if they want
 * Only requires name and description
 */
const CreateGroupModal = ({ isOpen, onClose, onGroupCreated }) => {
    const [roomName, setRoomName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!roomName.trim()) {
            setError('Room name is required');
            return;
        }

        if (!description.trim()) {
            setError('Description is required');
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(BASE_URL+'/room/create', {
                name: roomName.trim(),
                description: description.trim(),
            }, { withCredentials: true });
            console.log(response);
            // Reset form
            setRoomName('');
            setDescription('');

            // Notify parent component
            if (onGroupCreated) {
                onGroupCreated(response.data);
            }

            onClose();
        } catch (error) {
            console.error('Error creating room:', error);
            setError(
                error.response?.data?.message ||
                'Failed to create room. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setRoomName('');
        setDescription('');
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-purple-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Create New Room</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Error message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Room Name Input */}
                    <div>
                        <label htmlFor="roomName" className="block text-sm font-medium text-gray-700 mb-2">
                            Room Name
                        </label>
                        <input
                            type="text"
                            id="roomName"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            placeholder="Enter room name (e.g., Tech Discussions)"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            disabled={loading}
                            required
                        />
                    </div>

                    {/* Description Input */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe what this room is about..."
                            rows="4"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                            disabled={loading}
                            required
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Help others understand what this room is for
                        </p>
                    </div>

                    {/* Info message */}
                    <div className="bg-blue-50 border border-blue-200 px-4 py-3 rounded-lg">
                        <p className="text-sm text-blue-700">
                            💡 Once created, anyone can discover and join this room
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Creating...
                                </span>
                            ) : (
                                'Create Room'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateGroupModal;
