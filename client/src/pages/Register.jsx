import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register as registerAPI } from '../api';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '',
    github: '',
    skills: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Process skills into an array
    const processedData = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s !== '')
    };

    try {
      const res = await registerAPI(processedData);
      login(res.data.token, res.data.user);
      navigate('/feed');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-float" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />

      <div className="max-w-md w-full relative z-10">
        <div className="glass rounded-[2.5rem] p-10 shadow-2xl">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20 mx-auto mb-6 rotate-3 hover:rotate-0 transition-transform">
              <span className="text-white font-black text-3xl italic">D</span>
            </div>
            <h2 className="text-4xl font-black text-white mb-3 tracking-tight italic uppercase">Join Us</h2>
            <p className="text-gray-500 font-medium text-sm uppercase tracking-[0.2em]">The DevConnect Ecosystem</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-xs font-bold text-center uppercase tracking-widest animate-pulse">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5">
              <div className="group">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-indigo-400 transition-colors">Username</label>
                <input
                  type="text"
                  required
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-gray-700"
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
              
              <div className="group">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-indigo-400 transition-colors">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-gray-700"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="group">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-indigo-400 transition-colors">Skills (Comma separated)</label>
                <input
                  type="text"
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-gray-700"
                  placeholder="React, Node.js, Python"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                />
              </div>

              <div className="group">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-indigo-400 transition-colors">Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-gray-700"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-[0.3em] text-xs rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6 shadow-xl shadow-indigo-600/20 active:scale-95"
            >
              {loading ? 'Processing...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-10 text-center text-gray-500 text-xs font-bold uppercase tracking-widest">
            Member already?{' '}
            <Link to="/login" className="text-white hover:text-indigo-400 transition-colors underline decoration-indigo-500/30 underline-offset-8">
              Sign in 
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

