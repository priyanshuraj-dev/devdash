import { useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import { FiCloudLightning, FiX, FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
export default function AddProject({ onProjectAdded }: any) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: "", description: "", techStack: "", githubLink: "", liveLink: "", featured: false
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAdd = async () => {
    let shouldSetLoadingFalse = true;
    try {
      setLoading(true);
      
      // 1. Upload Images first
      let uploadedImages = [];
      if (selectedFiles.length > 0) {
        const uploadData = new FormData();
        selectedFiles.forEach(file => uploadData.append("images", file));
        const res = await api.post("/api/media/upload", uploadData);
        // Map backend response to {url, publicId}
        uploadedImages = res.data.files.map((f: any) => ({ url: f.url, publicId: f.publicId }));
      }

      // 2. Create Project
      const payload = {
        ...formData,
        techStack: formData.techStack.split(",").map(t => t.trim()).filter(Boolean),
        images: uploadedImages
      };

      await api.post("/api/projects", payload);
      toast.success("Project launched successfully!");
      // Reset State
      setFormData({ title: "", description: "", techStack: "", githubLink: "", liveLink: "", featured: false });
      setSelectedFiles([]);
      await onProjectAdded();
    } catch (err:any) {

        if(err?.response?.status === 401){
          try {
            await api.post("/api/auth/refresh");
            shouldSetLoadingFalse = false;
            return handleAdd();
          } catch (error) {
              navigate("/login")
              return;
          }
        }
      toast.error(err.response.data.message || "Failed to create project");
    } finally {
      if(shouldSetLoadingFalse){
        setLoading(false);
      }
      
    }
  };



  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-xl">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FiPlus className="text-teal-500" /> New Project
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-teal-500" 
                 placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          
          <textarea className="w-full bg-white/5 border border-white/10 rounded-xl p-3 h-32 outline-none focus:border-teal-500" 
                    placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          
          {/* Image Upload Area */}
          <div className="border-2 border-dashed border-white/10 rounded-xl p-4">
            <label className="flex flex-col items-center cursor-pointer">
              <FiCloudLightning className="text-2xl text-teal-500 mb-2" />
              <span className="text-sm text-gray-400">Click to upload images (Max 5)</span>
              <input type="file" multiple className="hidden" onChange={handleFileChange} accept="image/*" />
            </label>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedFiles.map((file, i) => (
                <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/20">
                  <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                  <button onClick={() => removeFile(i)} className="absolute top-0 right-0 bg-red-500 p-0.5 rounded-bl-lg">
                    <FiX size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 flex flex-col justify-between">
          <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none" 
                 placeholder="Tech Stack (comma separated)" value={formData.techStack} onChange={e => setFormData({...formData, techStack: e.target.value})} />
          <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none" 
                 placeholder="GitHub Link" value={formData.githubLink} onChange={e => setFormData({...formData, githubLink: e.target.value})} />
          <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none" 
                 placeholder="Live Link" value={formData.liveLink} onChange={e => setFormData({...formData, liveLink: e.target.value})} />
          
          <button onClick={handleAdd} disabled={loading} className="w-full py-4 bg-teal-500 text-black font-bold rounded-xl hover:bg-teal-400 transition-all">
            {loading ? "Uploading & Saving..." : "Save Project"}
          </button>
        </div>
      </div>
    </div>
  );
}