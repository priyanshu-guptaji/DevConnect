import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Nav = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-black/60 backdrop-blur-2xl border-b border-white/5 py-4' : 'bg-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/30 group-hover:scale-110 transition-all duration-500 rotate-3 group-hover:rotate-0">
              <span className="text-white font-black text-2xl italic">D</span>
            </div>
            <div className="flex flex-col">
                <span className="text-white font-black text-2xl tracking-tighter uppercase italic group-hover:text-indigo-400 transition-colors leading-none">DevConnect</span>
                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-500 mt-1">Ecosystem</span>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                {[
                  { name: 'Feed', path: '/feed' },
                  { name: 'Projects', path: '/projects' },
                  { name: 'Developers', path: '/developers' },
                  { name: 'Direct', path: '/messages' },
                ].map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${isActive(item.path) ? 'text-indigo-400 bg-indigo-500/10 shadow-[inset_0_0_20px_rgba(99,102,241,0.1)]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                  >
                    {item.name}
                  </Link>
                ))}
                
                <div className="w-px h-6 bg-white/10 mx-4" />
                
                <Link 
                    to={`/profile/${user.id}`} 
                    className="flex items-center gap-3 glass glass-hover px-3 py-1.5 rounded-2xl"
                >
                    <div className="w-8 h-8 bg-indigo-600/20 border border-indigo-500/30 rounded-xl flex items-center justify-center font-bold text-indigo-400 text-xs">
                         {user.username?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">{user.username}</span>
                </Link>
                
                <button 
                  onClick={handleLogout} 
                  className="ml-4 p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all border border-red-500/20 group"
                  title="Logout"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-6">
                <Link to="/login" className="text-gray-500 hover:text-white text-[10px] font-black uppercase tracking-[0.3em] transition-all">
                  Login
                </Link>
                <Link to="/register" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-95">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Placeholder */}
          <div className="md:hidden">
            <button className="glass p-3 rounded-2xl text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;