"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, TrendingUp, Check, X, Clock as ClockIcon } from 'lucide-react';
import { mockAttendance } from '@/lib/data/mockData';
import Chatbot from '@/components/Chatbot';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useMemo, useCallback } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

// Mock student data for faculty to mark attendance
const mockStudents = [
  { id: '1', name: 'John Smith', rollNo: 'CS2021001' },
  { id: '2', name: 'Emily Davis', rollNo: 'CS2021002' },
  { id: '3', name: 'Michael Brown', rollNo: 'CS2021003' },
  { id: '4', name: 'Sarah Wilson', rollNo: 'CS2021004' },
  { id: '5', name: 'David Lee', rollNo: 'CS2021005' },
  { id: '6', name: 'Jessica Taylor', rollNo: 'CS2021006' },
];

export default function AttendancePage() {
  const { user } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [isMarkingOpen, setIsMarkingOpen] = useState(false);
  const [markingSubject, setMarkingSubject] = useState('');
  const [markingDate, setMarkingDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceStatus, setAttendanceStatus] = useState<Record<string, 'present' | 'absent' | 'late'>>({});

  // Calculate attendance by subject
  const subjects = useMemo(() => Array.from(new Set(mockAttendance.map(a => a.subject))), []);
  
  const getSubjectAttendance = useCallback((subject: string) => {
    const records = mockAttendance.filter(a => a.subject === subject);
    const present = records.filter(a => a.status === 'present').length;
    return {
      total: records.length,
      present,
      percentage: Math.round((present / records.length) * 100)
    };
  }, []);

  const overallStats = useMemo(() => {
    const stats = {
      total: mockAttendance.length,
      present: mockAttendance.filter(a => a.status === 'present').length,
      absent: mockAttendance.filter(a => a.status === 'absent').length,
      late: mockAttendance.filter(a => a.status === 'late').length,
      percentage: 0
    };
    stats.percentage = Math.round((stats.present / stats.total) * 100);
    return stats;
  }, []);

  const filteredAttendance = useMemo(() => 
    selectedSubject === 'all' 
      ? mockAttendance 
      : mockAttendance.filter(a => a.subject === selectedSubject),
    [selectedSubject]
  );

  const handleMarkAttendance = useCallback(() => {
    // Initialize all students as present by default
    const initialStatus: Record<string, 'present' | 'absent' | 'late'> = {};
    mockStudents.forEach(student => {
      initialStatus[student.id] = 'present';
    });
    setAttendanceStatus(initialStatus);
    setIsMarkingOpen(true);
  }, []);

  const handleStatusChange = useCallback((studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendanceStatus(prev => ({
      ...prev,
      [studentId]: status
    }));
  }, []);

  const handleSaveAttendance = useCallback(() => {
    if (!markingSubject) {
      alert('Please select a subject');
      return;
    }

    // Here you would normally send this to an API
    console.log('Saving attendance:', {
      subject: markingSubject,
      date: markingDate,
      attendance: attendanceStatus
    });

    // Show success message
    alert(`Attendance marked successfully for ${markingSubject} on ${markingDate}`);
    
    // Reset and close
    setIsMarkingOpen(false);
    setMarkingSubject('');
    setMarkingDate(new Date().toISOString().split('T')[0]);
  }, [markingSubject, markingDate, attendanceStatus]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Attendance</h1>
            <p className="text-muted-foreground">
              {user?.role === 'student' ? 'Track your attendance records' : 'Manage student attendance'}
            </p>
          </div>
          {user?.role === 'faculty' && (
            <Dialog open={isMarkingOpen} onOpenChange={setIsMarkingOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleMarkAttendance}>Mark Attendance</Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Mark Attendance</DialogTitle>
                  <DialogDescription>
                    Select subject and mark attendance for each student
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Select value={markingSubject} onValueChange={setMarkingSubject}>
                        <SelectTrigger id="subject">
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map(subject => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={markingDate}
                        onChange={(e) => setMarkingDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b pb-2">
                      <Label className="text-base font-semibold">Students</Label>
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Check className="h-3 w-3" /> Present
                        </span>
                        <span className="flex items-center gap-1">
                          <X className="h-3 w-3" /> Absent
                        </span>
                        <span className="flex items-center gap-1">
                          <ClockIcon className="h-3 w-3" /> Late
                        </span>
                      </div>
                    </div>

                    {mockStudents.map(student => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">{student.rollNo}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={attendanceStatus[student.id] === 'present' ? 'default' : 'outline'}
                            onClick={() => handleStatusChange(student.id, 'present')}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={attendanceStatus[student.id] === 'absent' ? 'destructive' : 'outline'}
                            onClick={() => handleStatusChange(student.id, 'absent')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={attendanceStatus[student.id] === 'late' ? 'secondary' : 'outline'}
                            onClick={() => handleStatusChange(student.id, 'late')}
                          >
                            <ClockIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={() => setIsMarkingOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveAttendance}>
                      Save Attendance
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Overall Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Overall</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.percentage}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                {overallStats.present} / {overallStats.total} classes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Present</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{overallStats.present}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>Good standing</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Absent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{overallStats.absent}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {overallStats.absent > 3 ? 'Watch out!' : 'Within limits'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Late</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{overallStats.late}</div>
              <p className="text-xs text-muted-foreground mt-1">Punctuality matters</p>
            </CardContent>
          </Card>
        </div>

        {/* Subject-wise Attendance */}
        <Card>
          <CardHeader>
            <CardTitle>Subject-wise Attendance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {subjects.map(subject => {
              const stats = getSubjectAttendance(subject);
              return (
                <div key={subject} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{subject}</h3>
                    <Badge variant={stats.percentage >= 75 ? 'default' : 'destructive'}>
                      {stats.percentage}%
                    </Badge>
                  </div>
                  <Progress value={stats.percentage} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {stats.present} / {stats.total} classes
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Attendance Records */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Attendance Records</CardTitle>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredAttendance.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{record.subject}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(record.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      record.status === 'present' ? 'default' :
                      record.status === 'absent' ? 'destructive' : 
                      'secondary'
                    }
                  >
                    {record.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Chatbot />
    </DashboardLayout>
  );
}