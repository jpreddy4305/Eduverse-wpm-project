"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, FileText, Calendar, TrendingUp, Clock, BookOpen, Users, BarChart3, MessageSquare, Library, ArrowRight, Sparkles, Award, Target, Zap } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { mockNotices, mockAssignments, mockAttendance, mockGrades } from '@/lib/data/mockData';

// Lazy load chatbot - only loads when needed
const Chatbot = dynamic(() => import('@/components/Chatbot'), {
  ssr: false,
  loading: () => null
});

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  // Memoize calculations to prevent recalculation on every render
  const studentStats = useMemo(() => {
    const upcomingAssignments = mockAssignments.filter(a => new Date(a.dueDate) > new Date()).length;
    const totalClasses = mockAttendance.length;
    const presentClasses = mockAttendance.filter(a => a.status === 'present').length;
    const attendancePercentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;
    const averageGrade = mockGrades.length > 0 
      ? mockGrades.reduce((acc, g) => acc + (g.total || 0), 0) / mockGrades.length 
      : 0;

    return {
      upcomingAssignments,
      totalClasses,
      presentClasses,
      attendancePercentage,
      averageGrade
    };
  }, []);

  // Memoize sliced arrays
  const recentNotices = useMemo(() => mockNotices.slice(0, 3), []);
  const upcomingAssignmentsList = useMemo(() => mockAssignments.slice(0, 3), []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Enhanced Welcome Section with Modern Gradient */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-accent to-primary p-10 text-primary-foreground shadow-2xl">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-full bg-white/20 backdrop-blur-sm">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold uppercase tracking-wider opacity-95">Welcome back!</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">{user.name}</h1>
            <p className="text-primary-foreground/90 max-w-2xl text-lg leading-relaxed">
              {user.role === 'student' && "Ready to continue your learning journey? Check out your assignments, join study groups, and explore the library."}
              {user.role === 'faculty' && "Manage your classes, track student progress, and engage with the academic community."}
              {user.role === 'admin' && "Monitor system performance and manage the entire academic ecosystem."}
            </p>
          </div>
          {/* Animated background elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-primary-foreground/10 rounded-full blur-2xl"></div>
        </div>

        {/* Enhanced Feature Highlight Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Link href="/dashboard/discussions" className="group">
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-indigo-500/10 dark:from-blue-500/20 dark:via-blue-500/10 dark:to-indigo-500/20 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 h-full backdrop-blur-sm">
              <CardContent className="pt-8 pb-6 px-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                    <div className="relative p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                      <MessageSquare className="h-7 w-7" />
                    </div>
                  </div>
                  <Badge className="gap-1.5 px-3 py-1 bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30 shadow-sm">
                    <Sparkles className="h-3 w-3" />
                    New
                  </Badge>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Discussion Forums
                </h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  Ask questions, share knowledge, and collaborate with peers across all subjects.
                </p>
                <div className="flex items-center text-sm text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-3 transition-all">
                  Explore Discussions
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </CardContent>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:w-40 group-hover:h-40 transition-all duration-500"></div>
            </Card>
          </Link>

          <Link href="/dashboard/study-groups" className="group">
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-pink-500/10 dark:from-purple-500/20 dark:via-purple-500/10 dark:to-pink-500/20 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 h-full backdrop-blur-sm">
              <CardContent className="pt-8 pb-6 px-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                    <div className="relative p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                      <Users className="h-7 w-7" />
                    </div>
                  </div>
                  <Badge className="gap-1.5 px-3 py-1 bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30 shadow-sm">
                    <Sparkles className="h-3 w-3" />
                    New
                  </Badge>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  Study Groups
                </h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  Join or create study groups, collaborate on projects, and learn together.
                </p>
                <div className="flex items-center text-sm text-purple-600 dark:text-purple-400 font-semibold group-hover:gap-3 transition-all">
                  Join a Group
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </CardContent>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:w-40 group-hover:h-40 transition-all duration-500"></div>
            </Card>
          </Link>

          <Link href="/dashboard/library" className="group">
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-teal-500/10 dark:from-emerald-500/20 dark:via-emerald-500/10 dark:to-teal-500/20 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 h-full backdrop-blur-sm">
              <CardContent className="pt-8 pb-6 px-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                    <div className="relative p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                      <Library className="h-7 w-7" />
                    </div>
                  </div>
                  <Badge className="gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 shadow-sm">
                    <Sparkles className="h-3 w-3" />
                    New
                  </Badge>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Digital Library
                </h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  Browse books, track issued books, and manage your reading history digitally.
                </p>
                <div className="flex items-center text-sm text-emerald-600 dark:text-emerald-400 font-semibold group-hover:gap-3 transition-all">
                  Browse Library
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </CardContent>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:w-40 group-hover:h-40 transition-all duration-500"></div>
            </Card>
          </Link>
        </div>

        {/* Student Dashboard */}
        {user.role === 'student' && (
          <>
            {/* Enhanced Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 dark:from-orange-500/20 dark:to-red-500/20 hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-500 hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">Assignments Due</CardTitle>
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg group-hover:scale-110 transition-transform">
                    <FileText className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-1">{studentStats.upcomingAssignments}</div>
                  <p className="text-xs text-muted-foreground font-medium">Upcoming submissions</p>
                  <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">Attendance</CardTitle>
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg group-hover:scale-110 transition-transform">
                    <Calendar className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-1">{studentStats.attendancePercentage}%</div>
                  <p className="text-xs text-muted-foreground font-medium">{studentStats.presentClasses} of {studentStats.totalClasses} classes</p>
                  <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500" style={{ width: `${studentStats.attendancePercentage}%` }}></div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 hover:shadow-xl hover:shadow-green-500/20 transition-all duration-500 hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">Average Grade</CardTitle>
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg group-hover:scale-110 transition-transform">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-1">{studentStats.averageGrade.toFixed(1)}</div>
                  <p className="text-xs text-muted-foreground font-medium">Out of 100</p>
                  <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style={{ width: `${studentStats.averageGrade}%` }}></div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">Unread Notices</CardTitle>
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg group-hover:scale-110 transition-transform">
                    <Bell className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-1">{mockNotices.length}</div>
                  <p className="text-xs text-muted-foreground font-medium">New announcements</p>
                  <div className="mt-3 flex items-center gap-1">
                    <Zap className="h-3 w-3 text-purple-500" />
                    <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">Stay updated</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Recent Notices */}
            <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Bell className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Recent Notices</CardTitle>
                  </div>
                  <Link href="/dashboard/notices">
                    <Button variant="ghost" size="sm" className="gap-2 hover:gap-3 transition-all">
                      View All
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentNotices.map((notice) => (
                  <div key={notice.id} className="group relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 hover:from-muted hover:to-muted/50 transition-all duration-300 hover:shadow-lg border border-transparent hover:border-primary/20">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg group-hover:blur-xl transition-all"></div>
                        <div className="relative p-3 rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg">
                          <Bell className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3 mb-2">
                          <h3 className="font-bold text-base group-hover:text-primary transition-colors flex-1">{notice.title}</h3>
                          <Badge variant={notice.priority === 'high' ? 'destructive' : 'secondary'} className="shrink-0 shadow-sm">
                            {notice.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-3">{notice.content}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="font-medium">{notice.author}</span>
                          <span className="w-1 h-1 rounded-full bg-muted-foreground/50"></span>
                          <span>{new Date(notice.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Enhanced Upcoming Assignments */}
            <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <FileText className="h-5 w-5 text-accent" />
                    </div>
                    <CardTitle className="text-2xl">Upcoming Assignments</CardTitle>
                  </div>
                  <Link href="/dashboard/assignments">
                    <Button variant="ghost" size="sm" className="gap-2 hover:gap-3 transition-all">
                      View All
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingAssignmentsList.map((assignment) => (
                  <div key={assignment.id} className="group relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 hover:from-muted hover:to-muted/50 transition-all duration-300 hover:shadow-lg border border-transparent hover:border-accent/20">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-accent/20 rounded-xl blur-lg group-hover:blur-xl transition-all"></div>
                        <div className="relative p-3 rounded-xl bg-gradient-to-br from-accent to-secondary text-primary-foreground shadow-lg">
                          <FileText className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base mb-1 group-hover:text-accent transition-colors">{assignment.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{assignment.subject}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                          </div>
                          <span className="w-1 h-1 rounded-full bg-muted-foreground/50"></span>
                          <div className="flex items-center gap-1.5">
                            <Award className="h-3.5 w-3.5" />
                            <span>{assignment.totalMarks} marks</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}

        {/* Faculty Dashboard */}
        {user.role === 'faculty' && (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">Total Students</CardTitle>
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg group-hover:scale-110 transition-transform">
                    <Users className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-1">156</div>
                  <p className="text-xs text-muted-foreground font-medium">Across all courses</p>
                  <div className="mt-3 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-blue-500" />
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">+12 this month</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">Assignments</CardTitle>
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg group-hover:scale-110 transition-transform">
                    <FileText className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-1">{mockAssignments.length}</div>
                  <p className="text-xs text-muted-foreground font-medium">Active assignments</p>
                  <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-orange-500/10 to-amber-500/10 dark:from-orange-500/20 dark:to-amber-500/20 hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-500 hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">Submissions</CardTitle>
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg group-hover:scale-110 transition-transform">
                    <Clock className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-1">12</div>
                  <p className="text-xs text-muted-foreground font-medium">Pending review</p>
                  <div className="mt-3 flex items-center gap-1">
                    <Target className="h-3 w-3 text-orange-500" />
                    <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">Review soon</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 hover:shadow-xl hover:shadow-green-500/20 transition-all duration-500 hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">Avg Attendance</CardTitle>
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg group-hover:scale-110 transition-transform">
                    <Calendar className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-1">87%</div>
                  <p className="text-xs text-muted-foreground font-medium">This semester</p>
                  <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style={{ width: '87%' }}></div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Quick Actions</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/dashboard/post-notice">
                    <Button className="w-full justify-start group hover:shadow-lg transition-all h-12 text-base" variant="outline">
                      <div className="p-1.5 rounded-lg bg-primary/10 mr-3 group-hover:bg-primary/20 transition-colors">
                        <Bell className="h-4 w-4" />
                      </div>
                      Post a Notice
                      <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Button>
                  </Link>
                  <Link href="/dashboard/assignments">
                    <Button className="w-full justify-start group hover:shadow-lg transition-all h-12 text-base" variant="outline">
                      <div className="p-1.5 rounded-lg bg-purple-500/10 mr-3 group-hover:bg-purple-500/20 transition-colors">
                        <FileText className="h-4 w-4" />
                      </div>
                      Create Assignment
                      <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Button>
                  </Link>
                  <Link href="/dashboard/attendance">
                    <Button className="w-full justify-start group hover:shadow-lg transition-all h-12 text-base" variant="outline">
                      <div className="p-1.5 rounded-lg bg-blue-500/10 mr-3 group-hover:bg-blue-500/20 transition-colors">
                        <Calendar className="h-4 w-4" />
                      </div>
                      Mark Attendance
                      <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Button>
                  </Link>
                  <Link href="/dashboard/grades">
                    <Button className="w-full justify-start group hover:shadow-lg transition-all h-12 text-base" variant="outline">
                      <div className="p-1.5 rounded-lg bg-green-500/10 mr-3 group-hover:bg-green-500/20 transition-colors">
                        <BarChart3 className="h-4 w-4" />
                      </div>
                      Update Grades
                      <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <Clock className="h-5 w-5 text-accent" />
                    </div>
                    <CardTitle className="text-xl">Recent Activity</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 hover:from-muted hover:to-muted/50 transition-all">
                    <p className="font-semibold text-sm mb-1">John Smith submitted assignment</p>
                    <p className="text-sm text-muted-foreground mb-2">Data Structures Assignment 3</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>2 hours ago</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 hover:from-muted hover:to-muted/50 transition-all">
                    <p className="font-semibold text-sm mb-1">Emily Davis submitted assignment</p>
                    <p className="text-sm text-muted-foreground mb-2">Data Structures Assignment 3</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>5 hours ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Admin Dashboard */}
        {user.role === 'admin' && (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-violet-500/10 to-purple-500/10 dark:from-violet-500/20 dark:to-purple-500/20 hover:shadow-xl hover:shadow-violet-500/20 transition-all duration-500 hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">Total Users</CardTitle>
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-lg group-hover:scale-110 transition-transform">
                    <Users className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-1">10,247</div>
                  <p className="text-xs text-muted-foreground font-medium">+180 from last month</p>
                  <div className="mt-3 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-violet-500" />
                    <span className="text-xs text-violet-600 dark:text-violet-400 font-medium">Growing fast</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">Active Courses</CardTitle>
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg group-hover:scale-110 transition-transform">
                    <BookOpen className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-1">523</div>
                  <p className="text-xs text-muted-foreground font-medium">Across all departments</p>
                  <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 dark:from-orange-500/20 dark:to-red-500/20 hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-500 hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">Submissions</CardTitle>
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg group-hover:scale-110 transition-transform">
                    <FileText className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-1">1,234</div>
                  <p className="text-xs text-muted-foreground font-medium">This week</p>
                  <div className="mt-3 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-orange-500" />
                    <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">Active week</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 hover:shadow-xl hover:shadow-green-500/20 transition-all duration-500 hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">System Health</CardTitle>
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg group-hover:scale-110 transition-transform">
                    <BarChart3 className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-1">99.9%</div>
                  <p className="text-xs text-muted-foreground font-medium">Uptime</p>
                  <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style={{ width: '99.9%' }}></div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Quick Actions</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/dashboard/users">
                    <Button className="w-full justify-start group hover:shadow-lg transition-all h-12 text-base" variant="outline">
                      <div className="p-1.5 rounded-lg bg-violet-500/10 mr-3 group-hover:bg-violet-500/20 transition-colors">
                        <Users className="h-4 w-4" />
                      </div>
                      Manage Users
                      <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Button>
                  </Link>
                  <Link href="/dashboard/announcements">
                    <Button className="w-full justify-start group hover:shadow-lg transition-all h-12 text-base" variant="outline">
                      <div className="p-1.5 rounded-lg bg-blue-500/10 mr-3 group-hover:bg-blue-500/20 transition-colors">
                        <Bell className="h-4 w-4" />
                      </div>
                      Broadcast Announcement
                      <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Button>
                  </Link>
                  <Link href="/dashboard/analytics">
                    <Button className="w-full justify-start group hover:shadow-lg transition-all h-12 text-base" variant="outline">
                      <div className="p-1.5 rounded-lg bg-orange-500/10 mr-3 group-hover:bg-orange-500/20 transition-colors">
                        <BarChart3 className="h-4 w-4" />
                      </div>
                      View Analytics
                      <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Button>
                  </Link>
                  <Link href="/dashboard/settings">
                    <Button className="w-full justify-start group hover:shadow-lg transition-all h-12 text-base" variant="outline">
                      <div className="p-1.5 rounded-lg bg-green-500/10 mr-3 group-hover:bg-green-500/20 transition-colors">
                        <BookOpen className="h-4 w-4" />
                      </div>
                      System Settings
                      <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <Clock className="h-5 w-5 text-accent" />
                    </div>
                    <CardTitle className="text-xl">Recent Activity</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 hover:from-muted hover:to-muted/50 transition-all">
                    <p className="font-semibold text-sm mb-1">New user registered</p>
                    <p className="text-sm text-muted-foreground mb-2">Student - Computer Science</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>10 minutes ago</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 hover:from-muted hover:to-muted/50 transition-all">
                    <p className="font-semibold text-sm mb-1">Faculty posted notice</p>
                    <p className="text-sm text-muted-foreground mb-2">Mid-semester examination schedule</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>2 hours ago</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 hover:from-muted hover:to-muted/50 transition-all">
                    <p className="font-semibold text-sm mb-1">System backup completed</p>
                    <p className="text-sm text-muted-foreground mb-2">All data backed up successfully</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>6 hours ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>

      <Chatbot />
    </DashboardLayout>
  );
}