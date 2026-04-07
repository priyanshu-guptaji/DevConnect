import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[150px] animate-pulse pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 lg:pt-60 lg:pb-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-block px-4 py-2 glass rounded-full mb-8 animate-float">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Collaborate • Innovate • Build</span>
            </div>
            <h1 className="text-6xl lg:text-9xl font-black tracking-tighter mb-10 italic uppercase leading-[0.85]">
              Where Developers <br />
              <span className="text-gradient">Build The Future</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-400 mb-12 leading-relaxed max-w-3xl mx-auto font-medium">
              Join the ecosystem where architects of tomorrow connect. Showcase your creations, 
              find elite partners, and accelerate your vision alongside global innovators.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                to="/register" 
                className="w-full sm:w-auto px-12 py-6 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-[0.3em] text-xs rounded-2xl transition-all shadow-2xl shadow-indigo-600/30 active:scale-95"
              >
                Join Now
              </Link>
              <Link 
                to="/projects" 
                className="w-full sm:w-auto px-12 py-6 glass glass-hover text-white font-black uppercase tracking-[0.3em] text-xs rounded-2xl transition-all active:scale-95"
              >
                Discover Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
            {[
              {
                title: "Elite Portfolio",
                desc: "Beautifully display your code projects and let your achievements speak for themselves.",
                icon: "🚀"
              },
              {
                title: "Global Sync",
                desc: "Find teammates for your next big idea or join existing projects that excite you.",
                icon: "🤝"
              },
              {
                title: "Reputation System",
                desc: "Connect with recruiters and top talent. Build your reputation in the tech world.",
                icon: "📈"
              }
            ].map((feature, i) => (
              <div key={i} className="group p-10 glass glass-hover rounded-[2.5rem] relative overflow-hidden transition-all duration-500">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:bg-indigo-600/10 transition-colors" />
                <div className="text-5xl mb-8 leading-none transform group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500">{feature.icon}</div>
                <h3 className="text-2xl font-black mb-4 tracking-tighter uppercase italic group-hover:text-indigo-400 transition-colors">{feature.title}</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed tracking-wide">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats - Horizontal Scroll/Banner */}
      <section className="py-20 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden group">
          <div className="flex flex-wrap justify-center items-center gap-16 lg:gap-32 opacity-40 group-hover:opacity-100 transition-opacity duration-700">
             <div className="flex flex-col items-center">
                <div className="text-5xl font-black tracking-tighter italic uppercase underline decoration-indigo-600 decoration-8 underline-offset-4 mb-2">12k+</div>
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Talent Hub</div>
             </div>
             <div className="flex flex-col items-center">
                <div className="text-5xl font-black tracking-tighter italic uppercase underline decoration-purple-600 decoration-8 underline-offset-4 mb-2">8k+</div>
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Open Works</div>
             </div>
             <div className="flex flex-col items-center">
                <div className="text-5xl font-black tracking-tighter italic uppercase underline decoration-pink-600 decoration-8 underline-offset-4 mb-2">25k+</div>
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Daily Sync</div>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 text-center relative z-10 border-t border-white/5">
        <div className="mb-8">
            <span className="text-white font-black text-2xl tracking-tighter uppercase italic opacity-20">DevConnect</span>
        </div>
        <p className="text-gray-700 text-[10px] uppercase font-black tracking-[0.5em]">&copy; {new Date().getFullYear()} Architected for the modern web</p>
      </footer>
    </div>
  );
};

export default Home;
