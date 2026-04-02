import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getAllProjects, createProject, likeProject, deleteProject } from '../api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    githubLink: '',
    liveLink: ''
  });
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getAllProjects();
        setProjects(res.data || []);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        techStack: formData.techStack.split(',').map(t => t.trim()).filter(t => t)
      };
      const res = await createProject(data);
      setProjects([res.data, ...projects]);
      setShowForm(false);
      setFormData({ title: '', description: '', techStack: '', githubLink: '', liveLink: '' });
    } catch (err) {
      console.error('Error creating project:', err);
    }
  };

  const handleLike = async (projectId) => {
    try {
      const res = await likeProject(projectId);
      setProjects(projects.map(p => 
        p._id === projectId ? { ...p, likes: res.data.likes } : p
      ));
    } catch (err) {
      console.error('Error liking project:', err);
    }
  };

  const handleDelete = async (projectId) => {
    try {
      await deleteProject(projectId);
      setProjects(projects.filter(p => p._id !== projectId));
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-indigo-500/30 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="text-5xl font-black tracking-tight text-white uppercase italic mb-2">Showcase</h1>
            <p className="text-gray-500 font-medium uppercase tracking-widest text-sm">Discover amazing projects build by the community</p>
          </div>
          {currentUser && (
            <button
              onClick={() => setShowForm(!showForm)}
              className={`px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${showForm ? 'bg-white/5 hover:bg-white/10 border border-white/10 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'}`}
            >
              {showForm ? 'Cancel' : 'New Project'}
            </button>
          )}
        </div>

        {showForm && (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-12 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-300">
            <h2 className="text-2xl font-bold mb-6">Launch Your Creation</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-1 space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Project Title</label>
                    <input
                        type="text"
                        placeholder="e.g. Real-time Crypto Dashboard"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Tech Stack</label>
                    <input
                        type="text"
                        placeholder="React, Tailwind, Node.js"
                        value={formData.techStack}
                        onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                </div>
              </div>
              <div className="md:col-span-1 space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Description</label>
                    <textarea
                        placeholder="What problem does it solve?"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        rows={4}
                        required
                    />
                </div>
              </div>
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">GitHub Repository</label>
                    <input
                        type="url"
                        placeholder="https://github.com/..."
                        value={formData.githubLink}
                        onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Live Demo (Optional)</label>
                    <input
                        type="url"
                        placeholder="https://..."
                        value={formData.liveLink}
                        onChange={(e) => setFormData({ ...formData, liveLink: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                 </div>
              </div>
              <div className="md:col-span-2 pt-4 border-t border-white/5">
                <button type="submit" className="w-full md:w-auto px-10 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20">
                    Publish Project
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map(project => (
            <div key={project._id} className="group flex flex-col bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:bg-white/[0.08] transition-all hover:-translate-y-1">
              <div className="p-8 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-2xl text-white leading-tight group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{project.title}</h3>
                  {currentUser?.id === project.owner?._id && (
                    <button onClick={() => handleDelete(project._id)} className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                      🗑
                    </button>
                  )}
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">{project.description}</p>
                
                <div className="flex flex-wrap gap-1.5 mb-8">
                  {project.techStack?.map((tech, idx) => (
                    <span key={idx} className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-widest italic">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-6 mt-auto">
                  {project.githubLink && (
                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-white/50 hover:text-white uppercase tracking-widest underline underline-offset-4 decoration-indigo-500/50 transition-all">
                      Repository
                    </a>
                  )}
                  {project.liveLink && (
                    <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-white/50 hover:text-white uppercase tracking-widest underline underline-offset-4 decoration-indigo-500/50 transition-all">
                      Live Preview
                    </a>
                  )}
                </div>
              </div>

              <div className="px-8 py-5 bg-white/5 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-neutral-800 border border-white/10 rounded-lg flex items-center justify-center text-xs font-bold text-indigo-400">
                    {project.owner?.username?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-300 leading-none">{project.owner?.username}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Creator</p>
                  </div>
                </div>
                <button
                  onClick={() => handleLike(project._id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all border ${project.likes?.includes(currentUser?.id) ? 'bg-pink-500/10 border-pink-500/20 text-pink-500' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'}`}
                >
                  <span className="text-lg">♥</span>
                  <span className="text-xs font-bold">{project.likes?.length || 0}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
            <div className="py-32 text-center bg-white/5 border border-white/10 border-dashed rounded-3xl">
                <p className="text-gray-500 text-lg italic">No masterpieces found yet. Be the first to share one!</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
s;