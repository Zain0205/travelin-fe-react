import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { ArrowLeft, Send, AlertCircle, Wifi, WifiOff } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Socket connection setup
let socket = null;

const initializeSocket = (token) => {
  if (!socket) {
    socket = io("http://localhost:3000/chat", {
      auth: {
        token,
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }
  return socket;
};

function ChatPages() {
  const { receiverId } = useParams();
  const [messages, setMessages] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [showChatList, setShowChatList] = useState(!receiverId);

  // Get user data from cookies with validation
  const token = Cookies.get("accessToken");
  const role = Cookies.get("role");
  const userIdCookie = Cookies.get("userId");
  const userId = userIdCookie ? parseInt(userIdCookie) : null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const showError = (errorMessage) => {
    setError(errorMessage);
    setTimeout(() => setError(null), 5000); // Clear error after 5 seconds
  };

  const validateUserData = () => {
    if (!token) {
      showError("Authentication token not found. Please login again.");
      return false;
    }

    if (!userId || isNaN(userId)) {
      showError("Invalid user ID. Please login again.");
      return false;
    }

    return true;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!validateUserData()) {
      return;
    }

    const socketInstance = initializeSocket(token);

    // Connection event listeners
    socketInstance.on("connect", () => {
      console.log("Connected to chat server");
      setIsConnected(true);
      setError(null);

      // Get chat list on connect
      socketInstance.emit("getChatList", { userId });

      // Join chat room if receiverId is present
      if (receiverId) {
        const receiverIdNum = parseInt(receiverId);
        if (!isNaN(receiverIdNum)) {
          socketInstance.emit("joinChatRoom", {
            userId,
            partnerId: receiverIdNum,
          });

          // Get chat history
          socketInstance.emit("getChatHistory", {
            userId,
            partnerId: receiverIdNum,
            page: 1,
            limit: 50,
          });
        }
      }
    });

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from chat server");
      setIsConnected(false);
      showError("Disconnected from chat server. Trying to reconnect...");
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setIsConnected(false);
      showError("Failed to connect to chat server. Please check your connection.");
    });

    socketInstance.on("reconnect", () => {
      console.log("Reconnected to chat server");
      setIsConnected(true);
      setError(null);
    });

    // Message event listeners
    socketInstance.on("newMessage", (messageData) => {
      console.log("New message received:", messageData);
      setMessages((prev) => [...prev, messageData]);

      // Mark message as read if it's from the current chat
      if (messageData.senderId === parseInt(receiverId)) {
        socketInstance.emit("markAsRead", {
          userId,
          senderId: messageData.senderId,
        });
      }
    });

    socketInstance.on("messageReceived", (messageData) => {
      console.log("Message received notification:", messageData);
      // Update chat list to show new message
      socketInstance.emit("getChatList", { userId });
    });

    socketInstance.on("chatHistory", (history) => {
      console.log("Chat history received:", history);
      setMessages(history.data || []);
      setLoading(false);
    });

    socketInstance.on("chatList", (chatListData) => {
      console.log("Chat list received:", chatListData);
      setChatList(chatListData);
    });

    socketInstance.on("userTyping", ({ userId: typingUserId, isTyping: typing }) => {
      if (typingUserId === parseInt(receiverId)) {
        setPartnerTyping(typing);
      }
    });

    socketInstance.on("messageSent", (response) => {
      console.log("Message sent confirmation:", response);
      if (response.success) {
        setMessage("");
        setSendingMessage(false);
        setError(null);
      } else {
        setSendingMessage(false);
        showError("Failed to send message. Please try again.");
      }
    });

    socketInstance.on("messageError", (error) => {
      console.error("Message error:", error);
      setSendingMessage(false);
      showError(error.error || "Failed to send message. Please try again.");
    });

    socketInstance.on("messagesRead", (data) => {
      console.log("Messages read:", data);
      // Update message read status in UI if needed
    });

    // Error event listeners
    socketInstance.on("chatHistoryError", (error) => {
      console.error("Chat history error:", error);
      showError("Failed to load chat history.");
      setLoading(false);
    });

    socketInstance.on("chatListError", (error) => {
      console.error("Chat list error:", error);
      showError("Failed to load chat list.");
    });

    socketInstance.on("markAsReadError", (error) => {
      console.error("Mark as read error:", error);
    });

    return () => {
      if (receiverId) {
        const receiverIdNum = parseInt(receiverId);
        if (!isNaN(receiverIdNum)) {
          socketInstance.emit("leaveChatRoom", {
            userId,
            partnerId: receiverIdNum,
          });
        }
      }

      // Clean up all listeners
      socketInstance.off("connect");
      socketInstance.off("disconnect");
      socketInstance.off("connect_error");
      socketInstance.off("reconnect");
      socketInstance.off("newMessage");
      socketInstance.off("messageReceived");
      socketInstance.off("chatHistory");
      socketInstance.off("chatList");
      socketInstance.off("userTyping");
      socketInstance.off("messageSent");
      socketInstance.off("messageError");
      socketInstance.off("messagesRead");
      socketInstance.off("chatHistoryError");
      socketInstance.off("chatListError");
      socketInstance.off("markAsReadError");
    };
  }, [receiverId, userId, token]);

  const sendMessage = async () => {
    // Validate input
    if (!message.trim()) {
      showError("Message cannot be empty");
      return;
    }

    if (!receiverId) {
      showError("No receiver selected");
      return;
    }

    if (!socket || !socket.connected) {
      showError("Not connected to chat server");
      return;
    }

    if (!userId || isNaN(userId)) {
      showError("Invalid user session. Please login again.");
      return;
    }

    const receiverIdNum = parseInt(receiverId);
    if (!receiverIdNum || isNaN(receiverIdNum)) {
      showError("Invalid receiver ID");
      return;
    }

    const messageData = {
      senderId: userId,
      message: {
        receiverId: receiverIdNum,
        message: message.trim(),
      },
    };

    try {
      console.log("Sending message:", messageData);
      setSendingMessage(true);
      socket.emit("sendMessage", messageData);

      // Stop typing indicator
      if (isTyping) {
        setIsTyping(false);
        socket.emit("typing", {
          userId,
          partnerId: receiverIdNum,
          isTyping: false,
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setSendingMessage(false);
      showError("Failed to send message. Please try again.");
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);

    if (!receiverId || !socket || !socket.connected) return;

    const receiverIdNum = parseInt(receiverId);
    if (isNaN(receiverIdNum)) return;

    if (!isTyping && e.target.value.trim()) {
      setIsTyping(true);
      socket.emit("typing", {
        userId,
        partnerId: receiverIdNum,
        isTyping: true,
      });
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        socket.emit("typing", {
          userId,
          partnerId: receiverIdNum,
          isTyping: false,
        });
      }
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const selectChat = (chatUserId) => {
    setSelectedChat(chatUserId);
    setShowChatList(false);
    setError(null);
    setMessages([]);
    setLoading(true);

    // Navigate to chat
    const newPath = role === "agent" ? `/agent/chat/${chatUserId}` : `/chat/${chatUserId}`;
    window.location.href = newPath;
  };

  const retryConnection = () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }

    if (validateUserData()) {
      const socketInstance = initializeSocket(token);
      socketInstance.connect();
    }
  };

  const name = chatList.find((chat) => {
    return chat.userId == receiverId;
  });
  console.log("Name", name);

  return (
    <section className="min-h-screen flex justify-between relative">
      {/* Error Toast */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 max-w-sm">
          <AlertCircle size={20} />
          <span className="text-sm">{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-2 text-white hover:text-gray-200"
          >
            ×
          </button>
        </div>
      )}

      {/* Chat List Sidebar */}
      <div className={`${showChatList && !receiverId ? "block" : "hidden"} border-r w-full xl:w-1/3 lg:w-2/3 h-screen overflow-scroll border-slate-300 pb-20 lg:flex lg:flex-col lg:justify-between z-100`}>
        <div className="mt-2">
          <div className="flex items-center justify-between px-5 mb-2">
            <h1 className="font-roboto text-2xl">Chat</h1>
            <div className="flex items-center gap-2">
              {isConnected ? <Wifi className="w-5 h-5 text-green-500" /> : <WifiOff className="w-5 h-5 text-red-500" />}
              <div className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
            </div>
          </div>

          {!isConnected && (
            <div className="px-5 py-2 mb-2">
              <button
                onClick={retryConnection}
                className="w-full bg-blue-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-600"
              >
                Retry Connection
              </button>
            </div>
          )}

          {chatList.map((chat) => {
            return (
              <ChatListItem
                key={chat.id}
                chat={chat}
                onClick={() => selectChat(chat.userId)}
                role={role}
              />
            );
          })}

          {chatList.length === 0 && <div className="px-5 py-4 text-gray-500 text-center">{isConnected ? "No chats available" : "Loading chats..."}</div>}
        </div>
      </div>

      {/* Chat Content */}
      <div className={`h-screen w-full lg:w-full overflow-hidden flex flex-col ${!receiverId ? "hidden lg:flex" : "flex"}`}>
        {receiverId ? (
          <>
            {/* Header Chat */}
            <div className={`sticky ${receiverId === "inbox" ? "hidden" : ""} gap-x-3 top-0 z-10 border-b py-4 px-5 flex items-center bg-white dark:bg-slate-800/30`}>
              <button
                onClick={() => setShowChatList(true)}
                className="lg:hidden"
              >
                <ArrowLeft className="text-gray-600 text-2xl cursor-pointer" />
              </button>
              <Link
                to="/chat/inbox"
                className="hidden lg:block"
              >
                <ArrowLeft className="text-gray-600 text-2xl cursor-pointer" />
              </Link>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="font-semibold">{name?.userName}</h1>
                  {partnerTyping && <p className="text-xs text-gray-500">typing...</p>}
                  <div className="flex items-center gap-1 mt-1">
                    {isConnected ? <Wifi className="w-3 h-3 text-green-500" /> : <WifiOff className="w-3 h-3 text-red-500" />}
                    <span className="text-xs text-gray-500">{isConnected ? "Online" : "Offline"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 py-5 px-5 overflow-y-auto space-y-4">
              {loading && <div className="text-center text-gray-500 py-8">Loading messages...</div>}

              {!loading &&
                messages.map((msg) => {
                  return (
                    <BubbleChat
                      key={msg.id}
                      message={msg}
                      isOwn={msg.senderId === userId}
                    />
                  );
                })}

              {!loading && messages.length === 0 && <div className="text-center text-gray-500 py-8">No messages yet. Start the conversation!</div>}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Chat */}
            <div className="sticky dark:bg-slate-900/30 bottom-0 z-50 px-5 py-3 flex items-center gap-3 bg-white border-t">
              <textarea
                value={message}
                onChange={handleTyping}
                onKeyPress={handleKeyPress}
                className="flex-1 px-4 py-2 text-gray-800 bg-gray-100 border border-gray-300 rounded-full focus:border-primary focus:outline-none focus:ring-1 focus:primary resize-none dark:bg-slate-300"
                placeholder="Tulis pesan..."
                rows="1"
                style={{ maxHeight: "100px" }}
                disabled={!isConnected || sendingMessage}
              />
              <button
                onClick={sendMessage}
                disabled={!message.trim() || !isConnected || sendingMessage}
                className="p-2 text-white bg-primary rounded-full disabled:opacity-50 disabled:cursor-not-allowed relative"
              >
                {sendingMessage ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Send size={20} />}
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Select a chat to start messaging</h2>
              <p className="text-gray-500">Choose a conversation from the sidebar</p>
              {!isConnected && (
                <div className="mt-4">
                  <button
                    onClick={retryConnection}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Connect to Chat
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ChatListItem({ chat, onClick, role }) {
  const formatTime = (timestamp) => {
    if (!timestamp) return "";

    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return "";

      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch (error) {
      console.error("Error formatting time:", error);
      return "";
    }
  };

  return (
    <div
      onClick={onClick}
      className="py-5 cursor-pointer border-b border-slate-300 w-full flex items-center px-4 hover:bg-gray-50 transition-colors"
    >
      <div className="w-[15%]">
        <img
          src={chat.partnerImage || "https://github.com/shadcn.png"}
          className="w-10 h-10 rounded-full object-cover"
          alt="Avatar"
          onError={(e) => {
            e.target.src = "https://github.com/shadcn.png";
          }}
        />
      </div>
      <div className="w-[64%]">
        <h1 className="text-base font-semibold truncate">{chat.userName}</h1>
        <p className="text-xs truncate mt-1 text-gray-600">{chat.lastMessage || "No messages yet"}</p>
      </div>
      <div className="w-[20%] text-end flex flex-col items-center">
        {chat.lastMessageTime && <p className="text-[10px] text-gray-500">{formatTime(chat.lastMessageTime)}</p>}
        {chat.unreadCount > 0 && <div className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mt-1">{chat.unreadCount > 99 ? "99+" : chat.unreadCount}</div>}
      </div>
    </div>
  );
}

function BubbleChat({ message, isOwn }) {
  const formatTime = (timestamp) => {
    if (!timestamp) return "";

    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return "";

      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch (error) {
      console.error("Error formatting time:", error);
      return "";
    }
  };

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}>
      {!isOwn && (
        <div className="text-sm text-gray-500 mr-2">
          <img
            src={message.sender?.image || "https://github.com/shadcn.png"}
            className="h-10 w-10 rounded-full object-cover"
            alt="Avatar"
            onError={(e) => {
              e.target.src = "https://github.com/shadcn.png";
            }}
          />
        </div>
      )}
      <div className={`max-w-xs lg:max-w-md break-words px-4 py-2 rounded-xl shadow-lg ${isOwn ? "bg-blue-500 text-white rounded-tr-none" : "bg-gray-200 text-gray-800 rounded-tl-none"}`}>
        <p className="text-sm whitespace-pre-wrap break-words">{message.message}</p>
        <div className="flex items-end justify-end mt-1">
          <p className={`text-xs ${isOwn ? "text-gray-200" : "text-gray-500"}`}>{formatTime(message.createdAt)}</p>
        </div>
      </div>
      {isOwn && (
        <div className="text-sm text-gray-500 ml-2">
          <img
            src={message.sender?.image || "https://github.com/shadcn.png"}
            className="h-10 w-10 rounded-full object-cover"
            alt="Avatar"
            onError={(e) => {
              e.target.src = "https://github.com/shadcn.png";
            }}
          />
        </div>
      )}
    </div>
  );
}

export default ChatPages;
