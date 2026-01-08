import CodingHandles from "../components/CodingHandles";
import { useContext } from "react";
import Header from "../components/Header";
import ProfileCard from "../components/ProfileCard";
import CodeforcesStats from "../components/CodeforcesStats";
import ProjectsSection from "../components/ProjectSection";
import { AuthContext } from "../context/AuthContext";
import { getMeWithRefresh } from "../utils/authFetch";
export default function Dashboard() {
  const { user, loading, setUser } = useContext(AuthContext);

  const reloadUser = async () => {
    const res = await getMeWithRefresh();
    setUser(res.data.user);
  };

  if (loading) {
    return <div >Loading…</div>;
  }
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-20 ">
      <Header />
      {/* Unified Container for Perfect Alignment */}
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        <ProfileCard user={user} onAvatarUpdated={reloadUser} />
        <div className="grid grid-cols-1 gap-6">
           <CodingHandles user={user} onUpdated={reloadUser} />
           <CodeforcesStats handle={user?.codeforcesHandle} />
        </div>
        <ProjectsSection />
      </div>
    </div>
  );
}
