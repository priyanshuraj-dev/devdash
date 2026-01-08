import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, } from "react-icons/fi";

export default function Explore() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/portfolio/${search.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white pt-20 px-4">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <h1 className="text-5xl font-black tracking-tighter uppercase italic">
          Explore <span className="text-teal-500">Talent</span>
        </h1>
        <p className="text-gray-500 font-medium italic">
          Enter a username to discover their tech stack and projects.
        </p>

        <form onSubmit={handleSearch} className="relative group max-w-xl mx-auto">
          <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-teal-500 transition-colors" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by username (e.g., priyanshuraj)"
            className="w-full pl-14 pr-32 py-5 bg-white/5 border border-white/10 rounded-[2rem] outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all text-lg"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-teal-500 text-black font-black uppercase text-xs tracking-widest rounded-full hover:bg-teal-400 transition-all"
          >
            Inspect
          </button>
        </form>
      </div>
    </div>
  );
}