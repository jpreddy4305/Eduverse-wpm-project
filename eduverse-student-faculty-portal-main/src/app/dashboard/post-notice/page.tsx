"use client";

import { useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// Lazy load chatbot - only loads when needed
const Chatbot = dynamic(() => import('@/components/Chatbot'), { ssr: false });

export default function PostNoticePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    department: '',
    priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Memoize preview content to avoid recalculating on every render
  const previewContent = useMemo(() => {
    return formData.content.length > 100 
      ? `${formData.content.substring(0, 100)}...` 
      : formData.content;
  }, [formData.content]);

  // Use useCallback to memoize handlers
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.department || !formData.priority) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/notices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          department: formData.department,
          priority: formData.priority,
          author: user?.name || 'Faculty Member',
          authorRole: user?.role === 'admin' ? 'admin' : 'faculty',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to post notice');
      }

      toast.success('Notice posted successfully!');
      setFormData({
        title: '',
        content: '',
        department: '',
        priority: 'medium'
      });
      
      // Redirect to notices page after 1 second
      setTimeout(() => {
        router.push('/dashboard/notices');
      }, 1000);
    } catch (error) {
      console.error('Error posting notice:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to post notice');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, user, router]);

  const handleClear = useCallback(() => {
    setFormData({ title: '', content: '', department: '', priority: 'medium' });
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-3xl font-bold">Post Notice</h1>
          <p className="text-muted-foreground">Share important announcements with students</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary p-2 rounded-lg">
                <Bell className="h-5 w-5" />
              </div>
              <CardTitle>Create New Notice</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Notice Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Mid-Semester Examination Schedule"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Notice Content *</Label>
                <Textarea
                  id="content"
                  placeholder="Write the full notice content here..."
                  rows={8}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">
                  Be clear and concise. Include all necessary details.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Target Department *</Label>
                  <Select 
                    value={formData.department} 
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                    disabled={isSubmitting}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">All Departments</SelectItem>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                      <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                      <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority Level *</Label>
                  <Select 
                    value={formData.priority} 
                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Notice Preview</h3>
                <div className="space-y-1">
                  <p className="text-sm"><strong>Title:</strong> {formData.title || 'No title yet'}</p>
                  <p className="text-sm"><strong>Department:</strong> {formData.department || 'Not selected'}</p>
                  <p className="text-sm"><strong>Priority:</strong> <span className="capitalize">{formData.priority}</span></p>
                  <p className="text-sm"><strong>Content:</strong> {previewContent || 'No content yet'}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  <Send className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Posting...' : 'Post Notice'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleClear}
                  disabled={isSubmitting}
                >
                  Clear
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Chatbot />
    </DashboardLayout>
  );
}