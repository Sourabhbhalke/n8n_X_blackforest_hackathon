import React, { useState } from "react";
import { Project } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Building, User, Briefcase, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function CreateProject() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    unit_name: "",
    buyer_name: "",
    agent_name: "",
    company_name: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const project = await Project.create({
        ...formData,
        status: "draft"
      });
      
      navigate(createPageUrl("UploadPhotos", `project_id=${project.id}`));
    } catch (error) {
      console.error("Error creating project:", error);
    }
    
    setIsLoading(false);
  };

  const isFormValid = formData.unit_name && formData.buyer_name && formData.agent_name;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Dashboard"))}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold" style={{color: 'var(--text-charcoal)'}}>
              Create New Project
            </h1>
            <p className="text-gray-600 mt-1">Set up your interior visualization project</p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="border-none shadow-xl">
          <CardHeader className="p-8 pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" 
                   style={{backgroundColor: 'var(--primary-navy)'}}>
                <Building className="w-5 h-5 text-white" />
              </div>
              Project Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Unit Name */}
              <div className="space-y-2">
                <Label htmlFor="unit_name" className="text-sm font-semibold" style={{color: 'var(--text-charcoal)'}}>
                  Property Address or Unit Name *
                </Label>
                <Input
                  id="unit_name"
                  placeholder="e.g., 123 Park Avenue, Apt 4B"
                  value={formData.unit_name}
                  onChange={(e) => handleInputChange('unit_name', e.target.value)}
                  className="h-12 text-base"
                  required
                />
              </div>

              {/* Buyer Name */}
              <div className="space-y-2">
                <Label htmlFor="buyer_name" className="text-sm font-semibold" style={{color: 'var(--text-charcoal)'}}>
                  Buyer's Name *
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="buyer_name"
                    placeholder="e.g., Sarah Johnson"
                    value={formData.buyer_name}
                    onChange={(e) => handleInputChange('buyer_name', e.target.value)}
                    className="h-12 text-base pl-10"
                    required
                  />
                </div>
              </div>

              {/* Agent Name */}
              <div className="space-y-2">
                <Label htmlFor="agent_name" className="text-sm font-semibold" style={{color: 'var(--text-charcoal)'}}>
                  Agent/Developer Name *
                </Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="agent_name"
                    placeholder="e.g., John Smith"
                    value={formData.agent_name}
                    onChange={(e) => handleInputChange('agent_name', e.target.value)}
                    className="h-12 text-base pl-10"
                    required
                  />
                </div>
              </div>

              {/* Company Name */}
              <div className="space-y-2">
                <Label htmlFor="company_name" className="text-sm font-semibold" style={{color: 'var(--text-charcoal)'}}>
                  Company Name
                </Label>
                <Input
                  id="company_name"
                  placeholder="e.g., Elite Realty Group (Optional)"
                  value={formData.company_name}
                  onChange={(e) => handleInputChange('company_name', e.target.value)}
                  className="h-12 text-base"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={!isFormValid || isLoading}
                  className="w-full h-12 text-base font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{backgroundColor: 'var(--primary-navy)'}}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Creating Project...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 mr-2" />
                      Continue to Photo Upload
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 border-none shadow-lg" style={{backgroundColor: 'var(--secondary-gray)'}}>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2" style={{color: 'var(--text-charcoal)'}}>
              What happens next?
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Upload 2-3 photos of empty rooms</li>
              <li>• Collect buyer's design preferences</li>
              <li>• AI will match the perfect interior style</li>
              <li>• Generate stunning visualizations automatically</li>
              <li>• Export professional PDF brochure</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}