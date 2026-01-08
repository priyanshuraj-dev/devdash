import { useEffect, useState } from "react";
import api from "../services/api";
import { FiTrendingUp, FiAward, FiTarget, FiLoader } from "react-icons/fi";
import { SiCodeforces } from "react-icons/si";

interface CodeforcesStatsProps {
  handle?: string;
}

interface Stats {
  rating: number;
  maxRating: number;
  rank: string;
}

export default function CodeforcesStats({ handle }: CodeforcesStatsProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!handle) {
      setStats(null);
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/api/stats/codeforces/${handle}`);
        setStats(res.data);
      } catch {
        setError("Unable to sync Codeforces data");
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [handle]);

  if (!handle) return null;

  // Helper to determine color based on CF Rank
  const getRankColor = (rank: string) => {
    const r = rank.toLowerCase();
    if (r.includes("grandmaster")) return "text-red-500";
    if (r.includes("master")) return "text-orange-400";
    if (r.includes("candidate")) return "text-violet-400";
    if (r.includes("expert")) return "text-blue-400";
    if (r.includes("specialist")) return "text-cyan-400";
    if (r.includes("pupil")) return "text-green-400";
    return "text-gray-400";
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 overflow-hidden relative">
      {/* Background Icon Decoration */}
      <SiCodeforces className="absolute -right-4 -bottom-4 text-white/[0.03] text-9xl rotate-12" />

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <SiCodeforces className="text-blue-400 text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Codeforces Insights</h2>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">Handle: {handle}</p>
          </div>
        </div>

        {loading && (
          <FiLoader className="text-teal-500 animate-spin" size={20} />
        )}
      </div>

      {error ? (
        <div className="py-6 px-4 rounded-2xl bg-red-500/5 border border-red-500/20 text-center">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
          <StatCard
            label="Current Rating"
            value={stats.rating}
            icon={<FiTarget className="text-teal-400" />}
            colorClass={getRankColor(stats.rank)}
          />
          <StatCard
            label="Peak Rating"
            value={stats.maxRating}
            icon={<FiTrendingUp className="text-orange-400" />}
          />
          <StatCard
            label="Global Rank"
            value={stats.rank}
            icon={<FiAward className="text-blue-400" />}
            capitalize
            colorClass={getRankColor(stats.rank)}
          />
        </div>
      ) : (
        <p className="text-gray-600 italic text-sm text-center py-6">Waiting for synchronization...</p>
      )}
    </div>
  );
}

/* ---------- Refined Stat Card ---------- */

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  capitalize?: boolean;
  colorClass?: string;
}

function StatCard({ label, value, icon, capitalize, colorClass }: StatCardProps) {
  return (
    <div className="group bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/[0.08] transition-all duration-300">
      <div className="flex items-center gap-2 mb-3">
        <span className="p-1.5 bg-white/5 rounded-md border border-white/5 group-hover:scale-110 transition-transform">
          {icon}
        </span>
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
          {label}
        </p>
      </div>
      <p className={`text-2xl font-black tracking-tight ${colorClass || "text-white"} ${capitalize ? "capitalize" : ""}`}>
        {value}
      </p>
    </div>
  );
}