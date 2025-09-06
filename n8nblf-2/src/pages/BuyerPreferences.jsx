
import React, { useState, useEffect } from "react";
import { Project } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, User, Heart, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { generateImagesViaN8N } from "@/api/functions";

export default function BuyerPreferences() {
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [preferences, setPreferences] = useState({
    age: "",
    gender: "",
    income_bracket: "",
    lifestyle: "",
    color_palette: "",
    texture_preferences: [],
    furniture_style: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false); // New state for image generation

  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('project_id');

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) {
        navigate(createPageUrl("Dashboard"));
        return;
      }

      try {
        const projectData = await Project.filter({ id: projectId });
        if (projectData.length === 0) {
          navigate(createPageUrl("Dashboard"));
          return;
        }

        const project = projectData[0];
        setProject(project);
        
        if (project.buyer_preferences) {
          setPreferences(project.buyer_preferences);
        }
      } catch (error) {
        console.error("Error loading project:", error);
        navigate(createPageUrl("Dashboard"));
      }

      setIsLoading(false);
    };

    loadProject();
  }, [projectId, navigate]);

  const updatePreference = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateTexturePreferences = (texture, checked) => {
    setPreferences(prev => ({
      ...prev,
      texture_preferences: checked
        ? [...prev.texture_preferences, texture]
        : prev.texture_preferences.filter(t => t !== texture)
    }));
  };

  const handleContinue = async () => {
    setIsSaving(true);
    
    try {
      // Save the preferences first
      await Project.update(projectId, {
        buyer_preferences: preferences,
        status: "preferences_collected"
      });

      // Start generating images with n8n
      setIsGenerating(true);
      setIsSaving(false); // Clear saving state as we are now generating
      
      await generateImagesViaN8N({ projectId });
      
      // Navigate to project detail page when done
      navigate(createPageUrl("ProjectDetail", `id=${projectId}`));
    } catch (error) {
      console.error("Error saving preferences or generating images:", error);
      setIsSaving(false);
      setIsGenerating(false);
    }
  };

  const isFormComplete = preferences.age && preferences.gender && preferences.income_bracket &&
                        preferences.lifestyle && preferences.color_palette && preferences.furniture_style &&
                        preferences.texture_preferences.length > 0;

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-8 flex items-center justify-center">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" 
               style={{backgroundColor: 'var(--primary-navy)'}}>
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-transparent" />
          </div>
          <h1 className="text-3xl font-bold mb-4" style={{color: 'var(--text-charcoal)'}}>
            Creating Your Visualization
          </h1>
          <p className="text-gray-600 mb-8">
            Our AI is analyzing {project?.buyer_name}'s preferences and generating stunning room designs. This may take a few minutes.
          </p>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span>Processing with n8n workflow...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("UploadPhotos", `project_id=${projectId}`))}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold" style={{color: 'var(--text-charcoal)'}}>
              Buyer Preferences
            </h1>
            <p className="text-gray-600 mt-1">{project?.buyer_name}'s Design Profile</p>
          </div>
        </div>

        {/* Form Cards */}
        <div className="space-y-6">
          {/* Personal Information */}
          <Card className="border-none shadow-xl">
            <CardHeader className="p-6">
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" 
                     style={{backgroundColor: 'var(--primary-navy)'}}>
                  <User className="w-5 h-5 text-white" />
                </div>
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold mb-2 block" style={{color: 'var(--text-charcoal)'}}>
                    Age Range
                  </label>
                  <Select value={preferences.age} onValueChange={(value) => updatePreference('age', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select age range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="18-25">18-25</SelectItem>
                      <SelectItem value="26-35">26-35</SelectItem>
                      <SelectItem value="36-45">36-45</SelectItem>
                      <SelectItem value="46-55">46-55</SelectItem>
                      <SelectItem value="56+">56+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block" style={{color: 'var(--text-charcoal)'}}>
                    Gender
                  </label>
                  <Select value={preferences.gender} onValueChange={(value) => updatePreference('gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="non-binary">Non-binary</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block" style={{color: 'var(--text-charcoal)'}}>
                    Income Bracket
                  </label>
                  <Select value={preferences.income_bracket} onValueChange={(value) => updatePreference('income_bracket', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select income bracket" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High ($100K+)</SelectItem>
                      <SelectItem value="medium">Medium ($50K-$100K)</SelectItem>
                      <SelectItem value="low">Low (Under $50K)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block" style={{color: 'var(--text-charcoal)'}}>
                    Lifestyle Preference
                  </label>
                  <Select value={preferences.lifestyle} onValueChange={(value) => updatePreference('lifestyle', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select lifestyle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="city">Urban/City Life</SelectItem>
                      <SelectItem value="countryside">Countryside/Rural</SelectItem>
                      <SelectItem value="formal">Formal/Professional</SelectItem>
                      <SelectItem value="relaxed">Relaxed/Casual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Design Preferences */}
          <Card className="border-none shadow-xl">
            <CardHeader className="p-6">
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" 
                     style={{backgroundColor: 'var(--accent-gold)'}}>
                  <Palette className="w-5 h-5 text-white" />
                </div>
                Design Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="space-y-6">
                {/* Color Palette */}
                <div>
                  <label className="text-sm font-semibold mb-3 block" style={{color: 'var(--text-charcoal)'}}>
                    Preferred Color Palette
                  </label>
                  <Select value={preferences.color_palette} onValueChange={(value) => updatePreference('color_palette', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select color preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light_airy">Light & Airy</SelectItem>
                      <SelectItem value="moody">Moody & Dark</SelectItem>
                      <SelectItem value="natural">Natural & Earthy</SelectItem>
                      <SelectItem value="neutral">Neutral & Minimal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Texture Preferences */}
                <div>
                  <label className="text-sm font-semibold mb-3 block" style={{color: 'var(--text-charcoal)'}}>
                    Texture Preferences (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {["wood", "metal", "fabric", "minimal_surfaces"].map((texture) => (
                      <div key={texture} className="flex items-center space-x-2">
                        <Checkbox
                          id={texture}
                          checked={preferences.texture_preferences.includes(texture)}
                          onCheckedChange={(checked) => updateTexturePreferences(texture, checked)}
                        />
                        <label htmlFor={texture} className="text-sm font-medium">
                          {texture.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Furniture Style */}
                <div>
                  <label className="text-sm font-semibold mb-3 block" style={{color: 'var(--text-charcoal)'}}>
                    Furniture Style
                  </label>
                  <Select value={preferences.furniture_style} onValueChange={(value) => updatePreference('furniture_style', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select furniture style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sleek">Sleek & Modern</SelectItem>
                      <SelectItem value="ornate">Ornate & Decorative</SelectItem>
                      <SelectItem value="vintage">Vintage & Classic</SelectItem>
                      <SelectItem value="functional">Functional & Simple</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Continue Button */}
        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleContinue}
            disabled={!isFormComplete || isSaving}
            className="px-8 py-3 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            style={{backgroundColor: 'var(--primary-navy)'}}
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Saving Preferences...
              </>
            ) : (
              <>
                Generate Visualization
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
