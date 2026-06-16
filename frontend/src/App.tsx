import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { TreeCanvasPage } from './pages/TreeCanvasPage';
import { DashboardPage } from './pages/DashboardPage';
import { MembersPage } from './pages/MembersPage';
import { EventsPage } from './pages/EventsPage';
import { ProfilePage } from './pages/ProfilePage';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // We're bypassing actual auth logic for the demo unless you want to enforce it.
  return <AppShell>{children}</AppShell>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Protected Routes (we can wrap them in a Layout later) */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/tree" element={<ProtectedRoute><TreeCanvasPage /></ProtectedRoute>} />
        <Route path="/members" element={<ProtectedRoute><MembersPage /></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
        <Route path="/profile/:id" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
