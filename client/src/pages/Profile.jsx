import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getUser, updateUser, followUser, getUserProjects, getUserPosts } from '../api';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser, updateUser: updateCurrentUser } = useContext(AuthContext);
  const [profileUser, setProfileUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    skills: '',
    github: '',
    linkedin: '',
    website: ''
  });
  const [activeTab, setActiveTab] = useState('projects');

  const isOwnProfile = currentUser?.id === id;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userRes = await getUser(id);
        const userData = userRes.data;
        setProfileUser(userData);
        setFormData({
          username: userData.username || '',
          bio: userData.bio || '',
          skills: userData.skills?.join(', ') || '',
          github: userData.github || '',
          linkedin: userData.linkedin || '',
          website: userData.website || ''
        });
        
        const [projRes, postRes] = await Promise.all([
          getUserProjects(id),
          getUserPosts(id)
        ]);
        setProjects(projRes.data || []);
        setPosts(postRes.data || []);
      } catch (err) {
        console.error('Error fetching profile data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSave = async () => {
    try {
      const data = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
      };
      const res = await updateUser(data);
      setProfileUser(res.data);
      updateCurrentUser(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  const handleFollow = async () => {
    try {
      const res = await followUser(id);
      // Backend should return the updated user or some follow state
      // Assuming res.data.following contains the list of IDs the current user follows
      const isFollowing = res.data.following.includes(id);
      setProfileUser(prev => ({
        ...prev,
        followers: isFollowing 
          ? [...(prev.followers || []), currentUser.id]
          : (prev.followers || []).filter(f => f !== currentUser.id)
      }));
    } catch (err) {
      console.error('Error following user:', err);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!profileUser) return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
      <p className="text-xl">User not found</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-indigo-500/30">
      {/* Header/Banner Area */}
      <div className="h-48 bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border-b border-white/10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-24 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-32 h-32 bg-indigo-600 rounded-2xl flex items-center justify-center text-5xl font-bold border-4 border-neutral-950 shadow-2xl">
                {profileUser.username?.charAt(0).toUpperCase()}
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="text-3xl font-bold bg-white/10 border border-white/20 px-3 py-1 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      />
                    ) : (
                      <h1 className="text-4xl font-bold text-white mb-1">{profileUser.username}</h1>
                    )}
                    <p className="text-indigo-400 font-medium">Software Developer</p>
                  </div>
                  
                  <div className="flex gap-3 justify-center sm:justify-start">
                    {isOwnProfile ? (
                      <button
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        className={`px-6 py-2.5 rounded-xl font-bold transition-all ${isEditing ? 'bg-green-600 hover:bg-green-500 shadow-green-600/20' : 'bg-white/10 hover:bg-white/20 border border-white/10'} shadow-lg`}
                      >
                        {isEditing ? 'Save Changes' : 'Edit Profile'}
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={handleFollow}
                          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/25"
                        >
                          {profileUser.followers?.includes(currentUser?.id) ? 'Unfollow' : 'Follow'}
                        </button>
                        <button className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all">
                          Message
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  {isEditing ? (
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      rows={3}
                    />
                  ) : (
                    <p className="text-gray-400 leading-relaxed max-w-2xl">{profileUser.bio || 'This coder is a bit mysterious... (no bio yet)'}</p>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap gap-2 justify-center sm:justify-start">
                  {(isEditing ? formData.skills.split(',').map(s => s.trim()).filter(s => s) : profileUser.skills)?.map((skill, idx) => (
                    <span key={idx} className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                      {skill}
                    </span>
                  ))}
                  {isEditing && (
                     <input
                        type="text"
                        placeholder="Add skills (comma separated)"
                        value={formData.skills}
                        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                        className="bg-white/5 border border-white/10 px-3 py-0.5 rounded-full text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                     />
                  )}
                </div>

                <div className="mt-8 flex items-center justify-center sm:justify-start gap-8 border-t border-white/10 pt-6">
                  <div className="text-center sm:text-left">
                    <p className="text-2xl font-bold text-white">{profileUser.followers?.length || 0}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-widest">Followers</p>
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-2xl font-bold text-white">{profileUser.following?.length || 0}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-widest">Following</p>
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-2xl font-bold text-white">{projects.length}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-widest">Projects</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links & Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-20">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Connect</h3>
              <div className="space-y-4">
                {isEditing ? (
                  <>
                    <input type="text" placeholder="GitHub URL" value={formData.github} onChange={(e) => setFormData({ ...formData, github: e.target.value })} className="w-full bg-white/5 border border-white/10 px-3 py-2 rounded-lg text-sm" />
                    <input type="text" placeholder="LinkedIn URL" value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} className="w-full bg-white/5 border border-white/10 px-3 py-2 rounded-lg text-sm" />
                    <input type="text" placeholder="Website" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} className="w-full bg-white/5 border border-white/10 px-3 py-2 rounded-lg text-sm" />
                  </>
                ) : (
                  <>
                    {profileUser.github && (
                      <a href={profileUser.github} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                        <span className="text-xl">🐙</span> GitHub
                      </a>
                    )}
                    {profileUser.linkedin && (
                      <a href={profileUser.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                        <span className="text-xl">💼</span> LinkedIn
                      </a>
                    )}
                    {profileUser.website && (
                      <a href={profileUser.website} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                        <span className="text-xl">🌐</span> Portfolio
                      </a>
                    )}
                    {(!profileUser.github && !profileUser.linkedin && !profileUser.website) && (
                        <p className="text-sm text-gray-500 italic">No social links added</p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="flex border-b border-white/10 mb-6 px-2">
              <button
                onClick={() => setActiveTab('projects')}
                className={`pb-4 px-6 text-sm font-bold tracking-widest uppercase transition-all relative ${activeTab === 'projects' ? 'text-indigo-400' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Projects
                {activeTab === 'projects' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 shadow-[0_0_10px_#6366f1]" />}
              </button>
              <button
                onClick={() => setActiveTab('posts')}
                className={`pb-4 px-6 text-sm font-bold tracking-widest uppercase transition-all relative ${activeTab === 'posts' ? 'text-indigo-400' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Posts
                {activeTab === 'posts' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 shadow-[0_0_10px_#6366f1]" />}
              </button>
            </div>

            {activeTab === 'projects' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {projects.length > 0 ? projects.map(project => (
                  <div key={project._id} className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.08] transition-all hover:-translate-y-1">
                    <h3 className="font-bold text-xl mb-2 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{project.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.techStack?.map((tech, idx) => (
                        <span key={idx} className="bg-white/5 border border-white/10 text-gray-500 text-[10px] px-2 py-0.5 rounded font-mono uppercase italic">{tech}</span>
                      ))}
                    </div>
                    <div className="flex gap-4 pt-4 border-t border-white/5">
                      {project.githubLink && (
                        <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-indigo-400 text-xs font-bold hover:text-indigo-300 uppercase tracking-widest">Source Code</a>
                      )}
                      {project.liveLink && (
                        <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="text-indigo-400 text-xs font-bold hover:text-indigo-300 uppercase tracking-widest">Live Demo</a>
                      )}
                    </div>
                  </div>
                )) : (
                    <div className="col-span-full py-12 text-center bg-white/5 border border-white/10 rounded-2xl border-dashed">
                        <p className="text-gray-500 italic">No projects showcase yet</p>
                    </div>
                )}
              </div>
            )}

            {activeTab === 'posts' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {posts.length > 0 ? posts.map(post => (
                  <div key={post._id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.08] transition-all">
                    <p className="text-gray-200 text-lg leading-relaxed mb-4">{post.content}</p>
                    {post.image && (
                        <div className="rounded-xl overflow-hidden mb-4 border border-white/10">
                            <img src={post.image} alt="Post" className="w-full h-auto object-cover max-h-[400px]" />
                        </div>
                    )}
                    <div className="flex gap-6 pt-4 border-t border-white/5">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">♥ {post.likes?.length || 0} Likes</span>
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">💬 {post.comments?.length || 0} Comments</span>
                      <span className="ml-auto text-xs text-gray-600 font-mono italic">{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                )) : (
                    <div className="py-12 text-center bg-white/5 border border-white/10 rounded-2xl border-dashed">
                        <p className="text-gray-500 italic">No thoughts shared yet</p>
                    </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
;