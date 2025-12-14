import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Send, Loader2 } from 'lucide-react';
import axios from 'axios';
// import { setMessages, addMessage } from '../store/slices/chatSlice';
// import api from '../utils/api';

/**
 * ChatWindow component for real-time messaging
 * Displays messages and handles sending new messages via Socket.IO
 * Uses Redux for state management
 */
const ChatWindow = ({ chat }) => {
    const dispatch = useDispatch();
    const socket = useSelector((state) => state.socket.socket);
    const isConnected = useSelector((state) => state.socket.isConnected);
    const messages = useSelector((state) => state.chat.messages[chat?.id] || []);

    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);
    // const currentUser = localStorage.getItem('userEmail');
    const currentUser = useSelector(state=>state.user.emailId);

    // Scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Fetch message history when chat is selected
    useEffect(() => {
        if (!chat) return;

        const fetchMessages = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/messages/${chat.id}`, { withCredentials: true });
                dispatch(setMessages({ chatId: chat.id, messages: response.data.messages || [] }));
            } catch (error) {
                console.error('Error fetching messages:', error);
                dispatch(setMessages({ chatId: chat.id, messages: [] }));
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [chat, dispatch]);

    // Join chat room via socket when chat is selected
    useEffect(() => {
        if (!socket || !chat) return;

        socket.emit('joinChat', { chatId: chat.id });
        console.log('Joined chat:', chat.id);

        // Listen for new messages
        const handleNewMessage = (message) => {
            console.log('New message received:', message);
            dispatch(addMessage({ chatId: chat.id, message }));
        };

        socket.on('newMessage', handleNewMessage);

        // Cleanup
        return () => {
            socket.off('newMessage', handleNewMessage);
        };
    }, [socket, chat, dispatch]);

    // Auto-scroll when new messages arrive
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!newMessage.trim() || !socket || !chat) return;

        try {
            setSending(true);

            // Send message via socket
            socket.emit('sendMessage', {
                chatId: chat.id,
                content: newMessage.trim(),
            });

            // Clear input
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    };

    // Group messages by date
    const groupMessagesByDate = (messages) => {
        const groups = {};
        messages.forEach((msg) => {
            const date = formatDate(msg.createdAt || msg.timestamp);
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(msg);
        });
        return groups;
    };

    if (!chat) {
        return null;
    }

    const messageGroups = groupMessagesByDate(messages);

    return (
        <div className="flex-1 flex flex-col h-full">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    <>
                        {Object.entries(messageGroups).map(([date, msgs]) => (
                            <div key={date}>
                                {/* Date Separator */}
                                <div className="flex items-center justify-center my-4">
                                    <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                                        {date}
                                    </div>
                                </div>

                                {/* Messages for this date */}
                                {msgs.map((message, index) => {
                                    const isOwnMessage = message.sender?.emailId === currentUser || message.senderEmail === currentUser;

                                    return (
                                        <div
                                            key={message._id || index}
                                            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-3`}
                                        >
                                            <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                                                {/* Sender name (for group chats, not own messages) */}
                                                {!isOwnMessage && chat.isGroup && (
                                                    <p className="text-xs text-gray-500 mb-1 ml-2">
                                                        {message.sender?.username || message.senderName || 'Anonymous'}
                                                    </p>
                                                )}

                                                {/* Message bubble */}
                                                <div
                                                    className={`rounded-lg px-4 py-2 ${isOwnMessage
                                                            ? 'bg-gradient-to-r from-[#003366] to-[#2C7A7B] text-white'
                                                            : 'bg-white text-gray-900 border border-gray-200'
                                                        }`}
                                                >
                                                    <p className="text-sm break-words">{message.content}</p>
                                                    <p
                                                        className={`text-xs mt-1 ${isOwnMessage ? 'text-gray-200' : 'text-gray-500'
                                                            }`}
                                                    >
                                                        {formatTime(message.createdAt || message.timestamp)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 bg-white p-4">
                {!isConnected && (
                    <div className="mb-2 text-center text-sm text-yellow-600">
                        Reconnecting...
                    </div>
                )}
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C7A7B] focus:border-transparent"
                        disabled={sending || !isConnected}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || sending || !isConnected}
                        className="px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-white rounded-lg hover:from-[#FF5722] hover:to-[#FF6B35] transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                        {sending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatWindow;
