"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo, useCallback } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageSquare, 
  ThumbsUp, 
  Eye, 
  Search, 
  Plus,
  Send,
  Filter,
  TrendingUp,
  Clock,
  User
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

const categories = [
  'All',
  'Academic Help',
  'Exam Preparation',
  'Project Ideas',
  'Career Guidance',
  'Campus Life'
];

export default function DiscussionsPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [selectedDiscussion, setSelectedDiscussion] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  
  // Create discussion form
  const [newDiscussion, setNewDiscussion] = useState({
    title: '',
    content: '',
    category: 'Academic Help'
  });
  
  // Reply form
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  const fetchDiscussions = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);
      
      const response = await fetch(`/api/discussions?${params}`);
      const data = await response.json();
      setDiscussions(data);
    } catch (error) {
      console.error('Failed to fetch discussions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDiscussions();
    }
  }, [isAuthenticated, fetchDiscussions]);

  const handleCreateDiscussion = useCallback(async () => {
    if (!newDiscussion.title || !newDiscussion.content) return;
    
    try {
      const response = await fetch('/api/discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newDiscussion,
          authorId: user?.id || 'user_1',
          authorName: user?.name || 'Anonymous'
        })
      });
      
      if (response.ok) {
        setNewDiscussion({ title: '', content: '', category: 'Academic Help' });
        setCreateDialogOpen(false);
        fetchDiscussions();
      }
    } catch (error) {
      console.error('Failed to create discussion:', error);
    }
  }, [newDiscussion, user, fetchDiscussions]);

  const handleViewDiscussion = useCallback(async (discussion: any) => {
    setSelectedDiscussion(discussion);
    setViewDialogOpen(true);
    
    try {
      // Increment view count
      await fetch(`/api/discussions/${discussion.id}/views`, { method: 'PATCH' });
      
      // Fetch discussion with replies
      const response = await fetch(`/api/discussions/${discussion.id}`);
      const data = await response.json();
      setReplies(data.replies || []);
    } catch (error) {
      console.error('Failed to fetch discussion details:', error);
    }
  }, []);

  const handleAddReply = useCallback(async () => {
    if (!replyContent || !selectedDiscussion) return;
    
    try {
      const response = await fetch(`/api/discussions/${selectedDiscussion.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: replyContent,
          authorId: user?.id || 'user_1',
          authorName: user?.name || 'Anonymous'
        })
      });
      
      if (response.ok) {
        setReplyContent('');
        // Refresh replies
        const refreshResponse = await fetch(`/api/discussions/${selectedDiscussion.id}`);
        const data = await refreshResponse.json();
        setReplies(data.replies || []);
      }
    } catch (error) {
      console.error('Failed to add reply:', error);
    }
  }, [replyContent, selectedDiscussion, user]);

  const handleUpvote = useCallback(async (type: 'discussion' | 'reply', targetId: number) => {
    try {
      await fetch(`/api/discussions/${selectedDiscussion.id}/upvote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || 'user_1',
          type,
          targetId
        })
      });
      
      // Refresh data
      const response = await fetch(`/api/discussions/${selectedDiscussion.id}`);
      const data = await response.json();
      setSelectedDiscussion(data.discussion);
      setReplies(data.replies || []);
    } catch (error) {
      console.error('Failed to upvote:', error);
    }
  }, [selectedDiscussion, user]);

  const filteredDiscussions = useMemo(() => discussions, [discussions]);

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
            <h1 className="text-3xl font-bold">Discussion Forums</h1>
            <p className="text-muted-foreground">Ask questions, share knowledge, and collaborate</p>
          </div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Discussion
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Start a New Discussion</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Title</label>
                  <Input
                    placeholder="What's your question or topic?"
                    value={newDiscussion.title}
                    onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select
                    value={newDiscussion.category}
                    onValueChange={(value) => setNewDiscussion({ ...newDiscussion, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.slice(1).map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    placeholder="Provide details about your question or topic..."
                    rows={6}
                    value={newDiscussion.content}
                    onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
                  />
                </div>
                <Button onClick={handleCreateDiscussion} className="w-full">
                  Post Discussion
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
                  placeholder="Search discussions..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Discussions List */}
        <div className="space-y-4">
          {isLoading ? (
            <Card><CardContent className="py-12 text-center">Loading discussions...</CardContent></Card>
          ) : filteredDiscussions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No discussions found</h3>
                <p className="text-muted-foreground">Start a new discussion to get the conversation going!</p>
              </CardContent>
            </Card>
          ) : (
            filteredDiscussions.map((discussion) => (
              <Card
                key={discussion.id}
                className="hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => handleViewDiscussion(discussion)}
              >
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-2 min-w-[60px]">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpvote('discussion', discussion.id);
                        }}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-semibold">{discussion.upvotes}</span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                          {discussion.title}
                        </h3>
                        <Badge variant="secondary">{discussion.category}</Badge>
                      </div>
                      
                      <p className="text-muted-foreground line-clamp-2 mb-3">
                        {discussion.content}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{discussion.authorName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{discussion.views} views</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(discussion.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* View Discussion Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            {selectedDiscussion && (
              <div className="space-y-6">
                <DialogHeader>
                  <div className="flex items-start justify-between gap-4">
                    <DialogTitle className="text-2xl">{selectedDiscussion.title}</DialogTitle>
                    <Badge>{selectedDiscussion.category}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{selectedDiscussion.authorName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(selectedDiscussion.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </DialogHeader>

                <div className="prose max-w-none">
                  <p className="text-muted-foreground">{selectedDiscussion.content}</p>
                </div>

                <div className="flex items-center gap-4 py-4 border-y">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleUpvote('discussion', selectedDiscussion.id)}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    Upvote ({selectedDiscussion.upvotes})
                  </Button>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    <span>{selectedDiscussion.views} views</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
                  </h3>
                  
                  {replies.map((reply) => (
                    <Card key={reply.id} className="bg-muted/30">
                      <CardContent className="pt-4">
                        <div className="flex gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 rounded-full"
                            onClick={() => handleUpvote('reply', reply.id)}
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </Button>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-sm">{reply.authorName}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(reply.createdAt).toLocaleString()}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                • {reply.upvotes} upvotes
                              </span>
                            </div>
                            <p className="text-sm">{reply.content}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Add a Reply</label>
                  <Textarea
                    placeholder="Share your thoughts..."
                    rows={4}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                  />
                  <Button onClick={handleAddReply} className="gap-2">
                    <Send className="h-4 w-4" />
                    Post Reply
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
