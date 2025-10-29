"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const FAQ_RESPONSES: Record<string, string> = {
  'hello': 'Hello! I\'m the EduVerse assistant. How can I help you today?',
  'hi': 'Hi there! How can I assist you?',
  'assignment': 'You can view and submit assignments from the Assignments section in your dashboard. Upcoming deadlines are displayed on your main dashboard.',
  'deadline': 'Check your dashboard for upcoming assignment deadlines. You can also visit the Assignments page for detailed information.',
  'attendance': 'Your attendance records are available in the Attendance section. It shows your attendance percentage for each subject.',
  'grades': 'You can view your grades in the Grades section. It includes midterm, assignments, and final grades.',
  'timetable': 'Your class timetable is available in the Timetable section, showing all your scheduled classes for the week.',
  'notice': 'Recent notices are displayed on your dashboard. You can view all notices in the Notices section.',
  'faculty': 'You can find faculty information and contact details in your course pages.',
  'resources': 'Study materials and resources uploaded by faculty are available in the Resources section.',
  'help': 'I can help you with information about assignments, deadlines, attendance, grades, timetable, notices, and resources. Just ask!',
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! I\'m your EduVerse assistant. Ask me about assignments, deadlines, attendance, or anything else!',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');

  const getBotResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    for (const [key, response] of Object.entries(FAQ_RESPONSES)) {
      if (lowerInput.includes(key)) {
        return response;
      }
    }
    
    return 'I\'m not sure about that. You can ask me about assignments, deadlines, attendance, grades, timetable, notices, or resources. Type "help" to see what I can do!';
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate bot typing
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(input),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 500);
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
          size="icon"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-2xl z-50 flex flex-col">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-4 border-b">
            <div className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <Bot className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">EduVerse Assistant</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.sender === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                    message.sender === 'user'
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </CardContent>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button onClick={handleSend} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
