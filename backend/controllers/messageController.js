import Message from '../models/Message.js';
import Property from '../models/Property.js';

// @desc    Get all unique conversations for an agent
// @route   GET /api/messages/agent/inbox
// @access  Private/Agent
export const getAgentInbox = async (req, res) => {
  try {
    // Find all unique senders (buyers) who messaged properties owned by this agent
    const myProperties = await Property.find({ agent: req.user._id }).select('_id');
    const propertyIds = myProperties.map(p => p._id);

    const conversations = await Message.aggregate([
      {
        $match: {
          property: { $in: propertyIds }
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            buyer: {
              $cond: [
                { $eq: ["$sender", req.user._id] },
                "$receiver",
                "$sender"
              ]
            },
            property: "$property"
          },
          latestMessage: { $first: "$$ROOT" },
          unreadCount: { 
            $sum: { 
              $cond: [
                { $and: [
                  { $eq: ["$receiver", req.user._id] },
                  { $eq: ["$isRead", false] }
                ]},
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id.buyer',
          foreignField: '_id',
          as: 'buyerInfo'
        }
      },
      {
        $lookup: {
          from: 'properties',
          localField: '_id.property',
          foreignField: '_id',
          as: 'propertyInfo'
        }
      },
      {
        $unwind: '$buyerInfo'
      },
      {
        $unwind: '$propertyInfo'
      },
      {
        $sort: { 'latestMessage.createdAt': -1 }
      }
    ]);

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get message history for a specific conversation
// @route   GET /api/messages/:propertyId/:buyerId
// @access  Private
export const getMessageHistory = async (req, res) => {
  try {
    const { propertyId, buyerId } = req.params;
    
    // Ensure the requester is either the buyer or the agent of the property
    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    const isAgent = property.agent.toString() === req.user._id.toString();
    const isBuyer = buyerId === req.user._id.toString();

    if (!isAgent && !isBuyer) {
      return res.status(403).json({ message: 'Unauthorized access to this chat' });
    }

    const messages = await Message.find({
      property: propertyId,
      $or: [
        { sender: req.user._id, receiver: buyerId },
        { sender: buyerId, receiver: req.user._id },
        { sender: property.agent, receiver: buyerId },
        { sender: buyerId, receiver: property.agent }
      ]
    }).sort({ createdAt: 1 });

    // Mark as read if the recipient is the one requesting
    await Message.updateMany(
      { property: propertyId, receiver: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
