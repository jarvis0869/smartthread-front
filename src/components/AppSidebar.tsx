import { NavLink, useLocation } from "react-router-dom";
import { 
  Home, 
  Settings, 
  Zap,
  FileText,
  BarChart3,
  Users,
  Clock
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const mainItems = [
  { title: "Dashboard", url: "/", icon: Home, badge: null },
  { title: "Threads", url: "/threads", icon: FileText, badge: "12" },
  { title: "Analytics", url: "/analytics", icon: BarChart3, badge: null },
];

const integrationItems = [
  { title: "Teams", url: "/teams", icon: Users, badge: "8" },
  { title: "Integrations", url: "/integrations", icon: Zap, badge: "3" },
];

const settingsItems = [
  { title: "Activity", url: "/activity", icon: Clock, badge: null },
  { title: "Settings", url: "/settings", icon: Settings, badge: null },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  
  const getNavCls = (path: string) => {
    const active = isActive(path);
    return `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
      active 
        ? "bg-primary text-primary-foreground shadow-md" 
        : "hover:bg-accent/60 text-muted-foreground hover:text-foreground"
    }`;
  };

  const renderNavItem = (item: any, index: number) => (
    <motion.div
      key={item.title}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <NavLink to={item.url} end className={getNavCls(item.url)}>
        <item.icon className="h-5 w-5 flex-shrink-0" />
        {!isCollapsed && (
          <>
            <span className="font-medium">{item.title}</span>
            {item.badge && (
              <Badge 
                variant="secondary" 
                className="ml-auto h-5 px-2 text-xs bg-muted text-muted-foreground"
              >
                {item.badge}
              </Badge>
            )}
          </>
        )}
      </NavLink>
    </motion.div>
  );

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent className="p-4 space-y-6">
        {/* Main Navigation */}
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Main
            </SidebarGroupLabel>
          )}
          <div className="space-y-1">
            {mainItems.map((item, index) => renderNavItem(item, index))}
          </div>
        </SidebarGroup>

        {/* Integrations */}
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Workspace
            </SidebarGroupLabel>
          )}
          <div className="space-y-1">
            {integrationItems.map((item, index) => renderNavItem(item, index + mainItems.length))}
          </div>
        </SidebarGroup>

        {/* Settings */}
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Account
            </SidebarGroupLabel>
          )}
          <div className="space-y-1">
            {settingsItems.map((item, index) => renderNavItem(item, index + mainItems.length + integrationItems.length))}
          </div>
        </SidebarGroup>

        {/* Status indicator at bottom */}
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-auto p-3 rounded-lg bg-muted/50 border border-border/50"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs text-muted-foreground">All systems operational</span>
            </div>
          </motion.div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}