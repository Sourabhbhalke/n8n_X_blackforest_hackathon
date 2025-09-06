
import React, { useState, useEffect } from "react";
import { Project } from "@/api/entities";
import { Room } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, Camera, Trash2, Eye, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function UploadPhotos() {
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingIndex, setUploadingIndex] = useState(null);

  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('project_id');

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) {
        navigate(createPageUrl("Dashboard"));
        return;
      }

      try {
        const [projectData, roomsData] = await Promise.all([
          Project.filter({ id: projectId }),
          Room.filter({ project_id: projectId })
        ]);

        if (projectData.length === 0) {
          navigate(createPageUrl("Dashboard"));
          return;
        }

        setProject(projectData[0]);
        setRooms(roomsData);
      } catch (error) {
        console.error("Error loading project:", error);
        navigate(createPageUrl("Dashboard"));
      }

      setIsLoading(false);
    };

    loadProject();
  }, [projectId, navigate]);

  const addRoom = () => {
    setRooms(prev => [...prev, {
      room_name: "",
      room_type: "",
      original_photo_url: "",
      isNew: true
    }]);
  };

  const removeRoom = async (index) => {
    const room = rooms[index];
    if (room.id) {
      await Room.delete(room.id);
    }
    setRooms(prev => prev.filter((_, i) => i !== index));
  };

  const updateRoom = (index, field, value) => {
    setRooms(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleFileUpload = async (index, file) => {
    setUploadingIndex(index);
    try {
      const { file_url } = await UploadFile({ file });
      updateRoom(index, 'original_photo_url', file_url);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    setUploadingIndex(null);
  };

  const saveRoom = async (index) => {
    const room = rooms[index];
    if (room.isNew && room.room_name && room.room_type) {
      try {
        const savedRoom = await Room.create({
          project_id: projectId,
          room_name: room.room_name,
          room_type: room.room_type,
          original_photo_url: room.original_photo_url || ""
        });
        updateRoom(index, 'id', savedRoom.id);
        updateRoom(index, 'isNew', false);
      } catch (error) {
        console.error("Error saving room:", error);
      }
    } else if (!room.isNew && room.id) {
      try {
        await Room.update(room.id, {
          room_name: room.room_name,
          room_type: room.room_type,
          original_photo_url: room.original_photo_url || ""
        });
      } catch (error) {
        console.error("Error updating room:", error);
      }
    }
  };

  const handleContinue = async () => {
    // Save all rooms before continuing
    await Promise.all(rooms.map((_, index) => saveRoom(index)));
    
    // Update project status
    await Project.update(projectId, { status: "photos_uploaded" });
    
    navigate(createPageUrl("BuyerPreferences", `project_id=${projectId}`));
  };

  const canContinue = rooms.length >= 1 && rooms.every(room => room.room_name && room.room_type);

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
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
              Upload Room Photos
            </h1>
            <p className="text-gray-600 mt-1">{project?.unit_name}</p>
          </div>
        </div>

        {/* Instructions */}
        <Card className="mb-8 border-none shadow-lg" style={{backgroundColor: 'var(--secondary-gray)'}}>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3" style={{color: 'var(--text-charcoal)'}}>
              Photo Guidelines for Best Results
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>• Upload 1 or more empty room photos</div>
              <div>• Ensure good lighting and clear view</div>
              <div>• Include full room perspective</div>
            </div>
          </CardContent>
        </Card>

        {/* Rooms */}
        <div className="space-y-6">
          {rooms.map((room, index) => (
            <Card key={index} className="border-none shadow-xl">
              <CardHeader className="p-6 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Room {index + 1}</CardTitle>
                  {rooms.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRoom(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Room Details */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold mb-2 block" style={{color: 'var(--text-charcoal)'}}>
                        Room Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Master Bedroom"
                        value={room.room_name}
                        onChange={(e) => updateRoom(index, 'room_name', e.target.value)}
                        onBlur={() => saveRoom(index)}
                        className="w-full h-10 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-semibold mb-2 block" style={{color: 'var(--text-charcoal)'}}>
                        Room Type
                      </label>
                      <Select
                        value={room.room_type}
                        onValueChange={(value) => {
                          updateRoom(index, 'room_type', value);
                          setTimeout(() => saveRoom(index), 100);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select room type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="living_room">Living Room</SelectItem>
                          <SelectItem value="bedroom">Bedroom</SelectItem>
                          <SelectItem value="kitchen">Kitchen</SelectItem>
                          <SelectItem value="bathroom">Bathroom</SelectItem>
                          <SelectItem value="dining_room">Dining Room</SelectItem>
                          <SelectItem value="home_office">Home Office</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Photo Upload */}
                  <div>
                    <label className="text-sm font-semibold mb-2 block" style={{color: 'var(--text-charcoal)'}}>
                      Room Photo
                    </label>
                    {room.original_photo_url ? (
                      <div className="space-y-3">
                        <div className="relative group">
                          <img
                            src={room.original_photo_url}
                            alt={room.room_name}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                            <a
                              href={room.original_photo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white hover:text-gray-300"
                            >
                              <Eye className="w-6 h-6" />
                            </a>
                          </div>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(index, e.target.files[0])}
                          className="hidden"
                          id={`photo-${index}`}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById(`photo-${index}`).click()}
                          disabled={uploadingIndex === index}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Replace Photo
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(index, e.target.files[0])}
                          className="hidden"
                          id={`photo-${index}`}
                        />
                        <div
                          onClick={() => document.getElementById(`photo-${index}`).click()}
                          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors duration-200"
                        >
                          {uploadingIndex === index ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2" />
                          ) : (
                            <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          )}
                          <p className="text-sm text-gray-600">
                            {uploadingIndex === index ? "Uploading..." : "Click to upload photo"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add Room Button */}
          <Card className="border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors duration-200">
            <CardContent className="p-8 text-center">
              <Button
                variant="outline"
                onClick={addRoom}
                className="px-6 py-3"
              >
                <Upload className="w-5 h-5 mr-2" />
                Add Another Room
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                Add up to 5 rooms for comprehensive visualization
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Continue Button */}
        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleContinue}
            disabled={!canContinue}
            className="px-8 py-3 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            style={{backgroundColor: 'var(--primary-navy)'}}
          >
            Continue to Preferences
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
