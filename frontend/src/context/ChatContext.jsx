import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { userInfo } = useAuth();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (userInfo && userInfo.token) {
      const newSocket = io(import.meta.env.VITE_API_URL); // Use env variable in prod
      setSocket(newSocket);

      // Listener for global notifications (messages for me)
      newSocket.on(`notification_${userInfo._id}`, (data) => {
        console.log('New Notification:', data);
        setNotifications(prev => [data, ...prev]);
        setUnreadCount(prev => prev + 1);
      });

      return () => newSocket.close();
    }
  }, [userInfo]);

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return (
    <ChatContext.Provider value={{ socket, notifications, unreadCount, clearNotifications }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
