import React, { useState, useEffect } from "react";
import { Project } from "@/api/entities";
import { Room } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Plus, 
  Eye, 
  Download, 
  Calendar,
  Palette,
  Home,
  TrendingUp,
  Clock
} from "lucide-react";
import { format } from "date-fns";

import StatsOverview from "../components/dashboard/StatsOverview";
import ProjectCard from "../components/dashboard/ProjectCard";
import EmptyState from "../components/dashboard/EmptyState";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [projectsData, roomsData] = await Promise.all([
        Project.list("-created_date"),
        Room.list("-created_date")
      ]);
      setProjects(projectsData);
      setRooms(roomsData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const getProjectStats = () => {
    const total = projects.length;
    const completed = projects.filter(p => p.status === 'completed').length;
    const inProgress = projects.filter(p => p.status !== 'completed' && p.status !== 'draft').length;
    const totalRooms = rooms.length;
    
    return { total, completed, inProgress, totalRooms };
  };

  const stats = getProjectStats();

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-bold mb-3" style={{color: 'var(--text-charcoal)'}}>
              Welcome Back
            </h1>
            <p className="text-gray-600 text-lg">
              Create stunning interior visualizations that sell apartments faster
            </p>
          </div>
          <Link to={createPageUrl("CreateProject")}>
            <Button className="px-8 py-3 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300" 
                    style={{backgroundColor: 'var(--primary-navy)'}}>
              <Plus className="w-5 h-5 mr-2" />
              New Project
            </Button>
          </Link>
        </div>

        {/* Stats Overview */}
        <StatsOverview stats={stats} />

        {/* Projects Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold" style={{color: 'var(--text-charcoal)'}}>
              Recent Projects
            </h2>
            {projects.length > 0 && (
              <Button variant="outline" className="text-sm">
                View All Projects
              </Button>
            )}
          </div>

          {projects.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.slice(0, 6).map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onUpdate={loadData}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}