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
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-neutral-950/80 backdrop-blur-xl border-b border-white/5 py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform">
              <span className="text-white font-black text-xl italic">D</span>
            </div>
            <span className="text-white font-black text-2xl tracking-tighter uppercase italic group-hover:text-indigo-400 transition-colors">DevConnect</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                {[
                  { name: 'Home', path: '/' },
                  { name: 'Feed', path: '/feed' },
                  { name: 'Projects', path: '/projects' },
                  { name: 'Developers', path: '/developers' },
                  { name: 'Direct', path: '/messages' },
                ].map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isActive(item.path) ? 'text-indigo-400 bg-indigo-500/5 shadow-[inset_0_0_10px_rgba(99,102,241,0.1)]' : 'text-gray-500 hover:text-white'}`}
                  >
                    {item.name}
                  </Link>
                ))}
                
                <div className="w-px h-6 bg-white/10 mx-2" />
                
                <Link 
                    to={`/profile/${user.id}`} 
                    className="w-10 h-10 bg-neutral-800 border border-white/10 rounded-xl flex items-center justify-center font-bold text-indigo-400 hover:border-indigo-500/50 transition-all"
                >
                    {user.username?.charAt(0).toUpperCase()}
                </Link>
                
                <button 
                  onClick={handleLogout} 
                  className="ml-2 px-5 py-2.5 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all border border-red-500/20"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-gray-400 hover:text-white text-xs font-black uppercase tracking-widest transition-all">
                  Login
                </Link>
                <Link to="/register" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-indigo-600/20">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Placeholder */}
          <div className="md:hidden">
            <button className="text-white text-2xl">☰</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;