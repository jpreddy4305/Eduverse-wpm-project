"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, 
  Search, 
  Filter,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Book,
  Library,
  History
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

const categories = [
  'All',
  'Computer Science',
  'Mathematics',
  'Physics',
  'Engineering',
  'Literature',
  'Business & Management'
];

export default function LibraryPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [books, setBooks] = useState<any[]>([]);
  const [myBooks, setMyBooks] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);
      if (showAvailableOnly) params.append('available', 'true');
      
      const response = await fetch(`/api/library/books?${params}`);
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Failed to fetch books:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, searchQuery, showAvailableOnly]);

  const fetchMyBooks = useCallback(async () => {
    try {
      const response = await fetch(`/api/library/my-books?userId=${user?.id || 'user_1'}`);
      const data = await response.json();
      setMyBooks(data);
    } catch (error) {
      console.error('Failed to fetch my books:', error);
    }
  }, [user]);

  const fetchHistory = useCallback(async () => {
    try {
      const response = await fetch(`/api/library/history?userId=${user?.id || 'user_1'}`);
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBooks();
      fetchMyBooks();
      fetchHistory();
    }
  }, [isAuthenticated, fetchBooks, fetchMyBooks, fetchHistory]);

  const handleIssueBook = useCallback(async (bookId: number) => {
    try {
      const response = await fetch('/api/library/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId,
          userId: user?.id || 'user_1',
          userName: user?.name || 'Anonymous'
        })
      });
      
      if (response.ok) {
        fetchBooks();
        fetchMyBooks();
        setViewDialogOpen(false);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to issue book');
      }
    } catch (error) {
      console.error('Failed to issue book:', error);
    }
  }, [user, fetchBooks, fetchMyBooks]);

  const handleReturnBook = useCallback(async (issueId: number) => {
    try {
      const response = await fetch('/api/library/return', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issueId })
      });
      
      if (response.ok) {
        fetchBooks();
        fetchMyBooks();
        fetchHistory();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to return book');
      }
    } catch (error) {
      console.error('Failed to return book:', error);
    }
  }, [fetchBooks, fetchMyBooks, fetchHistory]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'issued':
        return <Badge variant="default" className="gap-1"><Clock className="h-3 w-3" /> Issued</Badge>;
      case 'returned':
        return <Badge variant="secondary" className="gap-1"><CheckCircle className="h-3 w-3" /> Returned</Badge>;
      case 'overdue':
        return <Badge variant="destructive" className="gap-1"><AlertCircle className="h-3 w-3" /> Overdue</Badge>;
      default:
        return null;
    }
  };

  const calculateDaysRemaining = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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
        <div>
          <h1 className="text-3xl font-bold">Library</h1>
          <p className="text-muted-foreground">Browse books, track your issued books, and manage returns</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Books Issued</CardTitle>
              <Book className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myBooks.length}</div>
              <p className="text-xs text-muted-foreground">Currently borrowed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Books</CardTitle>
              <Library className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{books.length}</div>
              <p className="text-xs text-muted-foreground">Available in library</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reading History</CardTitle>
              <History className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{history.length}</div>
              <p className="text-xs text-muted-foreground">Books borrowed total</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse">Browse Books</TabsTrigger>
            <TabsTrigger value="mybooks">My Books ({myBooks.length})</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Browse Books Tab */}
          <TabsContent value="browse" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by title, author, or ISBN..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full md:w-[220px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant={showAvailableOnly ? "default" : "outline"}
                    onClick={() => setShowAvailableOnly(!showAvailableOnly)}
                  >
                    Available Only
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Books Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {isLoading ? (
                <Card className="col-span-full">
                  <CardContent className="py-12 text-center">Loading books...</CardContent>
                </Card>
              ) : books.length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="py-12 text-center">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No books found</h3>
                    <p className="text-muted-foreground">Try adjusting your search or filters</p>
                  </CardContent>
                </Card>
              ) : (
                books.map((book) => (
                  <Card
                    key={book.id}
                    className="hover:shadow-lg transition-all cursor-pointer group"
                    onClick={() => {
                      setSelectedBook(book);
                      setViewDialogOpen(true);
                    }}
                  >
                    <CardHeader>
                      <CardTitle className="text-base group-hover:text-primary transition-colors line-clamp-2">
                        {book.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{book.author}</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{book.category}</Badge>
                        {book.availableCopies > 0 ? (
                          <Badge variant="default" className="gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Available
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1">
                            <XCircle className="h-3 w-3" />
                            Out of Stock
                          </Badge>
                        )}
                      </div>
                      
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>ISBN: {book.isbn}</p>
                        <p>Copies: {book.availableCopies}/{book.totalCopies}</p>
                        {book.publisher && <p>Publisher: {book.publisher}</p>}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* My Books Tab */}
          <TabsContent value="mybooks" className="space-y-4">
            {myBooks.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Book className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No books issued</h3>
                  <p className="text-muted-foreground">Browse the library and issue your first book!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {myBooks.map((issue) => {
                  const daysRemaining = calculateDaysRemaining(issue.dueDate);
                  const isOverdue = daysRemaining < 0;
                  
                  return (
                    <Card key={issue.id} className={isOverdue ? 'border-destructive' : ''}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">{issue.bookTitle}</h3>
                            
                            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                              <div>
                                <span className="text-muted-foreground">Issued: </span>
                                <span>{new Date(issue.issuedAt).toLocaleDateString()}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Due: </span>
                                <span className={isOverdue ? 'text-destructive font-semibold' : ''}>
                                  {new Date(issue.dueDate).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            
                            {isOverdue ? (
                              <div className="flex items-center gap-2 text-destructive text-sm font-medium">
                                <AlertCircle className="h-4 w-4" />
                                <span>Overdue by {Math.abs(daysRemaining)} days</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                <Clock className="h-4 w-4" />
                                <span>{daysRemaining} days remaining</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-col items-end gap-2">
                            {getStatusBadge(issue.status)}
                            <Button
                              size="sm"
                              onClick={() => handleReturnBook(issue.id)}
                            >
                              Return Book
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            {history.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No reading history</h3>
                  <p className="text-muted-foreground">Your borrowed books will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {history.map((issue) => (
                  <Card key={issue.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">{issue.bookTitle}</h3>
                          
                          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                            <div>
                              <span>Issued: </span>
                              <span>{new Date(issue.issuedAt).toLocaleDateString()}</span>
                            </div>
                            <div>
                              <span>Due: </span>
                              <span>{new Date(issue.dueDate).toLocaleDateString()}</span>
                            </div>
                            {issue.returnedAt && (
                              <>
                                <div>
                                  <span>Returned: </span>
                                  <span>{new Date(issue.returnedAt).toLocaleDateString()}</span>
                                </div>
                                {issue.fineAmount > 0 && (
                                  <div className="text-destructive">
                                    <span>Fine: </span>
                                    <span>₹{issue.fineAmount}</span>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          {getStatusBadge(issue.status)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* View Book Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            {selectedBook && (
              <div className="space-y-6">
                <DialogHeader>
                  <DialogTitle className="text-2xl">{selectedBook.title}</DialogTitle>
                  <p className="text-muted-foreground">{selectedBook.author}</p>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Category</p>
                    <Badge variant="outline">{selectedBook.category}</Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">ISBN</p>
                    <p className="text-sm text-muted-foreground">{selectedBook.isbn}</p>
                  </div>
                  {selectedBook.publisher && (
                    <div>
                      <p className="text-sm font-medium mb-1">Publisher</p>
                      <p className="text-sm text-muted-foreground">{selectedBook.publisher}</p>
                    </div>
                  )}
                  {selectedBook.publishedYear && (
                    <div>
                      <p className="text-sm font-medium mb-1">Year</p>
                      <p className="text-sm text-muted-foreground">{selectedBook.publishedYear}</p>
                    </div>
                  )}
                </div>

                {selectedBook.description && (
                  <div>
                    <p className="text-sm font-medium mb-2">Description</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedBook.description}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-sm font-medium">Availability</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedBook.availableCopies} of {selectedBook.totalCopies} copies available
                    </p>
                  </div>
                  
                  {selectedBook.availableCopies > 0 ? (
                    <Button onClick={() => handleIssueBook(selectedBook.id)}>
                      Issue Book
                    </Button>
                  ) : (
                    <Button disabled variant="secondary">
                      Out of Stock
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
