import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { motion } from "framer-motion";
import { Bell, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AppLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-muted/30">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          {/* Modern header with glass morphism */}
          <motion.header 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="h-16 border-b border-border/40 bg-background/80 backdrop-blur-xl flex items-center justify-between px-6"
          >
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-foreground">S</span>
                </div>
                <h1 className="text-xl font-bold gradient-text">SmartThread</h1>
              </div>
            </div>
            
            {/* Header actions */}
            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search threads..."
                  className="w-80 pl-10 bg-muted/50 border-none focus:bg-background transition-colors"
                />
              </div>
              <Button variant="ghost" size="sm" className="h-9 w-9">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-9 w-9">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </motion.header>
          
          {/* Main content area */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 p-8 overflow-auto"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </SidebarProvider>
  );
}