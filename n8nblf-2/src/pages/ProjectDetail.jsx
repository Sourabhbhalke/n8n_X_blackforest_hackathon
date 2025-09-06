
import React, { useState, useEffect, useCallback } from "react";
import { Project, Room } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle }
  from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, User, Calendar, Home, Palette, RefreshCcw, Eye, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import { generatePdfReport } from "@/api/functions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const styleNames = {
  scandinavian: "Scandinavian",
  modern_minimalist: "Modern Minimalist",
  japandi: "Japandi",
  industrial_loft: "Industrial Loft",
  classic_elegance: "Classic Elegance",
  bohemian_chic: "Bohemian Chic",
  urban_contemporary: "Urban Contemporary",
  coastal_retreat: "Coastal Retreat",
  mid_century_modern: "Mid-Century Modern"
};

// Helper function to display style name
const getStyleDisplayName = (style) => {
  if (!style) return "Not detected yet";

  // First try exact match
  if (styleNames[style]) return styleNames[style];

  // Try lowercase match
  const lowerStyle = style.toLowerCase();
  if (styleNames[lowerStyle]) return styleNames[lowerStyle];

  // Try with underscores replaced by spaces
  const normalizedStyle = lowerStyle.replace(/ /g, '_');
  if (styleNames[normalizedStyle]) return styleNames[normalizedStyle];

  // If no match, return the original style with proper formatting
  return style.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export default function ProjectDetail() {
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');

  const loadData = useCallback(async () => {
    if (!projectId) {
      navigate(createPageUrl("Dashboard"));
      return;
    }
    setIsLoading(true);
    try {
      const [projectData, roomsData] = await Promise.all([
        Project.filter({ id: projectId }),
        Room.filter({ project_id: projectId }),
      ]);

      if (projectData.length === 0) {
        navigate(createPageUrl("Dashboard"));
        return;
      }
      setProject(projectData[0]);
      setRooms(roomsData);
    } catch (error) {
      console.error("Error loading project details:", error);
    }
    setIsLoading(false);
  }, [projectId, navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCompleteProject = async () => {
    if (!project) return;
    await Project.update(project.id, { status: 'completed' });
    loadData();
  };

  const handleDownloadPdf = async () => {
    if (!project) return;
    setIsDownloading(true);
    try {
      const response = await generatePdfReport({ projectId: project.id });
      // The function returns a raw response, we need to get the ArrayBuffer
      const data = await response.data;

      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.unit_name.replace(/ /g, '_')}_Visualization.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
    setIsDownloading(false);
  };

  if (isLoading) {
    return <div className="p-8">Loading project details...</div>;
  }

  if (!project) {
    return <div className="p-8">Project not found.</div>;
  }

  const isGenerated = project.status === 'images_generated' || project.status === 'completed';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(createPageUrl("Dashboard"))}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold" style={{ color: 'var(--text-charcoal)' }}>{project.unit_name}</h1>
              <p className="text-gray-600 mt-1">Visualization for {project.buyer_name}</p>
            </div>
          </div>
          <div className="flex gap-3">
            {isGenerated && project.status !== 'completed' && (
              <Button onClick={handleCompleteProject} className="bg-green-600 hover:bg-green-700 text-white">
                Mark as Complete
              </Button>
            )}
            {project.status === 'completed' && (
              <Button
                onClick={handleDownloadPdf}
                disabled={isDownloading}
                className="text-white"
                style={{ backgroundColor: 'var(--accent-gold)' }}
              >
                {isDownloading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download Brochure
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Project Info */}
        <Card className="mb-8 border-none shadow-lg">
          <CardContent className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            <InfoItem icon={User} label="Buyer" value={project.buyer_name} />
            <InfoItem icon={Calendar} label="Created" value={format(new Date(project.created_date), "MMM d, yyyy")} />
            <InfoItem icon={Home} label="Status" value={<Badge className={`text-xs font-medium ${project.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{project.status.replace(/_/g, ' ')}</Badge>} />
            <InfoItem icon={Palette} label="Style" value={getStyleDisplayName(project.detected_style)} />
          </CardContent>
        </Card>

        {/* Image Gallery */}
        <div className="space-y-8">
          {rooms.map((room) => (
            <Card key={room.id} className="border-none shadow-xl">
              <CardHeader className="p-6">
                <CardTitle className="text-xl font-bold" style={{ color: 'var(--text-charcoal)' }}>{room.room_name}</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="grid md:grid-cols-2 gap-6">
                  <ImageCard title="Before" imageUrl={room.original_photo_url} />
                  {isGenerated ? (
                    <ImageCard title="After" imageUrl={room.styled_photo_url} isAfter />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full bg-gray-100 rounded-lg p-8 text-center">
                      <p className="font-semibold text-lg text-gray-700 mb-4">Awaiting Image Generation</p>
                      <p className="text-gray-500 mb-6">Complete the preferences step to generate the styled image.</p>
                      <Button onClick={() => navigate(createPageUrl("BuyerPreferences", `project_id=${projectId}`))}>
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Go to Buyer Preferences
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

const InfoItem = ({ icon: Icon, label, value }) => (
  <div>
    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </div>
    <div className="font-semibold text-base" style={{ color: 'var(--text-charcoal)' }}>{value}</div>
  </div>
);

const ImageCard = ({ title, imageUrl, isAfter = false }) => (
  <div>
    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
      {isAfter && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent-gold)' }} />}
      {title}
    </h3>
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative group cursor-pointer aspect-video bg-gray-100 rounded-xl overflow-hidden">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Eye className="w-8 h-8 text-white" />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl p-0">
        <img src={imageUrl} alt={title} className="w-full h-auto rounded-lg" />
      </DialogContent>
    </Dialog>
  </div>
);
