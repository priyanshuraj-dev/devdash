import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import AddProject from "./AddProject";
import ProjectCard from "./ProjectCard";

interface Project {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  images: { url: string; publicId: string }[];
  githubLink?: string;
  liveLink?: string;
  featured: boolean;
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    try {
      const res = await api.get("/api/projects/me");
      setProjects(res.data.projects);
    } catch (err: any) {
      if (err?.response?.status === 401) {
        try {
          await api.post("/api/auth/refresh");
          const res = await api.get("/api/projects/me");
          setProjects(res.data.projects);
          return;
        } catch {
          window.location.href = "/login";
          return;
        }
      }
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const deleteProject = async (id: string) => {
    if (!confirm("Delete this project?")) return;

    try {
      await api.delete(`/api/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p._id !== id));
      toast.success("Project deleted");
    } catch (err: any) {
      if (err?.response?.status === 401) {
        try {
          await api.post("/api/auth/refresh");
          await api.delete(`/api/projects/${id}`);
          setProjects((prev) => prev.filter((p) => p._id !== id));
          toast.success("Project deleted");
          return;
        } catch {
          window.location.href = "/login";
          return;
        }
      }
      toast.error("Failed to delete project");
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-12 space-y-8">

      {/* ADD PROJECT */}
      <AddProject onProjectAdded={loadProjects} />

      {/* LIST */}
      <h2 className="text-2xl font-semibold">
        Your projects
      </h2>

      {loading ? (
        <p className="text-gray-400">Loading projects…</p>
      ) : projects.length === 0 ? (
        <p className="text-gray-400">
          No projects added yet
        </p>
      ) : (
        <div className="space-y-6">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onUpdated={loadProjects}
              onDelete={deleteProject}
            />
          ))}
        </div>
      )}
    </div>
  );
}
