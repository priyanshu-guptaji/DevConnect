import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getConversations, getMessages, sendMessage, getAllUsers } from '../api';
import io from 'socket.io-client';

// In a real app, the base URL would be from an env variable
const socket = io();


const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useContext(AuthContext);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await getConversations();
        setConversations(res.data || []);
      } catch (err) {
        console.error('Error fetching conversations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();

    const fetchUsers = async () => {
      try {
        const res = await getAllUsers();
        setUsers(res.data.filter(u => u._id !== currentUser?.id));
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };
    fetchUsers();

    if (currentUser?.id) {
        socket.emit('join_room', currentUser.id);
    }

    socket.on('receive_message', (data) => {
      if (selectedUser && (data.sender === selectedUser._id || data.receiver === selectedUser._id)) {
        setMessages(prev => [...prev, data]);
      }
      // Update conversations list as well
      fetchConversations();
    });

    return () => {
      socket.off('receive_message');
    };
  }, [currentUser?.id, selectedUser]);

  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    try {
      const res = await getMessages(user._id);
      setMessages(res.data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;
    
    const messageData = {
      receiverId: selectedUser._id,
      message: newMessage
    };

    try {
      await sendMessage(messageData);
      const tempMsg = { 
        sender: currentUser.id, 
        message: newMessage, 
        createdAt: new Date().toISOString() 
      };
      setMessages(prev => [...prev, tempMsg]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-indigo-500/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto h-[750px] flex flex-col">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-black tracking-tight text-white uppercase italic">Direct</h1>
            <div className="h-0.5 flex-1 mx-6 bg-gradient-to-r from-indigo-500 to-transparent opacity-20" />
        </div>

        <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl flex">
          {/* Sidebar */}
          <div className="w-full sm:w-80 border-r border-white/5 flex flex-col bg-white/[0.02]">
            <div className="p-6 border-b border-white/5">
                <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Conversations</h2>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {conversations.length === 0 && (
                <div className="p-6">
                  <p className="text-gray-500 text-xs uppercase tracking-widest mb-6 font-bold">New Connection?</p>
                  <div className="space-y-3">
                    {users.slice(0, 5).map(user => (
                      <button
                        key={user._id}
                        onClick={() => handleSelectUser(user)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/5 group"
                      >
                        <div className="w-10 h-10 bg-indigo-600/20 border border-indigo-500/30 rounded-xl flex items-center justify-center font-bold text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          {user.username?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-sm text-gray-300 group-hover:text-white">{user.username}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="py-2">
                {conversations.map((conv, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectUser(conv.user)}
                    className={`w-full flex items-center gap-4 px-6 py-4 transition-all hover:bg-white/[0.04] relative group ${selectedUser?._id === conv.user?._id ? 'bg-white/[0.06]' : ''}`}
                  >
                    {selectedUser?._id === conv.user?._id && (
                        <div className="absolute left-0 top-0 h-full w-1 bg-indigo-500 shadow-[0_0_15px_#6366f1]" />
                    )}
                    <div className="w-12 h-12 bg-neutral-800 border border-white/10 rounded-2xl flex items-center justify-center font-bold text-indigo-400 shadow-inner group-hover:scale-105 transition-transform">
                      {conv.user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 text-left overflow-hidden">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="font-bold text-white group-hover:text-indigo-400 transition-colors truncate">{conv.user?.username}</span>
                        <span className="text-[9px] text-gray-600 font-mono italic">
                            {conv.lastMessage?.createdAt ? new Date(conv.lastMessage.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ''}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs truncate italic">{conv.lastMessage?.message || 'Started a conversation'}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col bg-white/[0.01]">
            {selectedUser ? (
              <>
                <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">
                            {selectedUser.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="font-bold text-lg text-white leading-none">{selectedUser.username}</h2>
                            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-1">Active Now</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button className="text-gray-500 hover:text-white transition-colors">📞</button>
                        <button className="text-gray-500 hover:text-white transition-colors">📹</button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar backdrop-blur-3xl">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === currentUser?.id ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                      <div className={`max-w-[75%] group`}>
                        <div className={`px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-xl ${msg.sender === currentUser?.id ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white/5 border border-white/10 text-gray-200 rounded-bl-none'}`}>
                          {msg.message}
                        </div>
                        <p className={`text-[9px] font-mono text-gray-600 mt-2 ${msg.sender === currentUser?.id ? 'text-right' : 'text-left'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                <form onSubmit={handleSend} className="p-6 bg-white/[0.03] border-t border-white/5 flex gap-4">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Hold down Shift + Enter for new line..."
                    className="flex-1 bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                  />
                  <button 
                    type="submit" 
                    disabled={!newMessage.trim()}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed w-14 h-14 rounded-2xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center font-bold text-xl"
                  >
                    ➤
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-4xl mb-6 opacity-20">
                    💬
                </div>
                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest italic">Dev-to-Dev Messaging</h3>
                <p className="text-gray-500 max-w-xs leading-relaxed">
                  Select a fellow builder from your connections or start a new conversation to coordinate your next breakthrough.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;