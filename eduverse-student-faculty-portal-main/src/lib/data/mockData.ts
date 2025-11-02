export interface Notice {
  id: string;
  title: string;
  content: string;
  author: string;
  authorRole: 'faculty' | 'admin';
  department: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  facultyName: string;
  dueDate: string;
  totalMarks: number;
  department: string;
  year: number;
  attachments?: string[];
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedDate: string;
  fileUrl?: string;
  grade?: number;
  feedback?: string;
  status: 'submitted' | 'graded' | 'late';
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  subject: string;
  date: string;
  status: 'present' | 'absent' | 'late';
}

export interface TimetableSlot {
  id: string;
  day: string;
  time: string;
  subject: string;
  faculty: string;
  room: string;
  type: 'lecture' | 'lab' | 'tutorial';
}

export interface Grade {
  id: string;
  studentId: string;
  subject: string;
  midterm?: number;
  endterm?: number;
  assignments?: number;
  total?: number;
  grade?: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'link' | 'document';
  subject: string;
  uploadedBy: string;
  uploadDate: string;
  url: string;
  department: string;
}

export const mockNotices: Notice[] = [
  {
    id: '1',
    title: 'Mid-Semester Examinations Schedule',
    content: 'The mid-semester examinations will be conducted from March 15-22. Students are requested to check their exam schedules on the portal.',
    author: 'Dr. Sarah Johnson',
    authorRole: 'faculty',
    department: 'Computer Science',
    date: '2024-03-01',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Workshop on Machine Learning',
    content: 'A 3-day workshop on Machine Learning fundamentals will be organized from March 10-12. Interested students can register.',
    author: 'Admin User',
    authorRole: 'admin',
    department: 'Computer Science',
    date: '2024-02-28',
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Library Hours Extended',
    content: 'The library hours have been extended till 10 PM on weekdays to facilitate better study environment.',
    author: 'Admin User',
    authorRole: 'admin',
    department: 'All',
    date: '2024-02-25',
    priority: 'low'
  }
];

export const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Data Structures Assignment 3',
    description: 'Implement Binary Search Tree with insertion, deletion, and traversal operations.',
    subject: 'Data Structures',
    facultyName: 'Dr. Sarah Johnson',
    dueDate: '2024-03-20',
    totalMarks: 20,
    department: 'Computer Science',
    year: 3
  },
  {
    id: '2',
    title: 'Database Management System Project',
    description: 'Design and implement a database system for a library management system.',
    subject: 'DBMS',
    facultyName: 'Dr. Sarah Johnson',
    dueDate: '2024-03-25',
    totalMarks: 30,
    department: 'Computer Science',
    year: 3
  },
  {
    id: '3',
    title: 'Computer Networks Lab Report',
    description: 'Submit a detailed lab report on TCP/IP protocol analysis.',
    subject: 'Computer Networks',
    facultyName: 'Dr. Michael Chen',
    dueDate: '2024-03-18',
    totalMarks: 15,
    department: 'Computer Science',
    year: 3
  }
];

export const mockSubmissions: Submission[] = [
  {
    id: '1',
    assignmentId: '1',
    studentId: '1',
    studentName: 'John Smith',
    submittedDate: '2024-03-15',
    status: 'graded',
    grade: 18,
    feedback: 'Excellent work! Well-structured code.'
  },
  {
    id: '2',
    assignmentId: '1',
    studentId: '4',
    studentName: 'Emily Davis',
    submittedDate: '2024-03-16',
    status: 'submitted'
  }
];

export const mockAttendance: AttendanceRecord[] = [
  { id: '1', studentId: '1', subject: 'Data Structures', date: '2024-03-01', status: 'present' },
  { id: '2', studentId: '1', subject: 'DBMS', date: '2024-03-01', status: 'present' },
  { id: '3', studentId: '1', subject: 'Computer Networks', date: '2024-03-01', status: 'present' },
  { id: '4', studentId: '1', subject: 'Data Structures', date: '2024-03-02', status: 'present' },
  { id: '5', studentId: '1', subject: 'DBMS', date: '2024-03-02', status: 'absent' },
];

export const mockTimetable: TimetableSlot[] = [
  { id: '1', day: 'Monday', time: '9:00 AM - 10:00 AM', subject: 'Data Structures', faculty: 'Dr. Sarah Johnson', room: 'CS-101', type: 'lecture' },
  { id: '2', day: 'Monday', time: '10:00 AM - 11:00 AM', subject: 'DBMS', faculty: 'Dr. Sarah Johnson', room: 'CS-102', type: 'lecture' },
  { id: '3', day: 'Monday', time: '2:00 PM - 5:00 PM', subject: 'Computer Networks Lab', faculty: 'Dr. Michael Chen', room: 'CS-Lab-1', type: 'lab' },
  { id: '4', day: 'Tuesday', time: '9:00 AM - 10:00 AM', subject: 'Computer Networks', faculty: 'Dr. Michael Chen', room: 'CS-103', type: 'lecture' },
  { id: '5', day: 'Wednesday', time: '11:00 AM - 12:00 PM', subject: 'Data Structures', faculty: 'Dr. Sarah Johnson', room: 'CS-101', type: 'tutorial' },
];

export const mockGrades: Grade[] = [
  {
    id: '1',
    studentId: '1',
    subject: 'Data Structures',
    midterm: 38,
    assignments: 18,
    total: 56,
    grade: 'A'
  },
  {
    id: '2',
    studentId: '1',
    subject: 'DBMS',
    midterm: 35,
    assignments: 22,
    total: 57,
    grade: 'A'
  },
  {
    id: '3',
    studentId: '1',
    subject: 'Computer Networks',
    midterm: 32,
    assignments: 16,
    total: 48,
    grade: 'B+'
  }
];

export const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Introduction to Algorithms - Lecture Notes',
    type: 'pdf',
    subject: 'Data Structures',
    uploadedBy: 'Dr. Sarah Johnson',
    uploadDate: '2024-02-15',
    url: '#',
    department: 'Computer Science'
  },
  {
    id: '2',
    title: 'Database Normalization Tutorial',
    type: 'video',
    subject: 'DBMS',
    uploadedBy: 'Dr. Sarah Johnson',
    uploadDate: '2024-02-20',
    url: '#',
    department: 'Computer Science'
  },
  {
    id: '3',
    title: 'OSI Model Explained',
    type: 'link',
    subject: 'Computer Networks',
    uploadedBy: 'Dr. Michael Chen',
    uploadDate: '2024-02-22',
    url: '#',
    department: 'Computer Science'
  }
];
