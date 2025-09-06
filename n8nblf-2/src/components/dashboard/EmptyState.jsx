import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Palette, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function EmptyState() {
  return (
    <Card className="border-2 border-dashed border-gray-200 bg-gradient-to-br from-gray-50 to-white">
      <CardContent className="p-12 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" 
             style={{backgroundColor: 'var(--secondary-gray)'}}>
          <Palette className="w-10 h-10" style={{color: 'var(--primary-navy)'}} />
        </div>
        
        <h3 className="text-2xl font-bold mb-4" style={{color: 'var(--text-charcoal)'}}>
          Ready to Create Magic?
        </h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
          Start your first interior visualization project and watch empty rooms transform into dream homes
        </p>
        
        <div className="flex items-center justify-center gap-2 mb-6 text-sm text-gray-500">
          <Sparkles className="w-4 h-4" />
          <span>AI-powered • Professional results • Instant previews</span>
        </div>
        
        <Link to={createPageUrl("CreateProject")}>
          <Button className="px-8 py-3 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300" 
                  style={{backgroundColor: 'var(--primary-navy)'}}>
            <Plus className="w-5 h-5 mr-2" />
            Create Your First Project
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}