import React from 'react';
import { Card, CardHeader, CardTitle, CardBody } from '../common/Card';
import { MapPin } from 'lucide-react';
import { useFamilyStore } from '../../store/familyStore';
import { Badge } from '../common/Badge';

export const UpcomingEvents: React.FC = () => {
  const { members } = useFamilyStore();
  
  // Create some mock upcoming birthdays from the members data
  const upcomingEvents = members
    .filter(m => m.birthDate && m.isAlive)
    .slice(0, 4)
    .map(m => {
      const birthDate = new Date(m.birthDate!);
      // Mocking next occurrence to be soon
      const nextDate = new Date();
      nextDate.setMonth(birthDate.getMonth());
      nextDate.setDate(birthDate.getDate());
      if (nextDate < new Date()) {
        nextDate.setFullYear(nextDate.getFullYear() + 1);
      }
      return {
        id: `bday-${m.id}`,
        title: `${m.name}'s Birthday`,
        date: nextDate,
        type: 'birthday',
        location: m.birthLocation
      };
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          {upcomingEvents.map((event) => {
            const dateStr = event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            return (
              <div key={event.id} className="flex items-start space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                <div className="flex-shrink-0 bg-[var(--color-cream)] border border-[var(--color-saffron)] text-[var(--color-saffron)] rounded-lg p-2 text-center min-w-[56px]">
                  <span className="block text-xs font-bold uppercase">{dateStr.split(' ')[0]}</span>
                  <span className="block text-xl font-bold leading-none mt-1">{dateStr.split(' ')[1]}</span>
                </div>
                
                <div className="flex-1 min-w-0 pt-1">
                  <p className="text-sm font-bold text-gray-900 truncate">{event.title}</p>
                  <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
                    <Badge type={event.type as any} />
                    {event.location && (
                      <span className="flex items-center">
                        <MapPin size={12} className="mr-0.5" />
                        {event.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
};
