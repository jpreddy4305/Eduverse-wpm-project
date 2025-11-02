const express = require('express');
const router = express.Router();
const connectDB = require('../db');
const { Resource } = require('../models');

router.get('/', async (req, res) => {
  try {
    await connectDB();
    const { id, limit, offset, search, type, subject, department } = req.query;

    if (id) {
      if (!id) {
        return res.status(400).json({ error: "Valid ID is required", code: "INVALID_ID" });
      }

      const resource = await Resource.findById(id);
      if (!resource) {
        return res.status(404).json({ error: 'Resource not found', code: 'RESOURCE_NOT_FOUND' });
      }

      return res.status(200).json(resource);
    }

    const limitNum = Math.min(parseInt(limit ?? '50'), 100);
    const offsetNum = parseInt(offset ?? '0');

    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    if (type) filter.type = type;
    if (subject) filter.subject = subject;
    if (department) filter.department = department;

    const results = await Resource.find(filter)
      .sort({ uploadDate: -1 })
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
    const { title, type, subject, uploadedBy, uploadDate, url, department } = req.body;

    if (!title || !type || !subject || !uploadedBy || !uploadDate || !url || !department) {
      return res.status(400).json({
        error: "All required fields must be provided: title, type, subject, uploadedBy, uploadDate, url, department",
        code: "MISSING_REQUIRED_FIELDS"
      });
    }

    const validTypes = ['pdf', 'video', 'link', 'document'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        error: `Invalid type. Must be one of: ${validTypes.join(', ')}`,
        code: "INVALID_TYPE"
      });
    }

    const sanitizedData = {
      title: title.trim(),
      type: type.trim(),
      subject: subject.trim(),
      uploadedBy: uploadedBy.trim(),
      uploadDate: uploadDate.trim(),
      url: url.trim(),
      department: department.trim(),
      createdAt: new Date().toISOString()
    };

    const newResource = await Resource.create(sanitizedData);
    res.status(201).json(newResource);
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

    const existingResource = await Resource.findById(id);
    if (!existingResource) {
      return res.status(404).json({ error: 'Resource not found', code: 'RESOURCE_NOT_FOUND' });
    }

    const { title, type, subject, uploadedBy, uploadDate, url, department } = req.body;

    if (type) {
      const validTypes = ['pdf', 'video', 'link', 'document'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({
          error: `Invalid type. Must be one of: ${validTypes.join(', ')}`,
          code: "INVALID_TYPE"
        });
      }
    }

    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (type !== undefined) updates.type = type.trim();
    if (subject !== undefined) updates.subject = subject.trim();
    if (uploadedBy !== undefined) updates.uploadedBy = uploadedBy.trim();
    if (uploadDate !== undefined) updates.uploadDate = uploadDate.trim();
    if (url !== undefined) updates.url = url.trim();
    if (department !== undefined) updates.department = department.trim();

    const updatedResource = await Resource.findByIdAndUpdate(id, updates, { new: true });
    res.status(200).json(updatedResource);
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

    const existingResource = await Resource.findById(id);
    if (!existingResource) {
      return res.status(404).json({ error: 'Resource not found', code: 'RESOURCE_NOT_FOUND' });
    }

    const deletedResource = await Resource.findByIdAndDelete(id);
    res.status(200).json({ message: 'Resource deleted successfully', resource: deletedResource });
  } catch (error) {
    console.error('DELETE error:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
});

module.exports = router;

