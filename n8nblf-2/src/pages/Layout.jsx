

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Plus, Palette, FileText, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: Home,
  },
  {
    title: "New Project",
    url: createPageUrl("CreateProject"),
    icon: Plus,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <style>{`
        :root {
          --primary-navy: #1a237e;
          --accent-gold: #d4af37;
          --background-white: #ffffff;
          --secondary-gray: #f8f9fa;
          --text-charcoal: #2c2c2c;
        }
      `}</style>
      <div className="min-h-screen flex w-full" style={{backgroundColor: 'var(--background-white)'}}>
        <Sidebar className="border-r border-gray-200">
          <SidebarHeader className="border-b border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" 
                   style={{background: 'linear-gradient(135deg, var(--primary-navy) 0%, #3949ab 100%)'}}>
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-xl" style={{color: 'var(--text-charcoal)'}}>MiNextCasa</h2>
                <p className="text-sm text-gray-500">Your Next Home, Visualized</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 py-3">
                Workspace
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`transition-all duration-300 rounded-lg mb-2 ${
                          location.pathname === item.url 
                            ? 'text-white shadow-lg' 
                            : 'text-gray-600 hover:text-white hover:shadow-md'
                        }`}
                        style={{
                          backgroundColor: location.pathname === item.url 
                            ? 'var(--primary-navy)' 
                            : 'transparent',
                          '&:hover': {
                            backgroundColor: 'var(--primary-navy)'
                          }
                        }}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-8">
              <SidebarGroupLabel className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 py-3">
                Quick Stats
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-4 py-3 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Active Projects</span>
                    <span className="font-bold px-2 py-1 rounded-full text-xs" 
                          style={{backgroundColor: 'var(--accent-gold)', color: 'white'}}>
                      0
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Completed</span>
                    <span className="font-bold text-green-600">0</span>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" 
                   style={{backgroundColor: 'var(--secondary-gray)'}}>
                <span style={{color: 'var(--primary-navy)'}} className="font-bold text-sm">R</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate" style={{color: 'var(--text-charcoal)'}}>Real Estate Pro</p>
                <p className="text-xs text-gray-500 truncate">Premium Visualization Tools</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white border-b border-gray-200 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold" style={{color: 'var(--text-charcoal)'}}>MiNextCasa</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

