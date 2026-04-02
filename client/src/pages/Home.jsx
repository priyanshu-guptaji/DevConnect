import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-indigo-500/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-600/10 blur-[100px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
              Where Developers <br />
              <span className="text-indigo-500 text-glow-indigo">Build the Future</span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto">
              DevConnect is the ultimate collaborative workspace for creators. Showcase your projects, 
              find talented partners, and grow your career alongside a global community of innovators.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/register" 
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/25"
              >
                Join the Community
              </Link>
              <Link 
                to="/projects" 
                className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all backdrop-blur-sm"
              >
                Explore Projects
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 border-t border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Showcase Portfolio",
                desc: "Beautifully display your code projects and let your achievements speak for themselves.",
                icon: "🚀"
              },
              {
                title: "Collaborate Easily",
                desc: "Find teammates for your next big idea or join existing projects that excite you.",
                icon: "🤝"
              },
              {
                title: "Career Growth",
                desc: "Connect with recruiters and top talent. Build your reputation in the tech world.",
                icon: "📈"
              }
            ].map((feature, i) => (
              <div key={i} className="group p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/[0.08] transition-all hover:-translate-y-1">
                <div className="text-4xl mb-4 leading-none">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-indigo-400 transition-colors">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-12 lg:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="text-center">
                <div className="text-4xl font-bold">10k+</div>
                <div className="text-sm text-gray-500 uppercase tracking-widest mt-1">Developers</div>
             </div>
             <div className="text-center">
                <div className="text-4xl font-bold">5k+</div>
                <div className="text-sm text-gray-500 uppercase tracking-widest mt-1">Projects</div>
             </div>
             <div className="text-center">
                <div className="text-4xl font-bold">100k+</div>
                <div className="text-sm text-gray-500 uppercase tracking-widest mt-1">Connections</div>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} DevConnect. Built for the modern web.</p>
      </footer>
    </div>
  );
};

export default Home;
