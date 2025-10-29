import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { timetable } from '@/db/schema';
import { eq, like, and, or, desc, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single record fetch
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const record = await db.select()
        .from(timetable)
        .where(eq(timetable.id, parseInt(id)))
        .limit(1);

      if (record.length === 0) {
        return NextResponse.json({ 
          error: 'Timetable entry not found',
          code: "NOT_FOUND" 
        }, { status: 404 });
      }

      return NextResponse.json(record[0], { status: 200 });
    }

    // List with pagination, search, and filters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const dayFilter = searchParams.get('day');
    const typeFilter = searchParams.get('type');

    let query = db.select().from(timetable);

    // Build WHERE conditions
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(timetable.subject, `%${search}%`),
          like(timetable.faculty, `%${search}%`),
          like(timetable.room, `%${search}%`)
        )
      );
    }

    if (dayFilter) {
      conditions.push(eq(timetable.day, dayFilter));
    }

    if (typeFilter) {
      conditions.push(eq(timetable.type, typeFilter));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Sort by day and time
    const results = await query
      .orderBy(asc(timetable.day), asc(timetable.time))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error.message 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { day, time, subject, faculty, room, type } = body;

    // Validate required fields
    if (!day) {
      return NextResponse.json({ 
        error: "Day is required",
        code: "MISSING_DAY" 
      }, { status: 400 });
    }

    if (!time) {
      return NextResponse.json({ 
        error: "Time is required",
        code: "MISSING_TIME" 
      }, { status: 400 });
    }

    if (!subject) {
      return NextResponse.json({ 
        error: "Subject is required",
        code: "MISSING_SUBJECT" 
      }, { status: 400 });
    }

    if (!faculty) {
      return NextResponse.json({ 
        error: "Faculty is required",
        code: "MISSING_FACULTY" 
      }, { status: 400 });
    }

    if (!room) {
      return NextResponse.json({ 
        error: "Room is required",
        code: "MISSING_ROOM" 
      }, { status: 400 });
    }

    if (!type) {
      return NextResponse.json({ 
        error: "Type is required",
        code: "MISSING_TYPE" 
      }, { status: 400 });
    }

    // Validate type is one of the allowed values
    const allowedTypes = ['lecture', 'lab', 'tutorial'];
    if (!allowedTypes.includes(type.toLowerCase())) {
      return NextResponse.json({ 
        error: "Type must be one of: lecture, lab, tutorial",
        code: "INVALID_TYPE" 
      }, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedData = {
      day: day.trim(),
      time: time.trim(),
      subject: subject.trim(),
      faculty: faculty.trim(),
      room: room.trim(),
      type: type.trim().toLowerCase(),
      createdAt: new Date().toISOString()
    };

    const newEntry = await db.insert(timetable)
      .values(sanitizedData)
      .returning();

    return NextResponse.json(newEntry[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error.message 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if record exists
    const existing = await db.select()
      .from(timetable)
      .where(eq(timetable.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Timetable entry not found',
        code: "NOT_FOUND" 
      }, { status: 404 });
    }

    const body = await request.json();
    const { day, time, subject, faculty, room, type } = body;

    // Validate type if provided
    if (type) {
      const allowedTypes = ['lecture', 'lab', 'tutorial'];
      if (!allowedTypes.includes(type.toLowerCase())) {
        return NextResponse.json({ 
          error: "Type must be one of: lecture, lab, tutorial",
          code: "INVALID_TYPE" 
        }, { status: 400 });
      }
    }

    // Build update object with only provided fields
    const updates: Record<string, string> = {};

    if (day !== undefined) updates.day = day.trim();
    if (time !== undefined) updates.time = time.trim();
    if (subject !== undefined) updates.subject = subject.trim();
    if (faculty !== undefined) updates.faculty = faculty.trim();
    if (room !== undefined) updates.room = room.trim();
    if (type !== undefined) updates.type = type.trim().toLowerCase();

    const updated = await db.update(timetable)
      .set(updates)
      .where(eq(timetable.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if record exists
    const existing = await db.select()
      .from(timetable)
      .where(eq(timetable.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Timetable entry not found',
        code: "NOT_FOUND" 
      }, { status: 404 });
    }

    const deleted = await db.delete(timetable)
      .where(eq(timetable.id, parseInt(id)))
      .returning();

    return NextResponse.json({ 
      message: 'Timetable entry deleted successfully',
      deletedEntry: deleted[0]
    }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error.message 
    }, { status: 500 });
  }
}