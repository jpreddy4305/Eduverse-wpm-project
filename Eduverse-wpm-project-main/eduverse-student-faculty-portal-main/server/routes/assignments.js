const express = require('express');
const router = express.Router();
const connectDB = require('../db');
const { Assignment } = require('../models');

// GET /api/assignments
router.get('/', async (req, res) => {
  try {
    await connectDB();
    const { id, limit, offset, search, subject, department, year } = req.query;

    // Single assignment fetch
    if (id) {
      if (!id) {
        return res.status(400).json({
          error: "Valid ID is required",
          code: "INVALID_ID"
        });
      }

      const assignment = await Assignment.findById(id);

      if (!assignment) {
        return res.status(404).json({
          error: 'Assignment not found'
        });
      }

      return res.status(200).json(assignment);
    }

    // List assignments with filters
    const limitNum = Math.min(parseInt(limit ?? '50'), 100);
    const offsetNum = parseInt(offset ?? '0');

    // Build filter query
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (subject) {
      filter.subject = subject;
    }

    if (department) {
      filter.department = department;
    }

    if (year) {
      const yearInt = parseInt(year);
      if (!isNaN(yearInt)) {
        filter.year = yearInt;
      }
    }

    const results = await Assignment.find(filter)
      .sort({ dueDate: 1 })
      .limit(limitNum)
      .skip(offsetNum)
      .lean();

    res.status(200).json(results);
  } catch (error) {
    console.error('GET error:', error);
    res.status(500).json({
      error: 'Internal server error: ' + error.message
    });
  }
});

// POST /api/assignments
router.post('/', async (req, res) => {
  try {
    await connectDB();
    const {
      title,
      description,
      subject,
      facultyName,
      dueDate,
      totalMarks,
      department,
      year
    } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({
        error: "Title is required",
        code: "MISSING_TITLE"
      });
    }

    if (!description) {
      return res.status(400).json({
        error: "Description is required",
        code: "MISSING_DESCRIPTION"
      });
    }

    if (!subject) {
      return res.status(400).json({
        error: "Subject is required",
        code: "MISSING_SUBJECT"
      });
    }

    if (!facultyName) {
      return res.status(400).json({
        error: "Faculty name is required",
        code: "MISSING_FACULTY_NAME"
      });
    }

    if (!dueDate) {
      return res.status(400).json({
        error: "Due date is required",
        code: "MISSING_DUE_DATE"
      });
    }

    if (totalMarks === undefined || totalMarks === null) {
      return res.status(400).json({
        error: "Total marks is required",
        code: "MISSING_TOTAL_MARKS"
      });
    }

    if (!department) {
      return res.status(400).json({
        error: "Department is required",
        code: "MISSING_DEPARTMENT"
      });
    }

    if (year === undefined || year === null) {
      return res.status(400).json({
        error: "Year is required",
        code: "MISSING_YEAR"
      });
    }

    // Validate totalMarks
    const totalMarksInt = parseInt(totalMarks);
    if (isNaN(totalMarksInt) || totalMarksInt <= 0) {
      return res.status(400).json({
        error: "Total marks must be a positive integer",
        code: "INVALID_TOTAL_MARKS"
      });
    }

    // Validate year
    const yearInt = parseInt(year);
    if (isNaN(yearInt) || yearInt < 1 || yearInt > 4) {
      return res.status(400).json({
        error: "Year must be between 1 and 4",
        code: "INVALID_YEAR"
      });
    }

    // Sanitize inputs
    const sanitizedData = {
      title: title.trim(),
      description: description.trim(),
      subject: subject.trim(),
      facultyName: facultyName.trim(),
      dueDate: dueDate.trim(),
      totalMarks: totalMarksInt,
      department: department.trim(),
      year: yearInt,
      createdAt: new Date().toISOString()
    };

    const newAssignment = await Assignment.create(sanitizedData);

    res.status(201).json(newAssignment);
  } catch (error) {
    console.error('POST error:', error);
    res.status(500).json({
      error: 'Internal server error: ' + error.message
    });
  }
});

// PUT /api/assignments?id=...
router.put('/', async (req, res) => {
  try {
    await connectDB();
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        error: "Valid ID is required",
        code: "INVALID_ID"
      });
    }

    // Check if assignment exists
    const existing = await Assignment.findById(id);

    if (!existing) {
      return res.status(404).json({
        error: 'Assignment not found'
      });
    }

    const body = req.body;
    const updates = {};

    // Sanitize and validate fields if provided
    if (body.title !== undefined) {
      updates.title = body.title.trim();
    }

    if (body.description !== undefined) {
      updates.description = body.description.trim();
    }

    if (body.subject !== undefined) {
      updates.subject = body.subject.trim();
    }

    if (body.facultyName !== undefined) {
      updates.facultyName = body.facultyName.trim();
    }

    if (body.dueDate !== undefined) {
      updates.dueDate = body.dueDate.trim();
    }

    if (body.totalMarks !== undefined) {
      const totalMarksInt = parseInt(body.totalMarks);
      if (isNaN(totalMarksInt) || totalMarksInt <= 0) {
        return res.status(400).json({
          error: "Total marks must be a positive integer",
          code: "INVALID_TOTAL_MARKS"
        });
      }
      updates.totalMarks = totalMarksInt;
    }

    if (body.department !== undefined) {
      updates.department = body.department.trim();
    }

    if (body.year !== undefined) {
      const yearInt = parseInt(body.year);
      if (isNaN(yearInt) || yearInt < 1 || yearInt > 4) {
        return res.status(400).json({
          error: "Year must be between 1 and 4",
          code: "INVALID_YEAR"
        });
      }
      updates.year = yearInt;
    }

    const updated = await Assignment.findByIdAndUpdate(id, updates, { new: true });

    res.status(200).json(updated);
  } catch (error) {
    console.error('PUT error:', error);
    res.status(500).json({
      error: 'Internal server error: ' + error.message
    });
  }
});

// DELETE /api/assignments?id=...
router.delete('/', async (req, res) => {
  try {
    await connectDB();
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        error: "Valid ID is required",
        code: "INVALID_ID"
      });
    }

    // Check if assignment exists
    const existing = await Assignment.findById(id);

    if (!existing) {
      return res.status(404).json({
        error: 'Assignment not found'
      });
    }

    const deleted = await Assignment.findByIdAndDelete(id);

    res.status(200).json({
      message: 'Assignment deleted successfully',
      assignment: deleted
    });
  } catch (error) {
    console.error('DELETE error:', error);
    res.status(500).json({
      error: 'Internal server error: ' + error.message
    });
  }
});

module.exports = router;

