"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Loader2 } from 'lucide-react';
import Chatbot from '@/components/Chatbot';
import { useEffect, useState } from 'react';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface TimetableSlot {
  id: number;
  day: string;
  time: string;
  subject: string;
  faculty: string;
  room: string;
  type: string;
  createdAt: string;
}

export default function TimetablePage() {
  const [timetableData, setTimetableData] = useState<TimetableSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/timetable');
        
        if (!response.ok) {
          throw new Error('Failed to fetch timetable');
        }
        
        const data = await response.json();
        setTimetableData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching timetable:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimetable();
  }, []);

  const getTimetableForDay = (day: string) => {
    return timetableData.filter(slot => slot.day === day);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lecture':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'lab':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'tutorial':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading timetable...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="max-w-md">
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <p className="text-destructive font-medium">Error loading timetable</p>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Timetable</h1>
          <p className="text-muted-foreground">Your weekly class schedule</p>
        </div>

        {/* Weekly View */}
        <div className="space-y-4">
          {days.map((day) => {
            const daySlots = getTimetableForDay(day);
            
            return (
              <Card key={day}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary p-2 rounded-lg">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <CardTitle>{day}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {daySlots.length > 0 ? (
                    <div className="grid gap-3 md:grid-cols-2">
                      {daySlots.map((slot) => (
                        <div
                          key={slot.id}
                          className={`p-4 rounded-lg border-2 ${getTypeColor(slot.type)}`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold">{slot.subject}</h3>
                            <Badge variant="outline" className="capitalize">
                              {slot.type}
                            </Badge>
                          </div>
                          <p className="text-sm mb-2">{slot.faculty}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{slot.time}</span>
                            </div>
                            <span>Room: {slot.room}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No classes scheduled</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Chatbot />
    </DashboardLayout>
  );
}