import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import userRoutes from './routes/userRoutes.js';
import http from 'http';
import { Server } from 'socket.io';
import Message from './models/Message.js';
import agentRoutes from './routes/agentRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // In production, replace with your frontend URL
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/messages', messageRoutes);

// Socket.io Real-time Chat logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_chat', ({ propertyId, userId }) => {
    const room = `chat_${propertyId}_${userId}`;
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on('send_message', async (data) => {
    console.log('--- New Socket Message ---');
    console.log(data);
    
    const { sender, receiver, property, content } = data;
    
    if (!sender || !receiver || !property || !content) {
      console.error('Socket Error: Missing mandatory message fields', { sender, receiver, property, content });
      return;
    }

    try {
      const newMessage = new Message({
        sender,
        receiver,
        property,
        content
      });
      await newMessage.save();

      const room = `chat_${property}_${sender === receiver ? sender : (sender < receiver ? `${sender}_${receiver}` : `${receiver}_${sender}`)}`;
      // Actually, let's use a consistent room naming for conversations
      // For simplicity in this demo, let's use chat_propertyId_buyerId
      // The agent and buyer both join this room.
      
      const conversationRoom = data.room || `chat_${property}_${sender}`; 
      io.to(conversationRoom).emit('receive_message', newMessage);
      
      // Notify receiver globally
      io.emit(`notification_${receiver}`, {
        type: 'new_message',
        propertyId: property,
        senderName: data.senderName
      });
    } catch (error) {
      console.error('Socket error:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.get('/', (req, res) => {
  res.send('LuxeEstate API is running with Real-time Chat...');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
