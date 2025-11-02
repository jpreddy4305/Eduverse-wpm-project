const express = require('express');
const router = express.Router();
const connectDB = require('../db');
const { Timetable } = require('../models');

router.get('/', async (req, res) => {
  try {
    await connectDB();
    const { id, limit, offset, search, day, type } = req.query;

    if (id) {
      if (!id) {
        return res.status(400).json({ error: "Valid ID is required", code: "INVALID_ID" });
      }

      const record = await Timetable.findById(id);
      if (!record) {
        return res.status(404).json({ error: 'Timetable entry not found', code: "NOT_FOUND" });
      }

      return res.status(200).json(record);
    }

    const limitNum = Math.min(parseInt(limit ?? '50'), 100);
    const offsetNum = parseInt(offset ?? '0');

    const filter = {};

    if (search) {
      filter.$or = [
        { subject: { $regex: search, $options: 'i' } },
        { faculty: { $regex: search, $options: 'i' } },
        { room: { $regex: search, $options: 'i' } }
      ];
    }

    if (day) filter.day = day;
    if (type) filter.type = type;

    const results = await Timetable.find(filter)
      .sort({ day: 1, time: 1 })
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
    const { day, time, subject, faculty, room, type } = req.body;

    if (!day) return res.status(400).json({ error: "Day is required", code: "MISSING_DAY" });
    if (!time) return res.status(400).json({ error: "Time is required", code: "MISSING_TIME" });
    if (!subject) return res.status(400).json({ error: "Subject is required", code: "MISSING_SUBJECT" });
    if (!faculty) return res.status(400).json({ error: "Faculty is required", code: "MISSING_FACULTY" });
    if (!room) return res.status(400).json({ error: "Room is required", code: "MISSING_ROOM" });
    if (!type) return res.status(400).json({ error: "Type is required", code: "MISSING_TYPE" });

    const allowedTypes = ['lecture', 'lab', 'tutorial'];
    if (!allowedTypes.includes(type.toLowerCase())) {
      return res.status(400).json({ error: "Type must be one of: lecture, lab, tutorial", code: "INVALID_TYPE" });
    }

    const sanitizedData = {
      day: day.trim(),
      time: time.trim(),
      subject: subject.trim(),
      faculty: faculty.trim(),
      room: room.trim(),
      type: type.trim().toLowerCase(),
      createdAt: new Date().toISOString()
    };

    const newEntry = await Timetable.create(sanitizedData);
    res.status(201).json(newEntry);
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

    const existing = await Timetable.findById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Timetable entry not found', code: "NOT_FOUND" });
    }

    const { day, time, subject, faculty, room, type } = req.body;

    if (type) {
      const allowedTypes = ['lecture', 'lab', 'tutorial'];
      if (!allowedTypes.includes(type.toLowerCase())) {
        return res.status(400).json({ error: "Type must be one of: lecture, lab, tutorial", code: "INVALID_TYPE" });
      }
    }

    const updates = {};
    if (day !== undefined) updates.day = day.trim();
    if (time !== undefined) updates.time = time.trim();
    if (subject !== undefined) updates.subject = subject.trim();
    if (faculty !== undefined) updates.faculty = faculty.trim();
    if (room !== undefined) updates.room = room.trim();
    if (type !== undefined) updates.type = type.trim().toLowerCase();

    const updated = await Timetable.findByIdAndUpdate(id, updates, { new: true });
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

    const existing = await Timetable.findById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Timetable entry not found', code: "NOT_FOUND" });
    }

    const deleted = await Timetable.findByIdAndDelete(id);
    res.status(200).json({ message: 'Timetable entry deleted successfully', deletedEntry: deleted });
  } catch (error) {
    console.error('DELETE error:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
});

module.exports = router;

