import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Dashboard from "./pages/Dashboard";
import Teams from "./pages/Teams";
import Threads from "./pages/Threads";
import Integrations from "./pages/Integrations";
import ThreadDetail from "./pages/ThreadDetail";
import Settings from "./pages/Settings";
import Activity from "./pages/Activity";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import { AppLayout } from "./components/AppLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="teams" element={<Teams />} />
            <Route path="threads" element={<Threads />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="integrations" element={<Integrations />} />
            <Route path="thread/:id" element={<ThreadDetail />} />
            <Route path="activity" element={<Activity />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
