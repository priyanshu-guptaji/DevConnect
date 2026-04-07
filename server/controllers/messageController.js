const Message = require('../models/Message');
const User = require('../models/User');


exports.getConversations = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.userId }, { receiver: req.userId }]
    }).sort({ createdAt: -1 });
    
    const conversations = {};
    messages.forEach(msg => {
      const otherId = msg.sender.toString() === req.userId ? msg.receiver.toString() : msg.sender.toString();
      if (!conversations[otherId] || messages.indexOf(msg) === 0) {
        conversations[otherId] = msg;
      }
    });
    
    const conversationList = await Promise.all(
      Object.keys(conversations).map(async (userId) => {
        const user = await User.findById(userId).select('username profilePic');
        return { user, lastMessage: conversations[userId] };
      })
    );
    
    res.json(conversationList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.userId, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.userId }
      ]
    }).sort({ createdAt: 1 });
    
    await Message.updateMany(
      { sender: req.params.userId, receiver: req.userId, read: false },
      { read: true }
    );
    
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const newMessage = new Message({
      sender: req.userId,
      receiver: receiverId,
      message
    });
    await newMessage.save();
    
    const io = req.app.get('io');
    if (io) {
      io.to(receiverId).emit('receive_message', {
        sender: req.userId,
        message,
        createdAt: newMessage.createdAt
      });
    }
    
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// No extra exports needed since exports.xxx already works