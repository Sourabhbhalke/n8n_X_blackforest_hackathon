import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  photos_uploaded: "bg-blue-100 text-blue-800",
  preferences_collected: "bg-purple-100 text-purple-800",
  style_matched: "bg-orange-100 text-orange-800",
  images_generated: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800"
};

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

export default function ProjectCard({ project, onUpdate }) {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-none shadow-lg">
      <CardHeader className="p-6">
        <div className="flex justify-between items-start mb-3">
          <CardTitle className="text-lg font-bold line-clamp-2" style={{color: 'var(--text-charcoal)'}}>
            {project.unit_name}
          </CardTitle>
          <Badge className={`${statusColors[project.status]} border-0 text-xs font-medium`}>
            {project.status.replace(/_/g, ' ').toUpperCase()}
          </Badge>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{project.buyer_name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(project.created_date), "MMM d, yyyy")}</span>
          </div>
          {project.detected_style && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{backgroundColor: 'var(--accent-gold)'}} />
              <span className="font-medium">{styleNames[project.detected_style]}</span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-6 pt-0">
        <div className="flex gap-2">
          <Link to={createPageUrl("ProjectDetail", `id=${project.id}`)} className="flex-1">
            <Button variant="outline" className="w-full group-hover:border-blue-500 transition-colors duration-300">
              <Eye className="w-4 h-4 mr-2" />
              View
            </Button>
          </Link>
          {project.status === 'completed' && (
            <Button className="text-white" style={{backgroundColor: 'var(--accent-gold)'}}>
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}