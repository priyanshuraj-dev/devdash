import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { FiEdit2, FiCheck, FiX, FiGithub,  } from "react-icons/fi";
import { SiLeetcode, SiCodeforces, SiCodechef } from "react-icons/si";

export default function CodingHandles({ user, onUpdated }: any) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    leetcodeHandle: "",
    codechefHandle: "",
    githubHandle: "",
    codeforcesHandle: "",
  });

  useEffect(() => {
    if (!user) return;
    setForm({
      leetcodeHandle: user.leetcodeHandle || "",
      codechefHandle: user.codechefHandle || "",
      githubHandle: user.githubHandle || "",
      codeforcesHandle: user.codeforcesHandle || "",
    });
  }, [user, isEditing]);

  const handleSave = async () => {
    try {
      setLoading(true);
      await api.patch("/api/user/profile", form);
      toast.success("Coding handles updated");
      setIsEditing(false);
      await onUpdated(); // 🔥 refresh /me in Dashboard
    } catch (err: any) {
      if(err?.response?.status === 401){
        try {
            await api.post("/api/auth/refresh");
            await api.patch("/api/user/profile",form);
            toast.success("Coding handles updated");
            setIsEditing(false);
            await onUpdated();
            return;
        } catch (error) {
            navigate("/login");
            return;
        }
      }
      toast.error("Failed to update handles");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className={`transition-all duration-300 border rounded-3xl p-8 ${
        isEditing ? "bg-white/10 border-teal-500/30 ring-1 ring-teal-500/20" : "bg-white/5 border-white/10"
    }`}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Coding Ecosystem</h2>
          <p className="text-gray-500 text-sm">Connect your competitive and development profiles</p>
        </div>

        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button 
                onClick={handleSave} 
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2 bg-teal-500 text-black font-bold rounded-xl hover:bg-teal-400 transition-all shadow-lg shadow-teal-500/20"
              >
                <FiCheck /> {loading ? "Saving..." : "Save Changes"}
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                className="p-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all"
              >
                <FiX size={20} />
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-5 py-2 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all"
            >
              <FiEdit2 size={16} /> Edit Handles
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <HandleInput
          label="GitHub"
          icon={<FiGithub className="text-white" />}
          value={form.githubHandle}
          placeholder="username"
          isEditing={isEditing}
          onChange={(v) => setForm({ ...form, githubHandle: v })}
        />
        <HandleInput
          label="LeetCode"
          icon={<SiLeetcode className="text-yellow-500" />}
          value={form.leetcodeHandle}
          placeholder="username"
          isEditing={isEditing}
          onChange={(v) => setForm({ ...form, leetcodeHandle: v })}
        />
        <HandleInput
          label="Codeforces"
          icon={<SiCodeforces className="text-blue-500" />}
          value={form.codeforcesHandle}
          placeholder="handle"
          isEditing={isEditing}
          onChange={(v) => setForm({ ...form, codeforcesHandle: v })}
          stats={user.codeforcesStats} // Optional: Pass read-only stats here
        />
        <HandleInput
          label="CodeChef"
          icon={<SiCodechef className="text-amber-800" />}
          value={form.codechefHandle}
          placeholder="username"
          isEditing={isEditing}
          onChange={(v) => setForm({ ...form, codechefHandle: v })}
        />
      </div>
    </div>
  );
}

/* ---------- Sub-Component: HandleInput ---------- */

interface HandleInputProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  placeholder: string;
  isEditing: boolean;
  onChange: (v: string) => void;
  stats?: any;
}
function HandleInput({ label, icon, value, placeholder, isEditing, onChange }: HandleInputProps) {
  return (
    <div className={`relative flex items-center gap-3 p-1 transition-all rounded-xl ${
      isEditing ? "bg-white/5 ring-1 ring-white/10" : ""
    }`}>
      {/* Platform Icon - Acts as the primary visual label */}
      <div className="flex-shrink-0 p-3 bg-white/5 rounded-lg border border-white/10">
        {icon}
      </div>

      <div className="flex-grow pr-3">
        {/* Tiny metadata label - stays out of the way */}
        <span className="block text-[9px] font-black uppercase tracking-tighter text-gray-500 mb-0.5">
          {label}
        </span>

        {isEditing ? (
          <input
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-transparent text-sm text-white outline-none placeholder-gray-700"
          />
        ) : (
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${value ? "text-gray-200" : "text-gray-600 italic"}`}>
              {value || "Not Linked"}
            </span>
            
            {/* Status indicator - only shows if linked */}
            {value && (
              <div className="w-1.5 h-1.5 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.8)]" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}