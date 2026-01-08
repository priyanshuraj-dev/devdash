import { Link } from "react-router-dom";
import { FiArrowRight, FiActivity, FiUser, FiSearch } from "react-icons/fi";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const { user, loading } = useContext(AuthContext);
  return (
    <div className="min-h-screen bg-[#050508] text-white relative overflow-hidden font-sans">
      
      {/* Background Decorative Glows */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px]" />

      {/* Navbar */}
      <header className="relative z-50 border-b border-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiActivity className="text-teal-500 text-2xl" />
            <h1 className="text-2xl font-black tracking-tighter uppercase italic">
              Dev<span className="text-teal-500">Dash</span>
            </h1>
          </div>

          <nav className="flex items-center gap-4 sm:gap-8">
            <Link to="/explore" className="text-sm font-bold text-gray-400 hover:text-teal-400 transition-colors flex items-center gap-2">
              <FiSearch size={16} /> Explore
            </Link>

            {!loading && (
              user ? (
                // LOGGED IN STATE
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-teal-500/50 transition-all group"
                  >
                  <FiUser className="text-teal-500" />
                  <span className="text-sm font-bold tracking-tight">@{user.username}</span>
                  <FiArrowRight className="text-gray-500 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                // LOGGED OUT STATE
                <div className="flex items-center gap-4">
                  <Link to="/login" className="text-sm font-bold text-gray-400 hover:text-white transition">
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 transition font-black text-black text-xs uppercase tracking-widest shadow-lg shadow-teal-500/20"
                  >
                    Join
                  </Link>
                </div>
              )
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-32 md:py-48 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            Live Networking for Developers
          </div>

          <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase italic mb-8">
            Showcase your <br />
            <span className="text-teal-500">digital DNA.</span>
          </h2>

          <p className="max-w-2xl text-gray-500 text-lg md:text-xl font-medium leading-relaxed mb-12">
            Build a professional portfolio that syncs with your real-world progress. 
            Connect GitHub, Codeforces, and LeetCode in one unified command center.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <Link
              to={user ? "/dashboard" : "/signup"}
              className="px-10 py-4 rounded-2xl bg-teal-500 hover:bg-teal-400 transition font-black text-black uppercase tracking-widest shadow-2xl shadow-teal-500/40 flex items-center gap-3 group"
            >
              {user ? "Go to Console" : "Initialize Profile"}
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              to="/explore"
              className="px-10 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition font-black text-white uppercase tracking-widest"
            >
              Explore Network
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <FeatureCard 
            title="Unified Identity" 
            desc="Merge your GitHub activity with competitive programming stats into one sleek interface." 
          />
          <FeatureCard 
            title="Project Showcase" 
            desc="Highlight your best work with deep links, tech stacks, and high-fidelity image galleries." 
          />
          <FeatureCard 
            title="Verified Access" 
            desc="Secure authentication with email verification ensures every developer on the platform is real." 
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <FiActivity className="text-teal-500" />
            <span className="font-black tracking-tighter uppercase italic">DevDash</span>
          </div>
          <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
            © {new Date().getFullYear()} Built with MERN & Cloudinary 
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:border-teal-500/30 transition-all group">
      <div className="w-10 h-1 bg-teal-500/50 group-hover:w-full transition-all duration-500 mb-6 rounded-full" />
      <h3 className="text-xl font-black text-white uppercase tracking-tight mb-4 italic">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed font-medium">{desc}</p>
    </div>
  );
}