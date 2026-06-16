import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Network, Users, CalendarDays, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/tree', label: 'Family Tree', icon: Network },
  { path: '/members', label: 'Members', icon: Users },
  { path: '/events', label: 'Calendar', icon: CalendarDays },
];

export const Sidebar: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useUIStore();

  return (
    <div 
      className={`bg-[var(--color-navy)] text-white h-screen flex flex-col transition-all duration-300 relative ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
        <div className="flex items-center overflow-hidden">
          <span className="text-2xl min-w-[24px]">🌳</span>
          <span 
            className={`font-bold ml-2 whitespace-nowrap transition-opacity duration-300 ${
              sidebarOpen ? 'opacity-100' : 'opacity-0 w-0'
            }`}
          >
            FamilyConnect
          </span>
        </div>
      </div>

      {/* Toggle Button */}
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 bg-[var(--color-saffron)] text-white p-1 rounded-full shadow-lg z-10 hover:scale-110 transition-transform"
      >
        {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center px-3 py-3 rounded-lg transition-colors group ${
                  isActive 
                    ? 'bg-[var(--color-saffron)] text-white' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
              title={item.label}
            >
              <Icon size={20} className="min-w-[20px]" />
              <span 
                className={`ml-3 whitespace-nowrap transition-opacity duration-300 ${
                  sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'
                }`}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Nav */}
      <div className="p-3 border-t border-gray-800">
        <button 
          className="w-full flex items-center px-3 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors group"
          title="Settings"
        >
          <Settings size={20} className="min-w-[20px]" />
          <span 
            className={`ml-3 whitespace-nowrap transition-opacity duration-300 ${
              sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'
            }`}
          >
            Settings
          </span>
        </button>
      </div>
    </div>
  );
};
