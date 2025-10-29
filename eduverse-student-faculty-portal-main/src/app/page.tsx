"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Users, BookOpen, TrendingUp, Bell, FileText, Calendar, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const features = [
    {
      icon: Bell,
      title: 'Notice Board',
      description: 'Stay updated with important announcements and notices from faculty and administration.'
    },
    {
      icon: FileText,
      title: 'Assignment Center',
      description: 'Submit assignments, track deadlines, and receive feedback from faculty.'
    },
    {
      icon: Calendar,
      title: 'Timetable Management',
      description: 'Access your class schedule, lab timings, and academic calendar.'
    },
    {
      icon: BarChart3,
      title: 'Grade Tracking',
      description: 'Monitor your academic progress with detailed grade reports and analytics.'
    },
    {
      icon: Users,
      title: 'Attendance System',
      description: 'Track attendance records and maintain required attendance percentage.'
    },
    {
      icon: BookOpen,
      title: 'Resource Library',
      description: 'Access study materials, lecture notes, and resources shared by faculty.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground p-2 rounded-xl">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold">EduVerse</span>
          </div>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Welcome to <span className="text-primary">EduVerse</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A modern college student-faculty portal designed to bridge the communication gap and enhance academic collaboration.
          </p>
          <div className="flex gap-4 justify-center pt-6">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need for seamless academic management and communication
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:border-primary transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="bg-primary/10 text-primary p-3 rounded-xl w-fit">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center p-8 border-2">
            <CardContent className="space-y-2 p-0">
              <Users className="h-12 w-12 mx-auto text-primary mb-4" />
              <div className="text-4xl font-bold">10,000+</div>
              <div className="text-muted-foreground">Active Users</div>
            </CardContent>
          </Card>
          <Card className="text-center p-8 border-2">
            <CardContent className="space-y-2 p-0">
              <BookOpen className="h-12 w-12 mx-auto text-primary mb-4" />
              <div className="text-4xl font-bold">500+</div>
              <div className="text-muted-foreground">Courses</div>
            </CardContent>
          </Card>
          <Card className="text-center p-8 border-2">
            <CardContent className="space-y-2 p-0">
              <TrendingUp className="h-12 w-12 mx-auto text-primary mb-4" />
              <div className="text-4xl font-bold">95%</div>
              <div className="text-muted-foreground">Satisfaction Rate</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="border-2 bg-gradient-to-r from-primary to-accent text-primary-foreground">
          <CardContent className="p-12 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Get Started?</h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Join thousands of students and faculty already using EduVerse for better academic collaboration.
            </p>
            <Link href="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Create Account
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 EduVerse. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}