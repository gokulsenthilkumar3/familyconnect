import React from 'react';
import { Card, CardHeader, CardTitle, CardBody } from '../common/Card';
import { Avatar } from '../common/Avatar';
import type { ActivityItem } from '../../types/family';

// Mock activity data
const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'member_added',
    actorName: 'Gokul S.',
    actorPhoto: 'https://i.pravatar.cc/150?u=gokul',
    description: 'added a new family member',
    targetName: 'Aarav Sharma',
    timestamp: '2 hours ago'
  },
  {
    id: 'act-2',
    type: 'photo_added',
    actorName: 'Priya Sharma',
    actorPhoto: 'https://i.pravatar.cc/150?u=priya',
    description: 'uploaded 5 photos to',
    targetName: 'Diwali 2023 Album',
    timestamp: '5 hours ago'
  },
  {
    id: 'act-3',
    type: 'event_added',
    actorName: 'Rajesh Sharma',
    actorPhoto: 'https://i.pravatar.cc/150?u=rajesh',
    description: 'scheduled an event',
    targetName: 'Ramesh\'s 80th Birthday',
    timestamp: '1 day ago'
  }
];

export const ActivityFeed: React.FC = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardBody>
        <div className="space-y-6">
          {MOCK_ACTIVITIES.map((activity, index) => (
            <div key={activity.id} className="relative flex space-x-3">
              {/* Connector Line */}
              {index !== MOCK_ACTIVITIES.length - 1 && (
                <div className="absolute top-8 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
              )}
              
              <Avatar name={activity.actorName} src={activity.actorPhoto} size="sm" className="ring-8 ring-white z-10" />
              
              <div className="flex-1 min-w-0 pt-1.5">
                <p className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">{activity.actorName}</span>{' '}
                  {activity.description}{' '}
                  {activity.targetName && <span className="font-medium text-[var(--color-navy)]">{activity.targetName}</span>}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
