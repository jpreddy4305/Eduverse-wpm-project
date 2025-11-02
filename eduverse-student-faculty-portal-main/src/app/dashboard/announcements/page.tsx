"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Bell, Send, Megaphone } from 'lucide-react';
import Chatbot from '@/components/Chatbot';
import { mockNotices } from '@/lib/data/mockData';

export default function AnnouncementsPage() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'high'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('System-wide announcement broadcasted successfully!');
    setFormData({
      title: '',
      content: '',
      priority: 'high'
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Broadcast Announcements</h1>
          <p className="text-muted-foreground">Send system-wide announcements to all users</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Broadcast Form */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary p-2 rounded-lg">
                  <Megaphone className="h-5 w-5" />
                </div>
                <CardTitle>New Announcement</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Announcement Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., System Maintenance Notice"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Message *</Label>
                  <Textarea
                    id="content"
                    placeholder="Write your announcement message..."
                    rows={6}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                  />
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">⚠️ This will be sent to:</p>
                  <ul className="text-sm space-y-1">
                    <li>• All students</li>
                    <li>• All faculty members</li>
                    <li>• All administrators</li>
                  </ul>
                </div>

                <Button type="submit" className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Broadcast Announcement
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Recent Announcements */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Announcements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockNotices.slice(0, 5).map((notice) => (
                <div key={notice.id} className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{notice.title}</h3>
                    <Badge variant={notice.priority === 'high' ? 'destructive' : 'secondary'}>
                      {notice.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{notice.content.substring(0, 100)}...</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <span>{notice.author}</span>
                    <span>•</span>
                    <span>{new Date(notice.date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Sent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">847</div>
              <p className="text-xs text-muted-foreground">This semester</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Reach</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98.5%</div>
              <p className="text-xs text-muted-foreground">Recipients reached</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Last Sent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2h ago</div>
              <p className="text-xs text-muted-foreground">Library hours update</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Chatbot />
    </DashboardLayout>
  );
}
