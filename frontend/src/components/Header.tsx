import api from "../services/api";
import toast from "react-hot-toast";
import { FiLogOut, FiLayout } from "react-icons/fi";

export default function Header() {
  const handleLogout = async () => {
    try {
      // Axios interceptor will handle token refresh if needed, 
      // but logout should ideally clear the session
      await api.post("/api/auth/logout");
      toast.success("Signed out successfully");
      window.location.href = "/login";
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <header className="relative z-50 mb-12 py-4">
      {/* Decorative Glow behind the logo */}
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-teal-500/10 blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto flex justify-between items-center px-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/5 border border-white/10 rounded-2xl shadow-inner">
            <FiLayout className="text-teal-500 text-2xl" />
          </div>
          
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">
              Dev<span className="text-teal-500">Dash</span>
            </h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-1 ml-0.5">
              Control Center v1.0
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="group flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all duration-300 rounded-xl font-bold text-sm tracking-tight shadow-lg shadow-black/20"
        >
          <span>Sign Out</span>
          <FiLogOut className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
      
      {/* Subtle bottom separator */}
      <div className="max-w-6xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mt-8" />
    </header>
  );
}