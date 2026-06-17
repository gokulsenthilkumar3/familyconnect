import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppShell } from './components/layout/AppShell';
import { TreeCanvasPage } from './pages/TreeCanvasPage';
import { DashboardPage } from './pages/DashboardPage';
import { MembersPage } from './pages/MembersPage';
import { EventsPage } from './pages/EventsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { TimelinePage } from './pages/TimelinePage';
import { MediaPage } from './pages/MediaPage';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { useAuthStore } from './store/authStore';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return <AppShell>{children}</AppShell>;
};

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Protected Routes (we can wrap them in a Layout later) */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/tree" element={<ProtectedRoute><TreeCanvasPage /></ProtectedRoute>} />
        <Route path="/timeline" element={<ProtectedRoute><TimelinePage /></ProtectedRoute>} />
        <Route path="/media" element={<ProtectedRoute><MediaPage /></ProtectedRoute>} />
        <Route path="/members" element={<ProtectedRoute><MembersPage /></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
        <Route path="/profile/:id" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
