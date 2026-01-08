import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { 
  FiGithub, FiExternalLink, FiTarget, 
  FiTrendingUp, FiAward, FiMail 
} from "react-icons/fi";
import { SiLeetcode, SiCodeforces, SiCodechef } from "react-icons/si";

export default function PublicPortfolio() {
  const { username } = useParams();
  const [data, setData] = useState<any>(null);
  const [cfStats, setCfStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFullPortfolio = async () => {
      try {
        const portfolioRes = await api.get(`/api/portfolio/${username}`);
        setData(portfolioRes.data);
        if (portfolioRes.data.user.codeforcesHandle) {
          const statsRes = await api.get(`/api/stats/codeforces/${portfolioRes.data.user.codeforcesHandle}`);
          setCfStats(statsRes.data);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchFullPortfolio();
  }, [username]);

  if (loading) return <div className="min-h-screen bg-[#050508] flex items-center justify-center text-teal-500 font-bold uppercase tracking-widest">Showing portfolio...</div>;
  if (!data) return <div className="min-h-screen bg-[#050508] flex items-center justify-center text-white italic">User Not Found</div>;

  const { user, projects } = data;

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
    <div className="min-h-screen bg-[#050508] text-white pb-32 font-sans selection:bg-teal-500/30">
      
      {/* 1. PROFESSIONAL HEADER */}
      <header className="pt-20 pb-12 px-6 border-b border-white/5 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-8">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-tr from-teal-500 to-blue-500 rounded-2xl blur opacity-20" />
            <img 
              src={user.avatar?.url || `https://ui-avatars.com/api/?name=${user.username}&background=111&color=fff`} 
              className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl border border-white/10 object-cover shadow-2xl" 
            />
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
               <h1 className="text-3xl font-black tracking-tighter uppercase italic">@{user.username}</h1>
               <span className="px-2 py-0.5 bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[9px] font-black uppercase rounded tracking-wider">Verified Profile</span>
            </div>
            
            <div className="flex items-center gap-4 text-gray-400 text-sm font-medium italic">
               <span className="flex items-center gap-2"><FiMail className="text-teal-500/50" /> {user.email}</span>
               <span className="h-4 w-px bg-white/10 hidden md:block" />
               <span className="text-teal-500/80 font-bold uppercase tracking-widest text-[10px]">Portfolio Owner</span>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <HandleBadge icon={<FiGithub />} link={user.githubHandle} url="https://github.com/" />
              <HandleBadge icon={<SiLeetcode />} link={user.leetcodeHandle} url="https://leetcode.com/" />
              <HandleBadge icon={<SiCodeforces />} link={user.codeforcesHandle} url="https://codeforces.com/profile/" />
              <HandleBadge icon={<SiCodechef />} link={user.codechefHandle} url="https://www.codechef.com/users/" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-16 space-y-24">
        
        {/* 2. STATS SECTION */}
        {cfStats && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CompactStatCard label="Current Rating" value={cfStats.rating || "N/A"} icon={<FiTarget />} color = {getRankColor(cfStats.rank)} />
            <CompactStatCard label="Peak Rating" value={cfStats.maxRating || "N/A"} icon={<FiTrendingUp />} color="text-white-400" />
            <CompactStatCard label="Rank" value={cfStats.rank || "Unrated"} icon={<FiAward />} color = {getRankColor(cfStats.rank)} />
          </section>
        )}

        {/* 3. PROJECT SECTION */}
        <section className="space-y-40">
          {projects.map((project: any, index: number) => (
            <ProjectShowcase key={project._id} project={project} index={index} />
          ))}
        </section>
      </main>
    </div>
  );
}

/* --- COMPONENTS --- */

function HandleBadge({ icon, link, url }: any) {
  if (!link) return null;
  return (
    <a href={`${url}${link}`} target="_blank" className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-teal-400 hover:border-teal-500/30 transition-all">
      {icon}
    </a>
  );
}

function CompactStatCard({ label, value, icon, color }: any) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between group transition-all">
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">{label}</p>
        <p className={`text-2xl font-black tracking-tighter ${color}`}>{value}</p>
      </div>
      <div className="p-3 bg-white/5 rounded-xl text-gray-600 group-hover:text-teal-500 transition-colors">{icon}</div>
    </div>
  );
}

function ProjectShowcase({ project, index }: any) {
  const images = project.images || [];
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="space-y-12 pb-24 border-b border-white/5 last:border-0">
      {/* 1. Technical Info Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-4">
             <span className="text-teal-500/40 font-black italic text-xl">0{index + 1}</span>
             <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">{project.title}</h2>
             {project.featured && (
               <span className="px-2 py-1 bg-teal-500 text-black text-[9px] font-black uppercase tracking-widest">Featured Node</span>
             )}
          </div>
          <p className="text-gray-400 text-sm leading-relaxed font-medium italic opacity-90">{project.description}</p>
          <div className="flex flex-wrap gap-2 pt-1">
            {project.techStack.map((tech: string) => (
              <span key={tech} className="px-2.5 py-1 bg-white/5 border border-white/10 text-teal-400 text-[9px] font-bold uppercase italic tracking-tighter">
                {tech}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex gap-4">
          {project.githubLink && (
            <a href={project.githubLink} target="_blank" className="flex items-center gap-2 px-5 py-2.5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">
              <FiGithub size={14} /> Source Code
            </a>
          )}
          {project.liveLink && (
            <a href={project.liveLink} target="_blank" className="flex items-center gap-2 px-5 py-2.5 bg-teal-500 text-black text-[10px] font-black uppercase tracking-widest hover:bg-teal-400 transition-all shadow-lg shadow-teal-500/20">
              <FiExternalLink size={14} /> Live Deployment
            </a>
          )}
        </div>
      </div>

      {/* 2. Interactive Technical Gallery */}
      {images.length > 0 && (
        <div className="space-y-4">
          {/* Main Display Area - Focused on one image at a time */}
          <div className="w-full bg-zinc-900/40 border border-white/10 flex items-center justify-center h-[400px] md:h-[650px] overflow-hidden">
            <img 
              src={images[activeImage]?.url} 
              className="max-w-full max-h-full object-contain p-4 transition-all duration-500" 
              alt="Active technical view"
            />
          </div>

          {/* Filmstrip / Thumbnails - Only if more than 1 image */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((img: { url: string; publicId: string }, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`flex-shrink-0 w-24 h-16 md:w-32 md:h-20 bg-zinc-900 border transition-all ${
                    activeImage === i ? 'border-teal-500 opacity-100 scale-105' : 'border-white/10 opacity-50 hover:opacity-80'
                  }`}
                >
                  <img src={img.url} className="w-full h-full object-cover" alt={`Thumbnail ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}