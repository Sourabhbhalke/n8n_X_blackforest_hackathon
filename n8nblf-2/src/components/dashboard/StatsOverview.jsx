import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, CheckCircle, Clock, Palette } from "lucide-react";

export default function StatsOverview({ stats }) {
  const statCards = [
    {
      title: "Total Projects",
      value: stats.total,
      icon: Home,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "In Progress", 
      value: stats.inProgress,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Total Rooms",
      value: stats.totalRooms,
      icon: Palette,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
          <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bgColor} rounded-full transform translate-x-8 -translate-y-8 opacity-30`} />
          <CardHeader className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                <CardTitle className="text-3xl font-bold" style={{color: 'var(--text-charcoal)'}}>
                  {stat.value}
                </CardTitle>
              </div>
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}