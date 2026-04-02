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
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-indigo-500/30 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
            <h1 className="text-4xl font-black tracking-tight text-white uppercase italic">The Feed</h1>
            <div className="h-0.5 flex-1 mx-6 bg-gradient-to-r from-indigo-500 to-transparent opacity-20" />
        </div>

        {currentUser && (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-10 backdrop-blur-xl shadow-2xl">
            <form onSubmit={handlePost}>
                <div className="flex gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex-shrink-0 flex items-center justify-center font-bold text-xl shadow-lg">
                        {currentUser.username?.charAt(0).toUpperCase()}
                    </div>
                    <textarea
                        placeholder="Share your latest project or thought..."
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        className="w-full bg-transparent border-none text-white placeholder-gray-500 focus:ring-0 resize-none text-lg py-2"
                        rows={3}
                    />
                </div>
                <div className="flex justify-end mt-4 pt-4 border-t border-white/5">
                    <button 
                        type="submit" 
                        disabled={!newPost.trim()}
                        className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20"
                    >
                        Post Idea
                    </button>
                </div>
            </form>
          </div>
        )}

        <div className="space-y-8">
          {posts.map(post => (
            <div key={post._id} className="group bg-white/5 border border-white/10 rounded-3xl p-6 transition-all hover:bg-white/[0.07]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-neutral-800 rounded-2xl flex items-center justify-center font-bold text-indigo-400 border border-white/5 shadow-inner">
                  {post.author?.username?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white leading-none mb-1">{post.author?.username}</h3>
                  <p className="text-gray-500 text-xs font-medium uppercase tracking-widest">
                    {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                {currentUser?.id === post.author?._id && (
                  <button 
                    onClick={() => handleDelete(post._id)} 
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-500 hover:text-red-500 rounded-lg hover:bg-red-500/10"
                  >
                    <span className="text-xl">🗑</span>
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

              <div className="flex items-center gap-8 pt-4 border-t border-white/5">
                <button 
                    onClick={() => handleLike(post._id)} 
                    className={`flex items-center gap-2 text-sm font-bold transition-all ${post.likes?.includes(currentUser?.id) ? 'text-pink-500' : 'text-gray-500 hover:text-white'}`}
                >
                  <span className="text-xl">♥</span> {post.likes?.length || 0}
                </button>
                <button className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-white transition-all">
                  <span className="text-xl">💬</span> {post.comments?.length || 0}
                </button>
              </div>

              {/* Comments Section */}
              <div className="mt-6 space-y-3">
                {post.comments?.slice(0, 3).map((comment, idx) => (
                  <div key={idx} className="bg-white/[0.03] border border-white/5 p-3 rounded-2xl">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-indigo-400 text-xs">{comment.user?.username}</span>
                        <span className="w-1 h-1 bg-gray-600 rounded-full" />
                        <span className="text-[10px] text-gray-500 font-mono italic">
                            {new Date(comment.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                    </div>
                    <p className="text-gray-300 text-sm">{comment.text}</p>
                  </div>
                ))}
              </div>

              {currentUser && (
                <div className="mt-6 flex gap-3">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText[post._id] || ''}
                    onChange={(e) => setCommentText({ ...commentText, [post._id]: e.target.value })}
                    className="flex-1 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                  <button
                    onClick={() => handleComment(post._id)}
                    className="bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white w-10 h-10 rounded-xl transition-all border border-indigo-500/30 flex items-center justify-center font-bold"
                  >
                    →
                  </button>
                </div>
              )}
            </div>
          ))}

          {posts.length === 0 && (
            <div className="py-20 text-center bg-white/5 border border-white/10 rounded-3xl border-dashed">
                <p className="text-gray-500 text-lg italic">The silence is deafening. Start the conversation!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;
Feed;