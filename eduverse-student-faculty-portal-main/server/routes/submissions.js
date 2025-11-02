const express = require('express');
const router = express.Router();
const connectDB = require('../db');
const { Submission } = require('../models');

router.get('/', async (req, res) => {
  try {
    await connectDB();
    const { id, limit, offset, search, assignmentId, studentId, status } = req.query;

    if (id) {
      if (!id) {
        return res.status(400).json({ error: "Valid ID is required", code: "INVALID_ID" });
      }

      const submission = await Submission.findById(id);
      if (!submission) {
        return res.status(404).json({ error: 'Submission not found' });
      }

      return res.status(200).json(submission);
    }

    const limitNum = Math.min(parseInt(limit ?? '50'), 100);
    const offsetNum = parseInt(offset ?? '0');

    const filter = {};

    if (assignmentId) filter.assignmentId = parseInt(assignmentId);
    if (studentId) filter.studentId = studentId;
    if (status) filter.status = status;
    if (search) filter.studentName = { $regex: search, $options: 'i' };

    const results = await Submission.find(filter)
      .sort({ submittedDate: -1 })
      .limit(limitNum)
      .skip(offsetNum)
      .lean();

    res.status(200).json(results);
  } catch (error) {
    console.error('GET error:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    await connectDB();
    const { assignmentId, studentId, studentName, submittedDate, fileUrl, status } = req.body;

    if (!assignmentId) {
      return res.status(400).json({ error: "Assignment ID is required", code: "MISSING_ASSIGNMENT_ID" });
    }
    if (!studentId) {
      return res.status(400).json({ error: "Student ID is required", code: "MISSING_STUDENT_ID" });
    }
    if (!studentName) {
      return res.status(400).json({ error: "Student name is required", code: "MISSING_STUDENT_NAME" });
    }
    if (!submittedDate) {
      return res.status(400).json({ error: "Submitted date is required", code: "MISSING_SUBMITTED_DATE" });
    }
    if (!status) {
      return res.status(400).json({ error: "Status is required", code: "MISSING_STATUS" });
    }

    if (isNaN(parseInt(assignmentId)) || parseInt(assignmentId) <= 0) {
      return res.status(400).json({ error: "Assignment ID must be a positive integer", code: "INVALID_ASSIGNMENT_ID" });
    }

    const validStatuses = ['submitted', 'graded', 'late'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Status must be 'submitted', 'graded', or 'late'", code: "INVALID_STATUS" });
    }

    const sanitizedData = {
      assignmentId: parseInt(assignmentId),
      studentId: studentId.trim(),
      studentName: studentName.trim(),
      submittedDate: submittedDate.trim(),
      fileUrl: fileUrl ? fileUrl.trim() : null,
      grade: null,
      feedback: null,
      status: status.trim(),
      createdAt: new Date().toISOString()
    };

    const newSubmission = await Submission.create(sanitizedData);
    res.status(201).json(newSubmission);
  } catch (error) {
    console.error('POST error:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
});

router.put('/', async (req, res) => {
  try {
    await connectDB();
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "Valid ID is required", code: "INVALID_ID" });
    }

    const existingSubmission = await Submission.findById(id);
    if (!existingSubmission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    const { grade, feedback, status } = req.body;

    if (grade !== undefined && grade !== null) {
      if (isNaN(parseInt(grade)) || parseInt(grade) < 0 || parseInt(grade) > 100) {
        return res.status(400).json({ error: "Grade must be between 0 and 100", code: "INVALID_GRADE" });
      }
    }

    if (status !== undefined && status !== null) {
      const validStatuses = ['submitted', 'graded', 'late'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Status must be 'submitted', 'graded', or 'late'", code: "INVALID_STATUS" });
      }
    }

    const updates = {};

    if (grade !== undefined && grade !== null) {
      updates.grade = parseInt(grade);
      updates.status = 'graded';
    }

    if (feedback !== undefined && feedback !== null) {
      updates.feedback = feedback.trim();
    }

    if (status !== undefined && status !== null && updates.grade === undefined) {
      updates.status = status.trim();
    }

    const updated = await Submission.findByIdAndUpdate(id, updates, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    console.error('PUT error:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
});

router.delete('/', async (req, res) => {
  try {
    await connectDB();
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "Valid ID is required", code: "INVALID_ID" });
    }

    const existingSubmission = await Submission.findById(id);
    if (!existingSubmission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    const deleted = await Submission.findByIdAndDelete(id);
    res.status(200).json({ message: 'Submission deleted successfully', submission: deleted });
  } catch (error) {
    console.error('DELETE error:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
});

module.exports = router;

