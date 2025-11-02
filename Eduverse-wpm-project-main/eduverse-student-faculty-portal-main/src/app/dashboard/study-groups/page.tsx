"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  Search, 
  Plus,
  MessageCircle,
  UserPlus,
  UserMinus,
  Send,
  BookOpen,
  Clock,
  Crown
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const subjects = [
  'All',
  'Data Structures',
  'Web Development',
  'Machine Learning',
  'Database Systems',
  'Computer Networks',
  'Operating Systems',
  'Software Engineering',
  'Competitive Programming',
  'Mobile App Development'
];

export default function StudyGroupsPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    subject: 'Data Structures'
  });
  
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  const fetchGroups = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedSubject !== 'All') params.append('subject', selectedSubject);
      if (searchQuery) params.append('search', searchQuery);
      
      const response = await fetch(`/api/study-groups?${params}`);
      const data = await response.json();
      setGroups(data);
    } catch (error) {
      console.error('Failed to fetch groups:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedSubject, searchQuery]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchGroups();
    }
  }, [isAuthenticated, fetchGroups]);

  const handleCreateGroup = useCallback(async () => {
    if (!newGroup.name || !newGroup.description) return;
    
    try {
      const response = await fetch('/api/study-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newGroup,
          createdBy: user?.id || 'user_1',
          creatorName: user?.name || 'Anonymous'
        })
      });
      
      if (response.ok) {
        setNewGroup({ name: '', description: '', subject: 'Data Structures' });
        setCreateDialogOpen(false);
        fetchGroups();
      }
    } catch (error) {
      console.error('Failed to create group:', error);
    }
  }, [newGroup, user, fetchGroups]);

  const handleViewGroup = useCallback(async (group: any) => {
    setSelectedGroup(group);
    setViewDialogOpen(true);
    
    try {
      const [detailsRes, messagesRes] = await Promise.all([
        fetch(`/api/study-groups/${group.id}`),
        fetch(`/api/study-groups/${group.id}/messages`)
      ]);
      
      const detailsData = await detailsRes.json();
      const messagesData = await messagesRes.json();
      
      setMembers(detailsData.members || []);
      setMessages(messagesData.reverse() || []);
    } catch (error) {
      console.error('Failed to fetch group details:', error);
    }
  }, []);

  const handleJoinGroup = useCallback(async (groupId: number) => {
    try {
      const response = await fetch(`/api/study-groups/${groupId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || 'user_1',
          userName: user?.name || 'Anonymous'
        })
      });
      
      if (response.ok) {
        // Refresh group details
        const detailsRes = await fetch(`/api/study-groups/${groupId}`);
        const detailsData = await detailsRes.json();
        setSelectedGroup(detailsData.group);
        setMembers(detailsData.members || []);
        fetchGroups();
      }
    } catch (error) {
      console.error('Failed to join group:', error);
    }
  }, [user, fetchGroups]);

  const handleLeaveGroup = useCallback(async (groupId: number) => {
    try {
      const response = await fetch(`/api/study-groups/${groupId}/leave?userId=${user?.id || 'user_1'}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        // Refresh group details
        const detailsRes = await fetch(`/api/study-groups/${groupId}`);
        const detailsData = await detailsRes.json();
        setSelectedGroup(detailsData.group);
        setMembers(detailsData.members || []);
        fetchGroups();
      }
    } catch (error) {
      console.error('Failed to leave group:', error);
    }
  }, [user, fetchGroups]);

  const handleSendMessage = useCallback(async () => {
    if (!newMessage || !selectedGroup) return;
    
    try {
      const response = await fetch(`/api/study-groups/${selectedGroup.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || 'user_1',
          userName: user?.name || 'Anonymous',
          message: newMessage
        })
      });
      
      if (response.ok) {
        setNewMessage('');
        // Refresh messages
        const messagesRes = await fetch(`/api/study-groups/${selectedGroup.id}/messages`);
        const messagesData = await messagesRes.json();
        setMessages(messagesData.reverse() || []);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [newMessage, selectedGroup, user]);

  const isMember = useCallback((groupId: number) => {
    return members.some(m => m.userId === (user?.id || 'user_1'));
  }, [members, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Study Groups</h1>
            <p className="text-muted-foreground">Join groups, collaborate with peers, and learn together</p>
          </div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Group
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create a New Study Group</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Group Name</label>
                  <Input
                    placeholder="e.g., DSA Study Circle"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Subject</label>
                  <Select
                    value={newGroup.subject}
                    onValueChange={(value) => setNewGroup({ ...newGroup, subject: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.slice(1).map((sub) => (
                        <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    placeholder="Describe the group's purpose and goals..."
                    rows={5}
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                  />
                </div>
                <Button onClick={handleCreateGroup} className="w-full">
                  Create Group
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search study groups..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-full md:w-[220px]">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((sub) => (
                    <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Groups Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <Card className="col-span-full">
              <CardContent className="py-12 text-center">Loading study groups...</CardContent>
            </Card>
          ) : groups.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="py-12 text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No study groups found</h3>
                <p className="text-muted-foreground">Create the first group to start collaborating!</p>
              </CardContent>
            </Card>
          ) : (
            groups.map((group) => (
              <Card
                key={group.id}
                className="hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => handleViewGroup(group)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {group.name}
                    </CardTitle>
                    <Badge variant="outline">{group.subject}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {group.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{group.currentMembers}/{group.maxMembers} members</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(group.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Crown className="h-3 w-3" />
                    <span>Created by {group.creatorName}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* View Group Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-5xl max-h-[80vh]">
            {selectedGroup && (
              <div className="space-y-6">
                <DialogHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <DialogTitle className="text-2xl">{selectedGroup.name}</DialogTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge>{selectedGroup.subject}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {selectedGroup.currentMembers}/{selectedGroup.maxMembers} members
                        </span>
                      </div>
                    </div>
                    {selectedGroup && (
                      isMember(selectedGroup.id) ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleLeaveGroup(selectedGroup.id)}
                        >
                          <UserMinus className="h-4 w-4" />
                          Leave Group
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="gap-2"
                          onClick={() => handleJoinGroup(selectedGroup.id)}
                          disabled={selectedGroup.currentMembers >= selectedGroup.maxMembers}
                        >
                          <UserPlus className="h-4 w-4" />
                          Join Group
                        </Button>
                      )
                    )}
                  </div>
                </DialogHeader>

                <p className="text-muted-foreground">{selectedGroup.description}</p>

                <div className="grid md:grid-cols-3 gap-6">
                  {/* Members List */}
                  <Card className="md:col-span-1">
                    <CardHeader>
                      <CardTitle className="text-sm">Members ({members.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 max-h-[300px] overflow-y-auto">
                      {members.map((member) => (
                        <div key={member.id} className="flex items-center justify-between text-sm">
                          <span>{member.userName}</span>
                          {member.role === 'admin' && (
                            <Badge variant="secondary" className="text-xs">Admin</Badge>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Group Chat */}
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-sm">Group Chat</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3 max-h-[250px] overflow-y-auto border rounded-lg p-4">
                        {messages.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-8">
                            No messages yet. Start the conversation!
                          </p>
                        ) : (
                          messages.map((msg) => (
                            <div key={msg.id} className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{msg.userName}</span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(msg.createdAt).toLocaleTimeString()}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">{msg.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                      
                      {isMember(selectedGroup.id) && (
                        <div className="flex gap-2">
                          <Input
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          />
                          <Button size="sm" onClick={handleSendMessage} className="gap-2">
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
