"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3, TrendingUp } from 'lucide-react';
import { mockGrades } from '@/lib/data/mockData';
import Chatbot from '@/components/Chatbot';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export default function GradesPage() {
  const { user } = useAuth();
  const [selectedGrade, setSelectedGrade] = useState<any>(null);

  const getGradeColor = (grade?: string) => {
    if (!grade) return 'text-muted-foreground';
    if (grade.startsWith('A')) return 'text-green-500';
    if (grade.startsWith('B')) return 'text-blue-500';
    if (grade.startsWith('C')) return 'text-yellow-500';
    return 'text-red-500';
  };

  const calculateOverallPercentage = () => {
    const total = mockGrades.reduce((acc, g) => acc + (g.total || 0), 0);
    const maxPossible = mockGrades.length * 100;
    return Math.round((total / maxPossible) * 100);
  };

  const overallPercentage = calculateOverallPercentage();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Grades</h1>
            <p className="text-muted-foreground">
              {user?.role === 'student' ? 'View your academic performance' : 'Manage student grades'}
            </p>
          </div>
          {user?.role === 'faculty' && (
            <Button>Update Grades</Button>
          )}
        </div>

        {/* Overall Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{overallPercentage}%</div>
                <p className="text-sm text-muted-foreground">Average across all subjects</p>
              </div>
              <div className="bg-primary/10 text-primary p-3 rounded-xl">
                <TrendingUp className="h-8 w-8" />
              </div>
            </div>
            <Progress value={overallPercentage} className="h-3" />
          </CardContent>
        </Card>

        {/* Subject-wise Grades */}
        <div className="space-y-4">
          {mockGrades.map((grade) => (
            <Card key={grade.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary p-2 rounded-lg">
                      <BarChart3 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{grade.subject}</h3>
                      <p className="text-sm text-muted-foreground">Total: {grade.total}/100</p>
                    </div>
                  </div>
                  <Badge className={`text-lg px-4 py-1 ${getGradeColor(grade.grade)}`}>
                    {grade.grade || 'N/A'}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Midterm</p>
                    <p className="text-xl font-bold">{grade.midterm || '-'}</p>
                    <p className="text-xs text-muted-foreground">out of 40</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Assignments</p>
                    <p className="text-xl font-bold">{grade.assignments || '-'}</p>
                    <p className="text-xs text-muted-foreground">out of 30</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Endterm</p>
                    <p className="text-xl font-bold">{grade.endterm || '-'}</p>
                    <p className="text-xs text-muted-foreground">out of 30</p>
                  </div>
                </div>

                {user?.role === 'faculty' && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full mt-4" variant="outline">
                        Update Grade
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Update Grade - {grade.subject}</DialogTitle>
                        <DialogDescription>Enter marks for different components</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Midterm (out of 40)</Label>
                          <Input type="number" defaultValue={grade.midterm} max={40} />
                        </div>
                        <div className="space-y-2">
                          <Label>Assignments (out of 30)</Label>
                          <Input type="number" defaultValue={grade.assignments} max={30} />
                        </div>
                        <div className="space-y-2">
                          <Label>Endterm (out of 30)</Label>
                          <Input type="number" defaultValue={grade.endterm} max={30} />
                        </div>
                        <Button className="w-full">Save Grades</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Chatbot />
    </DashboardLayout>
  );
}
