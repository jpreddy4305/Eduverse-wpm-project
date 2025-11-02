const express = require('express');
const router = express.Router();
const connectDB = require('../db');
const { Notice } = require('../models');

router.get('/', async (req, res) => {
  try {
    await connectDB();
    const { id, limit, offset, search, priority, department, authorRole } = req.query;

    if (id) {
      if (!id) {
        return res.status(400).json({ error: 'Valid ID is required', code: 'INVALID_ID' });
      }

      const notice = await Notice.findById(id);
      if (!notice) {
        return res.status(404).json({ error: 'Notice not found', code: 'NOT_FOUND' });
      }

      return res.status(200).json(notice);
    }

    const limitNum = Math.min(parseInt(limit ?? '50'), 100);
    const offsetNum = parseInt(offset ?? '0');

    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    if (priority) filter.priority = priority;
    if (department) filter.department = department;
    if (authorRole) filter.authorRole = authorRole;

    const results = await Notice.find(filter)
      .sort({ createdAt: -1 })
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
    const { title, content, author, authorRole, department, priority } = req.body;

    if (!title) return res.status(400).json({ error: 'Title is required', code: 'MISSING_TITLE' });
    if (!content) return res.status(400).json({ error: 'Content is required', code: 'MISSING_CONTENT' });
    if (!author) return res.status(400).json({ error: 'Author is required', code: 'MISSING_AUTHOR' });
    if (!authorRole) return res.status(400).json({ error: 'Author role is required', code: 'MISSING_AUTHOR_ROLE' });
    if (!department) return res.status(400).json({ error: 'Department is required', code: 'MISSING_DEPARTMENT' });
    if (!priority) return res.status(400).json({ error: 'Priority is required', code: 'MISSING_PRIORITY' });

    if (!['faculty', 'admin'].includes(authorRole)) {
      return res.status(400).json({ error: 'Author role must be "faculty" or "admin"', code: 'INVALID_AUTHOR_ROLE' });
    }

    if (!['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({ error: 'Priority must be "low", "medium", or "high"', code: 'INVALID_PRIORITY' });
    }

    const sanitizedData = {
      title: title.trim(),
      content: content.trim(),
      author: author.trim(),
      authorRole: authorRole.trim(),
      department: department.trim(),
      priority: priority.trim(),
      createdAt: new Date().toISOString(),
    };

    const newNotice = await Notice.create(sanitizedData);
    res.status(201).json(newNotice);
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
      return res.status(400).json({ error: 'Valid ID is required', code: 'INVALID_ID' });
    }

    const existing = await Notice.findById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Notice not found', code: 'NOT_FOUND' });
    }

    const { title, content, author, authorRole, department, priority } = req.body;

    if (authorRole && !['faculty', 'admin'].includes(authorRole)) {
      return res.status(400).json({ error: 'Author role must be "faculty" or "admin"', code: 'INVALID_AUTHOR_ROLE' });
    }

    if (priority && !['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({ error: 'Priority must be "low", "medium", or "high"', code: 'INVALID_PRIORITY' });
    }

    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (content !== undefined) updates.content = content.trim();
    if (author !== undefined) updates.author = author.trim();
    if (authorRole !== undefined) updates.authorRole = authorRole.trim();
    if (department !== undefined) updates.department = department.trim();
    if (priority !== undefined) updates.priority = priority.trim();

    const updated = await Notice.findByIdAndUpdate(id, updates, { new: true });
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
      return res.status(400).json({ error: 'Valid ID is required', code: 'INVALID_ID' });
    }

    const existing = await Notice.findById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Notice not found', code: 'NOT_FOUND' });
    }

    const deleted = await Notice.findByIdAndDelete(id);
    res.status(200).json({ message: 'Notice deleted successfully', notice: deleted });
  } catch (error) {
    console.error('DELETE error:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
});

module.exports = router;

