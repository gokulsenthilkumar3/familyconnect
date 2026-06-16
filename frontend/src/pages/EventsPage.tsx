import React from 'react';
import { Plus, MapPin } from 'lucide-react';
import { useFamilyStore } from '../store/familyStore';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { MOCK_EVENTS } from '../data/mockData';
import { format } from 'date-fns';

export const EventsPage: React.FC = () => {
  // Use mock events plus generated birthdays
  const { members } = useFamilyStore();
  
  const allEvents = [...MOCK_EVENTS];
  
  // Generate birthdays
  members.forEach(m => {
    if (m.birthDate && m.isAlive) {
      allEvents.push({
        id: `bday-${m.id}`,
        treeId: m.treeId,
        memberId: m.id,
        type: 'birthday',
        title: `${m.name}'s Birthday`,
        date: m.birthDate, // In a real app we'd map this to current year
        location: m.birthLocation,
        createdAt: new Date().toISOString()
      });
    }
  });

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Family Calendar</h1>
          <p className="text-gray-500 text-sm mt-1">Upcoming birthdays, anniversaries, and gatherings.</p>
        </div>
        <Button variant="primary" leftIcon={<Plus size={18} />}>
          Add Event
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="space-y-8">
            {/* Simple list view for MVP */}
            {allEvents.map((event, index) => {
              const date = new Date(event.date);
              return (
                <div key={event.id} className="flex space-x-6 relative">
                  {index !== allEvents.length - 1 && (
                    <div className="absolute top-14 left-7 -ml-px h-full w-0.5 bg-gray-100" />
                  )}
                  
                  <div className="flex-shrink-0 w-14 h-14 bg-gray-50 rounded-2xl flex flex-col items-center justify-center border border-gray-100 shadow-sm z-10">
                    <span className="text-xs font-bold text-[var(--color-saffron)] uppercase">
                      {format(date, 'MMM')}
                    </span>
                    <span className="text-lg font-bold text-gray-900 leading-none mt-0.5">
                      {format(date, 'd')}
                    </span>
                  </div>
                  
                  <div className="flex-1 pt-2 pb-6">
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="text-lg font-bold text-gray-900">{event.title}</h3>
                      <Badge type={event.type as any} />
                    </div>
                    
                    {event.description && (
                      <p className="text-gray-600 mt-1">{event.description}</p>
                    )}
                    
                    {event.location && (
                      <div className="flex items-center text-sm text-gray-500 mt-2">
                        <MapPin size={14} className="mr-1" />
                        {event.location}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
