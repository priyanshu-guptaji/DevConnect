import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getAllPosts, createPost, likePost, commentPost, deletePost } from '../api';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [commentText, setCommentText] = useState({});
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getAllPosts();
        setPosts(res.data || []);
      } catch (err) {
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    try {
      const res = await createPost({ content: newPost });
      setPosts([res.data, ...posts]);
      setNewPost('');
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await likePost(postId);
      setPosts(posts.map(p => p._id === postId ? { ...p, likes: res.data.likes } : p));
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleComment = async (postId) => {
    if (!commentText[postId]?.trim()) return;
    try {
      const res = await commentPost(postId, commentText[postId]);
      setPosts(posts.map(p => p._id === postId ? res.data : p));
      setCommentText({ ...commentText, [postId]: '' });
    } catch (err) {
      console.error('Error commenting:', err);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await deletePost(postId);
      setPosts(posts.filter(p => p._id !== postId));
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar - THE "LEFT PART" */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              {currentUser && (
                <div className="glass rounded-[2rem] p-6 text-center overflow-hidden relative group">
                  <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-indigo-600 to-purple-600 opacity-20 group-hover:opacity-30 transition-opacity" />
                  <div className="relative pt-8">
                    <div className="w-20 h-20 mx-auto bg-neutral-800 border-4 border-black rounded-2xl flex items-center justify-center font-black text-3xl text-indigo-400 shadow-2xl mb-4 group-hover:scale-110 transition-transform">
                      {currentUser.username?.charAt(0).toUpperCase()}
                    </div>
                    <h2 className="text-xl font-bold text-white">{currentUser.username}</h2>
                    <p className="text-gray-500 text-sm mb-6">@{currentUser.username?.toLowerCase()}</p>
                    
                    <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
                      <div>
                        <div className="text-xl font-black text-white">12</div>
                        <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Posts</div>
                      </div>
                      <div>
                        <div className="text-xl font-black text-white">48</div>
                        <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Karma</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="glass rounded-[2rem] p-4 flex flex-col gap-2">
                {[
                    { icon: '🔥', label: 'Trending', active: true },
                    { icon: '🚀', label: 'Projects' },
                    { icon: '👥', label: 'Developers' },
                    { icon: '🔖', label: 'Bookmarks' },
                ].map((item, idx) => (
                    <button key={idx} className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${item.active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-bold text-sm uppercase tracking-wider">{item.label}</span>
                    </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-6 space-y-8">
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-4xl font-black tracking-tight text-white uppercase italic text-gradient">The Feed</h1>
                <div className="h-px flex-1 mx-6 bg-gradient-to-r from-indigo-500/50 to-transparent" />
            </div>

            {currentUser && (
              <div className="glass rounded-[2rem] p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600" />
                <form onSubmit={handlePost}>
                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-xl shadow-lg ring-4 ring-indigo-500/10">
                            {currentUser.username?.charAt(0).toUpperCase()}
                        </div>
                        <textarea
                            placeholder="What's on your mind, developer?"
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            className="w-full bg-transparent border-none text-white placeholder-gray-600 focus:ring-0 resize-none text-lg py-2 min-h-[100px]"
                        />
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
                        <div className="flex gap-2">
                            <button type="button" className="p-2 text-gray-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all">🖼️</button>
                            <button type="button" className="p-2 text-gray-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all">🔗</button>
                            <button type="button" className="p-2 text-gray-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all">💻</button>
                        </div>
                        <button 
                            type="submit" 
                            disabled={!newPost.trim()}
                            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                        >
                            Post Idea
                        </button>
                    </div>
                </form>
              </div>
            )}

            <div className="space-y-6">
              {posts.map(post => (
                <div key={post._id} className="glass glass-hover rounded-[2rem] p-6 shadow-xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-neutral-900 border border-white/10 rounded-xl flex items-center justify-center font-bold text-indigo-400 shadow-inner">
                      {post.author?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white leading-none mb-1 flex items-center gap-2">
                        {post.author?.username}
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                      </h3>
                      <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                        {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    {currentUser?.id === post.author?._id && (
                      <button 
                        onClick={() => handleDelete(post._id)} 
                        className="p-2 text-gray-600 hover:text-red-500 rounded-lg hover:bg-red-500/10 transition-all"
                      >
                        <span className="text-lg">✕</span>
                      </button>
                    )}
                  </div>

                  <div className="mb-6">
                    <p className="text-gray-200 text-lg leading-relaxed whitespace-pre-wrap">{post.content}</p>
                    {post.image && (
                        <div className="mt-4 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                            <img src={post.image} alt="Post" className="w-full h-auto object-cover max-h-[500px]" />
                        </div>
                    )}
                  </div>

                  <div className="flex items-center gap-8 pt-6 border-t border-white/5">
                    <button 
                        onClick={() => handleLike(post._id)} 
                        className={`flex items-center gap-2 group transition-all ${post.likes?.includes(currentUser?.id) ? 'text-pink-500' : 'text-gray-500 hover:text-white'}`}
                    >
                      <div className={`p-2 rounded-lg transition-all ${post.likes?.includes(currentUser?.id) ? 'bg-pink-500/10' : 'group-hover:bg-white/5'}`}>
                        ♥
                      </div>
                      <span className="text-xs font-black">{post.likes?.length || 0}</span>
                    </button>
                    <button className="flex items-center gap-2 group text-gray-500 hover:text-white transition-all">
                      <div className="p-2 group-hover:bg-white/5 rounded-lg transition-all">
                        💬
                      </div>
                      <span className="text-xs font-black">{post.comments?.length || 0}</span>
                    </button>
                  </div>

                  {/* Comments */}
                  {post.comments?.length > 0 && (
                    <div className="mt-6 space-y-3 pl-4 border-l-2 border-white/5">
                        {post.comments?.slice(0, 2).map((comment, idx) => (
                        <div key={idx} className="bg-white/5 p-3 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-indigo-400 text-[10px] uppercase tracking-wider">{comment.user?.username}</span>
                                <span className="text-[10px] text-gray-600 font-mono">
                                    {new Date(comment.createdAt || Date.now()).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-gray-400 text-xs">{comment.text}</p>
                        </div>
                        ))}
                    </div>
                  )}

                  {currentUser && (
                    <div className="mt-6 flex gap-3">
                      <input
                        type="text"
                        placeholder="Say something professional..."
                        value={commentText[post._id] || ''}
                        onChange={(e) => setCommentText({ ...commentText, [post._id]: e.target.value })}
                        className="flex-1 bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all border-dashed"
                      />
                      <button
                        onClick={() => handleComment(post._id)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white w-12 h-12 rounded-xl transition-all shadow-lg flex items-center justify-center font-black"
                      >
                        ↵
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {posts.length === 0 && (
                <div className="py-20 text-center glass rounded-[2rem] border-dashed">
                    <div className="text-4xl mb-4 text-gray-700">🌑</div>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs italic">The silence is deafening. Start the conversation!</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Bonus */}
          <div className="hidden xl:block xl:col-span-3">
            <div className="sticky top-24 space-y-6">
                <div className="glass rounded-[2rem] p-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400 mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                        Live Projects
                    </h3>
                    <div className="space-y-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="group cursor-pointer">
                                <h4 className="font-bold text-sm text-gray-200 group-hover:text-indigo-400 transition-colors">AI Content Generator</h4>
                                <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest font-medium">React + Open AI</p>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-8 py-3 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                        View All Projects
                    </button>
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Feed;

Feed;