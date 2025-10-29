"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileText, Clock, Upload, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Chatbot from '@/components/Chatbot';
import { toast } from 'sonner';

interface Assignment {
  id: number;
  title: string;
  description: string;
  subject: string;
  facultyName: string;
  dueDate: string;
  totalMarks: number;
  department: string;
  year: number;
  createdAt: string;
}

export default function AssignmentsPage() {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    subject: '',
    totalMarks: '',
    dueDate: '',
    year: '',
  });

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/assignments');
      if (!response.ok) {
        throw new Error('Failed to fetch assignments');
      }
      const data = await response.json();
      setAssignments(data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error('Failed to load assignments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate file upload - in production, upload to storage first
      const fileUrl = selectedFile ? `/uploads/${selectedFile.name}` : undefined;
      
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignmentId: 1, // You'd get this from the assignment being submitted
          studentId: user?.id || 'student-id',
          studentName: user?.name || 'Student Name',
          submittedDate: new Date().toISOString(),
          fileUrl,
          status: 'submitted',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit assignment');
      }

      toast.success('Assignment submitted successfully!');
      setSelectedFile(null);
      setSubmissionText('');
    } catch (error) {
      console.error('Error submitting assignment:', error);
      toast.error('Failed to submit assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAssignment = async () => {
    if (!newAssignment.title || !newAssignment.description || !newAssignment.subject || 
        !newAssignment.totalMarks || !newAssignment.dueDate || !newAssignment.year) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch('/api/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newAssignment.title,
          description: newAssignment.description,
          subject: newAssignment.subject,
          facultyName: user?.name || 'Faculty Member',
          dueDate: newAssignment.dueDate,
          totalMarks: parseInt(newAssignment.totalMarks),
          department: 'Computer Science',
          year: parseInt(newAssignment.year),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create assignment');
      }

      toast.success('Assignment created successfully!');
      setCreateDialogOpen(false);
      setNewAssignment({
        title: '',
        description: '',
        subject: '',
        totalMarks: '',
        dueDate: '',
        year: '',
      });
      fetchAssignments(); // Refresh the list
    } catch (error) {
      console.error('Error creating assignment:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create assignment');
    } finally {
      setIsCreating(false);
    }
  };

  const getStatusBadge = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const daysUntilDue = Math.ceil((due.getTime() - today.getTime()) / (1000 * 3600 * 24));

    if (daysUntilDue < 0) {
      return <Badge variant="destructive">Overdue</Badge>;
    } else if (daysUntilDue <= 3) {
      return <Badge variant="default">Due Soon</Badge>;
    } else {
      return <Badge variant="secondary">Upcoming</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Assignments</h1>
            <p className="text-muted-foreground">
              {user?.role === 'student' ? 'View and submit your assignments' : 'Manage course assignments'}
            </p>
          </div>
          {user?.role === 'faculty' && (
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <FileText className="mr-2 h-4 w-4" />
                  Create Assignment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Assignment</DialogTitle>
                  <DialogDescription>Fill in the details for the new assignment</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Assignment Title</Label>
                    <Input 
                      placeholder="e.g., Data Structures Lab 5" 
                      value={newAssignment.title}
                      onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea 
                      placeholder="Assignment description and requirements" 
                      rows={4}
                      value={newAssignment.description}
                      onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Subject</Label>
                      <Input 
                        placeholder="e.g., Data Structures"
                        value={newAssignment.subject}
                        onChange={(e) => setNewAssignment({ ...newAssignment, subject: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Total Marks</Label>
                      <Input 
                        type="number" 
                        placeholder="e.g., 20"
                        value={newAssignment.totalMarks}
                        onChange={(e) => setNewAssignment({ ...newAssignment, totalMarks: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Due Date</Label>
                      <Input 
                        type="date"
                        value={newAssignment.dueDate}
                        onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Year</Label>
                      <Input 
                        type="number" 
                        placeholder="e.g., 3" 
                        min="1" 
                        max="4"
                        value={newAssignment.year}
                        onChange={(e) => setNewAssignment({ ...newAssignment, year: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button className="w-full" onClick={handleCreateAssignment} disabled={isCreating}>
                    {isCreating ? 'Creating...' : 'Create Assignment'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <Card>
            <CardContent className="p-12 text-center">
              <Loader2 className="h-12 w-12 mx-auto text-primary mb-4 animate-spin" />
              <p className="text-lg font-medium">Loading assignments...</p>
            </CardContent>
          </Card>
        )}

        {/* Assignments List */}
        {!isLoading && (
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-accent/10 text-accent p-2 rounded-lg">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{assignment.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <span>{assignment.subject}</span>
                          <span>•</span>
                          <span>{assignment.facultyName}</span>
                          <span>•</span>
                          <span>{assignment.totalMarks} marks</span>
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(assignment.dueDate)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{assignment.description}</p>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                  </div>

                  {user?.role === 'student' && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <Upload className="mr-2 h-4 w-4" />
                          Submit Assignment
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Submit Assignment</DialogTitle>
                          <DialogDescription>{assignment.title}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Upload File</Label>
                            <Input
                              type="file"
                              onChange={handleFileChange}
                              accept=".pdf,.doc,.docx,.zip"
                            />
                            {selectedFile && (
                              <p className="text-sm text-muted-foreground">
                                Selected: {selectedFile.name}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label>Comments (Optional)</Label>
                            <Textarea
                              placeholder="Add any comments about your submission"
                              value={submissionText}
                              onChange={(e) => setSubmissionText(e.target.value)}
                              rows={4}
                            />
                          </div>
                          <Button className="w-full" onClick={handleSubmit} disabled={isSubmitting}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  {user?.role === 'faculty' && (
                    <Button variant="outline">
                      View Submissions (0)
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}

            {assignments.length === 0 && !isLoading && (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No assignments found</p>
                  <p className="text-muted-foreground">
                    {user?.role === 'faculty' ? 'Create your first assignment to get started' : 'Check back later for new assignments'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      <Chatbot />
    </DashboardLayout>
  );
}