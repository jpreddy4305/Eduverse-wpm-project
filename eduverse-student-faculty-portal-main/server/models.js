const mongoose = require('mongoose');

// User Schema
const UserSchema = new mongoose.Schema({
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
const TimetableSchema = new mongoose.Schema({
  day: { type: String, required: true },
  time: { type: String, required: true },
  subject: { type: String, required: true },
  faculty: { type: String, required: true },
  room: { type: String, required: true },
  type: { type: String, required: true },
  createdAt: { type: String, required: true },
}, { timestamps: false });

// Notices Schema
const NoticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  authorRole: { type: String, required: true },
  department: { type: String, required: true },
  priority: { type: String, required: true },
  createdAt: { type: String, required: true },
}, { timestamps: false });

// Assignments Schema
const AssignmentSchema = new mongoose.Schema({
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
const SubmissionSchema = new mongoose.Schema({
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
const ResourceSchema = new mongoose.Schema({
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
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Timetable = mongoose.models.Timetable || mongoose.model('Timetable', TimetableSchema);
const Notice = mongoose.models.Notice || mongoose.model('Notice', NoticeSchema);
const Assignment = mongoose.models.Assignment || mongoose.model('Assignment', AssignmentSchema);
const Submission = mongoose.models.Submission || mongoose.model('Submission', SubmissionSchema);
const Resource = mongoose.models.Resource || mongoose.model('Resource', ResourceSchema);

module.exports = {
  User,
  Timetable,
  Notice,
  Assignment,
  Submission,
  Resource
};

