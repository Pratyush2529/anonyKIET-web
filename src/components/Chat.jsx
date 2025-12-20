import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import { BASE_URL } from "@/utils/constants";
import { getSocket } from "@/utils/socket";
import ChatOptionsMenu from "./ChatOptionsMenu";
// import { addUser } from "@/utils/userSlice";

const Chat = () => {
  const { chatId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socket = getSocket();

  const [chat, setChat] = useState(location.state?.chat ?? null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // console.log("chat isBlocked:", chat?.isBlocked);

  /* ---------------- BLOCK / UNBLOCK (COMMENTED) ---------------- */

  // const isBlocked = chat?.isBlocked;

  const handleDeleteChat = async () => {
    try {
      await axios.delete(`${BASE_URL}/chat/${chatId}`, { withCredentials: true });
      navigate("/");
    } catch (err) {
      console.log("Failed to delete chat:", err);
    }
  };
  /*
  const handleBlockUser = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/user/block`,
        { username: chat?.name },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      setChat((prev) => ({ ...prev, isBlocked: true }));
    } catch (err) {
      console.error("Failed to block user:", err);
    }
  };

  const handleUnblockUser = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/user/unblock`,
        { username: chat?.name },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      setChat((prev) => ({ ...prev, isBlocked: false }));
    } catch (err) {
      console.error("Failed to unblock user:", err);
    }
  };
  */

  /* -------------------------------------------------------------- */

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const currentUserId = useSelector((store) => store.user?._id);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const groupMessagesByDate = (msgs) =>
    msgs.reduce((acc, msg) => {
      const dateKey = formatDate(msg.createdAt);
      acc[dateKey] = acc[dateKey] || [];
      acc[dateKey].push(msg);
      return acc;
    }, {});

  /* ---------------- socket connection ---------------- */

  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    if (socket.connected) {
      setIsConnected(true);
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [socket]);

  /* ---------------- fetch chat ---------------- */

  useEffect(() => {
    if (chat || !chatId) return;

    const fetchChat = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/chats/myChats`, {
          withCredentials: true,
        });

        const found = data.chats?.find((c) => c._id === chatId);
        if (found) setChat(found);
      } catch (err) {
        console.error("Failed to fetch chat", err);
      }
    };

    fetchChat();
  }, [chat, chatId]);

  /* ---------------- fetch messages ---------------- */

  useEffect(() => {
    if (!chatId) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${BASE_URL}/messages/${chatId}`, {
          withCredentials: true,
        });
        setMessages(data.messages || []);
      } catch (err) {
        console.error("Failed to fetch messages", err);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    return () => setMessages([]);
  }, [chatId]);

  /* ---------------- join / leave room ---------------- */

  useEffect(() => {
    if (!chatId || !isConnected) return;

    socket.emit("joinChat", { chatId });

    return () => {
      socket.emit("leaveChat", { chatId });
    };
  }, [chatId, isConnected, socket]);

  /* ---------------- receive messages ---------------- */

  useEffect(() => {
    if (!chatId) return;

    const handleNewMessage = (msg) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /* ---------------- auto-focus input when connected ---------------- */

  useEffect(() => {
    if (isConnected && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isConnected]);

  /* ---------------- send message ---------------- */

  const handleSendMessage = (e) => {
    e.preventDefault();

    // if (isBlocked) return;
    if (!newMessage.trim() || !socket.connected) return;

    setSending(true);

    socket.emit("sendMessage", { chatId, content: newMessage.trim() }, () => setSending(false));

    setNewMessage("");
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-4 py-4 sticky top-16 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div className="flex items-center gap-3">
              <div className="relative">
                {chat?.photoUrl?.url ? (
  <img
    src={chat.photoUrl.url}
    alt={chat?.name}
    className="w-11 h-11 rounded-full object-cover shadow-md"
  />
) : (
  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center text-white font-semibold text-lg shadow-md">
    {chat?.name?.charAt(0)?.toUpperCase() || "?"}
  </div>
)}
                <div
                  className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${
                    isConnected ? "bg-emerald-500" : "bg-gray-400"
                  }`}
                />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 text-lg">{chat?.name || "Chat"}</h2>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isConnected ? "bg-emerald-500" : "bg-gray-400"
                    }`}
                  />
                  {isConnected ? "Active now" : "Connecting..."}
                </p>
              </div>
            </div>
          </div>

          <ChatOptionsMenu
            onDelete={handleDeleteChat}
            // onBlock={handleBlockUser}
            // onUnblock={handleUnblockUser}
          />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="w-10 h-10 animate-spin mx-auto text-teal-600 mb-3" />
                <p className="text-sm text-gray-500">Loading messages...</p>
              </div>
            </div>
          ) : (
            Object.entries(messageGroups).map(([date, msgs]) => (
              <div key={date} className="mb-6">
                <div className="flex items-center justify-center my-6">
                  <div className="bg-white/70 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-medium text-gray-600 shadow-sm border border-gray-200/50">
                    {date}
                  </div>
                </div>
                {msgs.map((msg) => {
                  const isOwn = msg.sender?._id === currentUserId;
                  return (
                    <div
                      key={msg._id}
                      className={`flex mb-3 ${
                        isOwn ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`px-4 py-2.5 rounded-2xl max-w-[75%] shadow-sm transition-all duration-200 hover:shadow-md ${
                          isOwn
                            ? "bg-gradient-to-br from-teal-500 to-cyan-600 text-white rounded-br-md"
                            : "bg-white border border-gray-200/50 text-gray-800 rounded-bl-md"
                        }`}
                      >
                        <p className="text-[15px] leading-relaxed break-words">{msg.content}</p>
                        <p
                          className={`text-[11px] mt-1.5 ${
                            isOwn ? "text-teal-100" : "text-gray-500"
                          }`}
                        >
                          {formatTime(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-200/50 bg-white/80 backdrop-blur-lg px-4 py-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex gap-3">
          <input
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            className="flex-1 border border-gray-300 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
            placeholder="Type a message..."
            // disabled={!isConnected || isBlocked}
            disabled={!isConnected}
          />

          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending || !isConnected}
            className="px-5 py-3 rounded-full text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center min-w-[48px]"
          >
            {sending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;