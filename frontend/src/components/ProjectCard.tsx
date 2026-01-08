import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import { FiEdit2, FiExternalLink, FiGithub, FiCheck, FiX, FiTrash2, FiStar } from "react-icons/fi";

export default function ProjectCard({ project, onUpdated, onDelete }: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(project);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(project);
  }, [project]);
  
  let payload:{
    title: string;
    description: string;
    githubLink: string;
    liveLink: string;
    featured: boolean;
  } ;
  const handleUpdate = async () => {
    try {
      setSaving(true);
      
       payload = { 
        title: form.title, 
        description: form.description,
        githubLink: form.githubLink,
        liveLink: form.liveLink,
        featured: form.featured // Added featured to payload
      };

      await api.patch(`/api/projects/${project._id}`, payload);
      
      toast.success("Project updated");
      setIsEditing(false);
      onUpdated();
    } catch (err:any) {
      if (err?.response?.status === 401) {
        try {
          await api.post("/api/auth/refresh");
          await api.patch(`/api/projects/${project._id}`, payload);
          toast.success("Project updated");
          setIsEditing(false);
          onUpdated();
          return;
        } catch {
          window.location.href = "/login";
          return;
        }
      }
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`relative transition-all duration-300 rounded-2xl overflow-hidden mb-6 border ${
      form.featured 
        ? "bg-teal-500/5 border-teal-500/40 shadow-[0_0_20px_rgba(20,184,166,0.1)]" 
        : "bg-white/5 border-white/10 hover:border-white/20"
    }`}>
      
      {/* Featured Badge */}
      {form.featured && !isEditing && (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1 px-3 py-1 bg-teal-500 text-black text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
          <FiStar size={10} fill="currentColor" /> Featured
        </div>
      )}

      {/* Image Gallery */}
      <div className="grid grid-cols-4 gap-1 h-48 bg-black/20">
        {project.images?.map((img: any) => (
          <div key={img.publicId} className="relative overflow-hidden">
            <img 
              src={img.url} 
              alt="Project"
              className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" 
            />
          </div>
        ))}
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
                {isEditing ? (
                <input 
                    value={form.title} 
                    onChange={e => setForm({...form, title: e.target.value})} 
                    className="bg-white/10 border border-white/20 rounded px-2 py-1 w-full text-xl font-bold text-white outline-none focus:border-teal-500" 
                    placeholder="Project Title"
                />
                ) : (
                <h3 className="text-xl font-bold text-white">{project.title}</h3>
                )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {project.techStack?.map((tech: string) => (
                <span key={tech} className="text-[10px] uppercase tracking-wider bg-white/5 text-gray-400 px-2 py-1 rounded-md border border-white/10">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-2 ml-4">
            {isEditing ? (
              <>
                <button onClick={handleUpdate} disabled={saving} className="p-2 bg-teal-500 text-black rounded-lg hover:bg-teal-400 transition-colors">
                  <FiCheck size={18} />
                </button>
                <button onClick={() => { setIsEditing(false); setForm(project); }} className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                  <FiX size={18} />
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setIsEditing(true)} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                  <FiEdit2 size={18} />
                </button>
                <button onClick={() => onDelete(project._id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                  <FiTrash2 size={18} />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mt-4">
          {isEditing ? (
            <textarea 
              value={form.description} 
              onChange={e => setForm({...form, description: e.target.value})} 
              className="w-full bg-white/10 border border-white/20 rounded p-2 text-sm text-gray-300 outline-none focus:border-teal-500 resize-none" 
              rows={3} 
            />
          ) : (
            <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
              {project.description}
            </p>
          )}
        </div>

        {/* Links & Featured Toggle */}
        <div className="mt-6 pt-4 border-t border-white/5 flex flex-col md:flex-row justify-between gap-6">
          <div className="flex gap-6">
            <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Repository</span>
                {isEditing ? (
                <input 
                    value={form.githubLink || ""} 
                    onChange={e => setForm({...form, githubLink: e.target.value})} 
                    className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-teal-400 outline-none w-40"
                    placeholder="GitHub URL"
                />
                ) : (
                <a href={project.githubLink} target="_blank" rel="noreferrer" className={`flex items-center gap-2 text-sm transition-colors ${project.githubLink ? 'text-teal-400 hover:text-teal-300' : 'text-gray-600 pointer-events-none'}`}>
                    <FiGithub size={14} /> GitHub
                </a>
                )}
            </div>

            <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Deployment</span>
                {isEditing ? (
                <input 
                    value={form.liveLink || ""} 
                    onChange={e => setForm({...form, liveLink: e.target.value})} 
                    className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-teal-400 outline-none w-40"
                    placeholder="Live Link URL"
                />
                ) : (
                <a href={project.liveLink} target="_blank" rel="noreferrer" className={`flex items-center gap-2 text-sm transition-colors ${project.liveLink ? 'text-teal-400 hover:text-teal-300' : 'text-gray-600 pointer-events-none'}`}>
                    <FiExternalLink size={14} /> Live Demo
                </a>
                )}
            </div>
          </div>

          {/*  Featured Toggle (Visible only in Editing Mode) */ }
          {isEditing && (
            <label className="flex items-center gap-2 cursor-pointer self-end md:self-center">
              <input 
                type="checkbox" 
                checked={form.featured} 
                onChange={e => setForm({...form, featured: e.target.checked})}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-teal-500 focus:ring-0"
              />
              <span className="text-xs text-gray-300 font-semibold uppercase tracking-widest">Mark Featured</span>
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
