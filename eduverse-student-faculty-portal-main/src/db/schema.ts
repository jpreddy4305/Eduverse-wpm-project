import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const timetable = sqliteTable('timetable', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  day: text('day').notNull(),
  time: text('time').notNull(),
  subject: text('subject').notNull(),
  faculty: text('faculty').notNull(),
  room: text('room').notNull(),
  type: text('type').notNull(),
  createdAt: text('created_at').notNull(),
});

export const notices = sqliteTable('notices', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  author: text('author').notNull(),
  authorRole: text('author_role').notNull(),
  department: text('department').notNull(),
  priority: text('priority').notNull(),
  createdAt: text('created_at').notNull(),
});

export const assignments = sqliteTable('assignments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  subject: text('subject').notNull(),
  facultyName: text('faculty_name').notNull(),
  dueDate: text('due_date').notNull(),
  totalMarks: integer('total_marks').notNull(),
  department: text('department').notNull(),
  year: integer('year').notNull(),
  createdAt: text('created_at').notNull(),
});

export const submissions = sqliteTable('submissions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  assignmentId: integer('assignment_id').notNull(),
  studentId: text('student_id').notNull(),
  studentName: text('student_name').notNull(),
  submittedDate: text('submitted_date').notNull(),
  fileUrl: text('file_url'),
  grade: integer('grade'),
  feedback: text('feedback'),
  status: text('status').notNull(),
  createdAt: text('created_at').notNull(),
});

export const resources = sqliteTable('resources', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  type: text('type').notNull(),
  subject: text('subject').notNull(),
  uploadedBy: text('uploaded_by').notNull(),
  uploadDate: text('upload_date').notNull(),
  url: text('url').notNull(),
  department: text('department').notNull(),
  createdAt: text('created_at').notNull(),
});