import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Building, Search, MessageSquare } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';

const AgentMessages = () => {
  const { userInfo } = useAuth();
  const { socket } = useChat();
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef();

  const fetchInbox = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get('/api/messages/agent/inbox', config);
      setConversations(data);
    } catch (err) {
      console.error('Error fetching inbox:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInbox();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('receive_message', (message) => {
        if (selectedChat && 
            message.property === selectedChat._id.property && 
            (message.sender === selectedChat._id.buyer || message.receiver === selectedChat._id.buyer)) {
          setMessages(prev => [...prev, message]);
        }
        fetchInbox();
      });
    }
    return () => socket?.off('receive_message');
  }, [socket, selectedChat]);

  const selectChat = async (chat) => {
    setSelectedChat(chat);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get(`/api/messages/${chat._id.property}/${chat._id.buyer}`, config);
      setMessages(data);
      
      if (socket) {
        socket.emit('join_chat', { propertyId: chat._id.property, userId: chat._id.buyer });
      }
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    if (!userInfo?._id) {
      console.error('Chat Error: Current user ID is missing. Please re-login.');
      return;
    }

    const messageData = {
      sender: userInfo._id,
      receiver: selectedChat._id.buyer,
      property: selectedChat._id.property,
      content: newMessage,
      senderName: userInfo.name,
      room: `chat_${selectedChat._id.property}_${selectedChat._id.buyer}`
    };

    console.log('Sending Socket Message (Agent):', messageData);
    socket.emit('send_message', messageData);
    setNewMessage('');
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-white tracking-tight">Agent Inbox</h1>
        <p className="text-gray-400 mt-1">Real-time inquiries and negotiations</p>
      </header>

      <div className="flex flex-1 gap-6 min-h-0">
        {/* Inbox List */}
        <div className="w-1/3 glass rounded-[32px] border border-white/10 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Search conversations..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-champagne-gold/50"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-10 text-center text-gray-500">Loading...</div>
            ) : conversations.length === 0 ? (
              <div className="p-10 text-center text-gray-500">No messages yet.</div>
            ) : (
              conversations.map((chat, idx) => (
                <button
                  key={idx}
                  onClick={() => selectChat(chat)}
                  className={`w-full p-6 text-left border-b border-white/5 transition flex items-center gap-4 ${
                    selectedChat?._id.buyer === chat._id.buyer && selectedChat?._id.property === chat._id.property
                    ? 'bg-champagne-gold/10'
                    : 'hover:bg-white/5'
                  }`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                      <User className="text-gray-400" size={24} />
                    </div>
                    {chat.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-slate-dark">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-bold text-white truncate">{chat.buyerInfo.name}</p>
                      <p className="text-[10px] text-gray-500 uppercase font-bold">{new Date(chat.latestMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <p className="text-xs text-champagne-gold font-medium truncate flex items-center gap-1">
                      <Building size={12} /> {chat.propertyInfo.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-1">{chat.latestMessage.content}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 glass rounded-[32px] border border-white/10 overflow-hidden flex flex-col relative">
          <AnimatePresence mode='wait'>
            {selectedChat ? (
              <motion.div 
                key={selectedChat._id.buyer + selectedChat._id.property}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col h-full"
              >
                {/* Chat Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                      <User className="text-gray-400" size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white leading-tight">{selectedChat.buyerInfo.name}</h3>
                      <p className="text-xs text-gray-500">{selectedChat.propertyInfo.name}</p>
                    </div>
                  </div>
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((msg, idx) => (
                    <div 
                      key={idx}
                      className={`flex ${msg.sender === userInfo._id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] p-4 rounded-2xl text-sm ${
                        msg.sender === userInfo._id 
                        ? 'bg-champagne-gold text-slate-dark font-medium rounded-tr-none shadow-lg shadow-champagne-gold/20' 
                        : 'bg-white/5 border border-white/10 text-white rounded-tl-none'
                      }`}>
                        {msg.content}
                        <p className={`text-[10px] mt-1.5 opacity-60 ${msg.sender === userInfo._id ? 'text-slate-dark text-right' : 'text-gray-400 text-left'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={scrollRef} />
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSendMessage} className="p-6 border-t border-white/10 bg-white/[0.02]">
                  <div className="relative">
                    <input 
                      type="text" 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your response..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-16 text-white focus:outline-none focus:border-champagne-gold/40 transition"
                    />
                    <button 
                      type="submit"
                      className="absolute right-2 top-2 p-3 bg-champagne-gold rounded-xl text-slate-dark hover:scale-105 transition"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-10 opacity-30">
                <MessageSquare size={64} className="mb-4 text-gray-500" />
                <h3 className="text-xl font-bold text-white mb-2">Select a Conversation</h3>
                <p className="max-w-xs text-gray-400">Choose an inquiry to start a real-time discussion.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AgentMessages;
