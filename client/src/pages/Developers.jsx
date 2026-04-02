import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getAllUsers, followUser } from '../api';

const Developers = () => {
  const [developers, setDevelopers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const res = await getAllUsers();
        setDevelopers(res.data || []);
      } catch (err) {
        console.error('Error fetching developers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDevelopers();
  }, []);

  const handleFollow = async (e, developerId) => {
    e.preventDefault();
    try {
      await followUser(developerId);
      // Update local state to reflect the follow/unfollow
      setDevelopers(prev => prev.map(d => {
        if (d._id === developerId) {
            const isFollowing = d.followers?.includes(currentUser.id);
            return {
                ...d,
                followers: isFollowing 
                    ? d.followers.filter(id => id !== currentUser.id)
                    : [...(d.followers || []), currentUser.id]
            };
        }
        return d;
      }));
    } catch (err) {
      console.error('Error following developer:', err);
    }
  };

  const filteredDevelopers = developers.filter(dev => 
    dev.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dev.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-indigo-500/30 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
            <div className="flex-1">
                <h1 className="text-5xl font-black tracking-tight text-white uppercase italic mb-2">Network</h1>
                <p className="text-gray-500 font-medium uppercase tracking-widest text-sm">Connect with the world's most talented creators</p>
            </div>
            <div className="relative w-full md:w-96">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                    🔍
                </div>
                <input
                    type="text"
                    placeholder="Search by name or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDevelopers.map(developer => (
            <div key={developer._id} className="group bg-white/5 border border-white/10 rounded-3xl p-8 transition-all hover:bg-white/[0.08] hover:-translate-y-1">
              <Link to={`/profile/${developer._id}`} className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex-shrink-0 flex items-center justify-center text-3xl font-bold border-2 border-neutral-950 shadow-2xl group-hover:scale-105 transition-transform">
                  {developer.username?.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-xl text-white group-hover:text-indigo-400 transition-colors truncate uppercase tracking-tight">{developer.username}</h3>
                  <p className="text-gray-500 text-xs font-mono truncate">{developer.email}</p>
                </div>
              </Link>
              
              <div className="h-12 mb-6">
                <p className="text-gray-400 text-sm line-clamp-2 italic leading-relaxed">
                    {developer.bio || "This developer hasn't written a bio yet."}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-1.5 mb-8">
                {(developer.skills?.length > 0 ? developer.skills.slice(0, 4) : ["No skills listed"]).map((skill, idx) => (
                  <span key={idx} className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-widest italic">
                    {skill}
                  </span>
                ))}
                {developer.skills?.length > 4 && (
                    <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest ml-1 self-center">+{developer.skills.length - 4} more</span>
                )}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-sm font-bold text-white">{developer.followers?.length || 0}</p>
                    <p className="text-[8px] text-gray-500 uppercase tracking-tighter">Followers</p>
                  </div>
                  <div className="w-px h-6 bg-white/5" />
                  <div className="text-center">
                    <p className="text-sm font-bold text-white">{developer.following?.length || 0}</p>
                    <p className="text-[8px] text-gray-500 uppercase tracking-tighter">Following</p>
                  </div>
                </div>
                
                {currentUser && currentUser.id !== developer._id && (
                  <button
                    onClick={(e) => handleFollow(e, developer._id)}
                    className={`px-6 py-2 rounded-xl text-xs font-bold transition-all border ${developer.followers?.includes(currentUser.id) ? 'bg-white/10 border-white/10 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white border-transparent shadow-lg shadow-indigo-600/20'}`}
                  >
                    {developer.followers?.includes(currentUser.id) ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredDevelopers.length === 0 && (
            <div className="py-32 text-center bg-white/5 border border-white/10 border-dashed rounded-3xl">
                <p className="text-gray-500 text-lg italic">No developers match your search criteria.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Developers;