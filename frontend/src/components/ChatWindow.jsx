import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, MessageSquare, User, UserCheck } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';

const ChatWindow = ({ isOpen, onClose, property }) => {
  const { userInfo } = useAuth();
  const { socket } = useChat();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef();

  useEffect(() => {
    if (isOpen && property && userInfo) {
      const fetchHistory = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
          const { data } = await axios.get(`/api/messages/${property._id}/${userInfo._id}`, config);
          setMessages(data);
          
          if (socket) {
            socket.emit('join_chat', { propertyId: property._id, userId: userInfo._id });
          }
        } catch (err) {
          console.error('Error fetching chat history:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchHistory();
    }
  }, [isOpen, property, userInfo, socket]);

  useEffect(() => {
    if (socket) {
      socket.on('receive_message', (message) => {
        if (message.property === property?._id && 
           (message.sender === userInfo._id || message.receiver === userInfo._id)) {
          setMessages(prev => [...prev, message]);
        }
      });
    }
    return () => socket?.off('receive_message');
  }, [socket, property, userInfo]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!userInfo?._id) {
      console.error('Chat Error: Current user ID is missing. Please re-login.');
      return;
    }

    const messageData = {
      sender: userInfo._id,
      receiver: property.agent._id || property.agent,
      property: property._id,
      content: newMessage,
      senderName: userInfo.name,
      room: `chat_${property._id}_${userInfo._id}`
    };

    console.log('Sending Socket Message (Buyer):', messageData);
    socket.emit('send_message', messageData);
    setNewMessage('');
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 100, opacity: 0, scale: 0.95 }}
      className="fixed bottom-6 right-6 w-96 glass rounded-[32px] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100] overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.05] backdrop-blur-2xl">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden">
               <User className="text-gray-400" size={20} />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-slate-dark rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Luxe Concierge <UserCheck size={14} className="text-champagne-gold" />
            </h3>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">{property?.name}</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-full transition text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-5 space-y-4 bg-black/10">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-xs">Connecting to concierge...</div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3 px-6">
            <div className="bg-white/5 p-4 rounded-full">
              <MessageSquare size={32} className="text-champagne-gold/40" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Start the Discussion</p>
              <p className="text-[11px] text-gray-500 mt-1">Inquire about exclusivity, private viewings, or specific property amenities.</p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div 
              key={idx}
              className={`flex ${msg.sender === userInfo._id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-3.5 rounded-2xl text-xs ${
                msg.sender === userInfo._id 
                ? 'bg-champagne-gold text-slate-dark font-bold rounded-tr-none shadow-lg shadow-champagne-gold/20' 
                : 'bg-white/5 border border-white/10 text-white rounded-tl-none'
              }`}>
                {msg.content}
                <p className={`text-[9px] mt-1.5 opacity-60 ${msg.sender === userInfo._id ? 'text-slate-dark text-right' : 'text-gray-400 text-left'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-white/[0.05]">
        <div className="relative group">
          <input 
            type="text" 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Secure message to agent..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-5 pr-14 text-xs text-white focus:outline-none focus:border-champagne-gold/40 transition"
          />
          <button 
            type="submit"
            className="absolute right-1.5 top-1.5 p-2 bg-champagne-gold rounded-xl text-slate-dark hover:scale-105 transition active:scale-95"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ChatWindow;
