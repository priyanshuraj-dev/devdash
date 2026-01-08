import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

import { FiCamera, FiUploadCloud } from "react-icons/fi";

interface UploadImageProps {
  currentAvatar?: string;
  label?: string;
  onUploadSuccess: (file: { url: string; publicId: string }) => void;
}

export default function UploadImage({
  currentAvatar,
  onUploadSuccess,
}: UploadImageProps) {
  
  // to use .click(), .value, .files, .focus() we need a direct reference to that DOM object
  // react does not give us dom access by default for file input
  // websites must not choose files for user like <input type="file" value="C:\secret.png" />
  // so only way to open file picker is input.click() with the help of useRef
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!selected.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }
    setFile(selected);
    // this URL.createObjectURL creates a temporary local url that points to a file , so browser can previow or use it without uploading it anywhere
    setPreview(URL.createObjectURL(selected));
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select an image first");
      return;
    }
    // bcz files can't be passed in json format or params , so it is passed as FormData
    const formData = new FormData();
    formData.append("images", file);

    try {
      setLoading(true);
      const res = await api.post("/api/media/upload", formData);
      const uploaded = res.data?.files?.[0];
      if (!uploaded?.url || !uploaded?.publicId) throw new Error("Invalid response");
      
      onUploadSuccess(uploaded);
      setFile(null);
      setPreview(null);
    } catch (err: any) {
      if (err?.response?.status === 401) {
        try {
          await api.post("/api/auth/refresh");
          const res = await api.post("/api/media/upload", formData);
          // to get the first uploaded image only
          const uploaded = res.data?.files?.[0];
          onUploadSuccess(uploaded);
          setFile(null);
          setPreview(null);
          return;
        } catch (error) {
          // handle
        }
      }
      toast.error("Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        className="relative group cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-teal-500/50 transition-all duration-300 shadow-xl">
          {preview || currentAvatar ? (
            <img src={preview || currentAvatar} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-white/5 flex items-center justify-center text-gray-500">
              <FiCamera size={24} />
            </div>
          )}
        </div>
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <FiCamera className="text-white text-xl" />
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        hidden
        accept="image/*"
        onChange={handleChange}
      />

      {file && (
        <button
          onClick={handleUpload}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-black text-xs font-bold uppercase tracking-wider rounded-full transition-all disabled:opacity-50 shadow-lg shadow-teal-500/20"
        >
          <FiUploadCloud /> {loading ? "Uploading..." : "Confirm Upload"}
        </button>
      )}
    </div>
  );
}