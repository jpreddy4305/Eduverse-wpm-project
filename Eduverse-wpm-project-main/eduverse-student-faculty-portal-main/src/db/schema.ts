import mongoose, { Schema, Document } from 'mongoose';

// User Schema
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'faculty' | 'admin';
  department?: string;
  year?: number;
  enrollmentNumber?: string;
  employeeId?: string;
  profileImage?: string;
  createdAt: string;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['student', 'faculty', 'admin'] },
  department: { type: String },
  year: { type: Number },
  enrollmentNumber: { type: String },
  employeeId: { type: String },
  profileImage: { type: String },
  createdAt: { type: String, required: true },
}, { timestamps: false });

// Timetable Schema
export interface ITimetable extends Document {
  day: string;
  time: string;
  subject: string;
  faculty: string;
  room: string;
  type: string;
  createdAt: string;
}

const TimetableSchema = new Schema<ITimetable>({
  day: { type: String, required: true },
  time: { type: String, required: true },
  subject: { type: String, required: true },
  faculty: { type: String, required: true },
  room: { type: String, required: true },
  type: { type: String, required: true },
  createdAt: { type: String, required: true },
}, { timestamps: false });

// Notices Schema
export interface INotice extends Document {
  title: string;
  content: string;
  author: string;
  authorRole: string;
  department: string;
  priority: string;
  createdAt: string;
}

const NoticeSchema = new Schema<INotice>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  authorRole: { type: String, required: true },
  department: { type: String, required: true },
  priority: { type: String, required: true },
  createdAt: { type: String, required: true },
}, { timestamps: false });

// Assignments Schema
export interface IAssignment extends Document {
  title: string;
  description: string;
  subject: string;
  facultyName: string;
  dueDate: string;
  totalMarks: number;
  department: string;
  year: number;
  createdAt: string;
}

const AssignmentSchema = new Schema<IAssignment>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  subject: { type: String, required: true },
  facultyName: { type: String, required: true },
  dueDate: { type: String, required: true },
  totalMarks: { type: Number, required: true },
  department: { type: String, required: true },
  year: { type: Number, required: true },
  createdAt: { type: String, required: true },
}, { timestamps: false });

// Submissions Schema
export interface ISubmission extends Document {
  assignmentId: number;
  studentId: string;
  studentName: string;
  submittedDate: string;
  fileUrl?: string | null;
  grade?: number | null;
  feedback?: string | null;
  status: string;
  createdAt: string;
}

const SubmissionSchema = new Schema<ISubmission>({
  assignmentId: { type: Number, required: true },
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  submittedDate: { type: String, required: true },
  fileUrl: { type: String, default: null },
  grade: { type: Number, default: null },
  feedback: { type: String, default: null },
  status: { type: String, required: true },
  createdAt: { type: String, required: true },
}, { timestamps: false });

// Resources Schema
export interface IResource extends Document {
  title: string;
  type: string;
  subject: string;
  uploadedBy: string;
  uploadDate: string;
  url: string;
  department: string;
  createdAt: string;
}

const ResourceSchema = new Schema<IResource>({
  title: { type: String, required: true },
  type: { type: String, required: true },
  subject: { type: String, required: true },
  uploadedBy: { type: String, required: true },
  uploadDate: { type: String, required: true },
  url: { type: String, required: true },
  department: { type: String, required: true },
  createdAt: { type: String, required: true },
}, { timestamps: false });

// Export models
export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const Timetable = mongoose.models.Timetable || mongoose.model<ITimetable>('Timetable', TimetableSchema);
export const Notice = mongoose.models.Notice || mongoose.model<INotice>('Notice', NoticeSchema);
export const Assignment = mongoose.models.Assignment || mongoose.model<IAssignment>('Assignment', AssignmentSchema);
export const Submission = mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema);
export const Resource = mongoose.models.Resource || mongoose.model<IResource>('Resource', ResourceSchema);
