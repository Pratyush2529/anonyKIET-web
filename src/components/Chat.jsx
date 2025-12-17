import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2, MoreVertical, Send } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";

import { BASE_URL } from "@/utils/constants";
import { getSocket } from "@/utils/socket";

/**
 * Chat - Full page chat view
 * Socket lifecycle is APP-LEVEL (singleton)
 * This component only:
 * - joins/leaves rooms
 * - listens to events
 * - updates UI state
 */

const Chat = () => {
  const { chatId } = useParams();
  console.log("chat is is:"+chatId);
  const location = useLocation();
  const navigate = useNavigate();

  const socket = getSocket();

  const [chat, setChat] = useState(location.state?.chat ?? null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isConnected, setIsConnected] = useState(socket.connected);

  const messagesEndRef = useRef(null);

  const currentUserId = useSelector((store) => store.user?._id);

  /* ----------------------------- helpers ----------------------------- */

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

  const groupMessagesByDate = (msgs) => {
    return msgs.reduce((acc, msg) => {
      const dateKey = formatDate(msg.createdAt);
      acc[dateKey] = acc[dateKey] || [];
      acc[dateKey].push(msg);
      return acc;
    }, {});
  };

  /* ------------------------ socket connection ------------------------- */

  useEffect(() => {
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  /* --------------------------- fetch chat ----------------------------- */

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

  /* ------------------------- fetch messages ---------------------------- */

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

  /* ----------------------- room join / leave --------------------------- */

  useEffect(() => {
    if (!chatId) return;

    const joinChat = () => {
      socket.emit("joinChat", { chatId });
    };

    if (socket.connected) joinChat();
    socket.on("connect", joinChat);

    return () => {
      socket.emit("leaveChat", { chatId });
      socket.off("connect", joinChat);
    };
  }, [chatId]);

  /* ---------------------- receive new messages ------------------------- */

  useEffect(() => {
    if (!chatId) return;

    const handleNewMessage = (msg) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [chatId]);

  /* --------------------------- auto scroll ----------------------------- */

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /* -------------------------- send message ----------------------------- */

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!newMessage.trim() || !socket.connected) return;

    setSending(true);

    socket.emit(
      "sendMessage",
      { chatId, content: newMessage.trim() },
      () => setSending(false)
    );

    setNewMessage("");
  };

  const messageGroups = groupMessagesByDate(messages);

  /* ------------------------------- UI -------------------------------- */

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 sticky top-16 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")}>
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h2 className="font-semibold">{chat?.name || "Chat"}</h2>
              <p className="text-xs text-gray-500">
                {isConnected ? "Online" : "Connecting..."}
              </p>
            </div>
          </div>
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <Loader2 className="w-8 h-8 animate-spin mx-auto" />
          ) : (
            Object.entries(messageGroups).map(([date, msgs]) => (
              <div key={date}>
                <div className="text-center text-xs my-4">{date}</div>
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
                        className={`px-4 py-2 rounded-xl max-w-[75%] ${
                          isOwn
                            ? "bg-[#2C7A7B] text-white"
                            : "bg-white border"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs opacity-70 mt-1">
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
      <form
        onSubmit={handleSendMessage}
        className="border-t px-4 py-3 flex gap-2"
      >
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border rounded-full px-4 py-2"
          placeholder="Type a message..."
          disabled={!isConnected}
        />
        <button
          disabled={!newMessage.trim() || sending}
          className="px-4 rounded-full bg-orange-500 text-white"
        >
          {sending ? <Loader2 className="animate-spin" /> : <Send />}
        </button>
      </form>
    </div>
  );
};

export default Chat;
