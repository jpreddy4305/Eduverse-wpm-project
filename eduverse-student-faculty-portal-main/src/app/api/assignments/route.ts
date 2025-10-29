import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { assignments } from '@/db/schema';
import { eq, like, and, or, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single assignment fetch
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { 
            error: "Valid ID is required",
            code: "INVALID_ID" 
          },
          { status: 400 }
        );
      }

      const assignment = await db.select()
        .from(assignments)
        .where(eq(assignments.id, parseInt(id)))
        .limit(1);

      if (assignment.length === 0) {
        return NextResponse.json(
          { error: 'Assignment not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(assignment[0], { status: 200 });
    }

    // List assignments with filters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const subject = searchParams.get('subject');
    const department = searchParams.get('department');
    const year = searchParams.get('year');

    let query = db.select().from(assignments);

    // Build WHERE conditions
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(assignments.title, `%${search}%`),
          like(assignments.description, `%${search}%`)
        )
      );
    }

    if (subject) {
      conditions.push(eq(assignments.subject, subject));
    }

    if (department) {
      conditions.push(eq(assignments.department, department));
    }

    if (year) {
      const yearInt = parseInt(year);
      if (!isNaN(yearInt)) {
        conditions.push(eq(assignments.year, yearInt));
      }
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(asc(assignments.dueDate))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      title, 
      description, 
      subject, 
      facultyName, 
      dueDate, 
      totalMarks, 
      department, 
      year 
    } = body;

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { 
          error: "Title is required",
          code: "MISSING_TITLE" 
        },
        { status: 400 }
      );
    }

    if (!description) {
      return NextResponse.json(
        { 
          error: "Description is required",
          code: "MISSING_DESCRIPTION" 
        },
        { status: 400 }
      );
    }

    if (!subject) {
      return NextResponse.json(
        { 
          error: "Subject is required",
          code: "MISSING_SUBJECT" 
        },
        { status: 400 }
      );
    }

    if (!facultyName) {
      return NextResponse.json(
        { 
          error: "Faculty name is required",
          code: "MISSING_FACULTY_NAME" 
        },
        { status: 400 }
      );
    }

    if (!dueDate) {
      return NextResponse.json(
        { 
          error: "Due date is required",
          code: "MISSING_DUE_DATE" 
        },
        { status: 400 }
      );
    }

    if (totalMarks === undefined || totalMarks === null) {
      return NextResponse.json(
        { 
          error: "Total marks is required",
          code: "MISSING_TOTAL_MARKS" 
        },
        { status: 400 }
      );
    }

    if (!department) {
      return NextResponse.json(
        { 
          error: "Department is required",
          code: "MISSING_DEPARTMENT" 
        },
        { status: 400 }
      );
    }

    if (year === undefined || year === null) {
      return NextResponse.json(
        { 
          error: "Year is required",
          code: "MISSING_YEAR" 
        },
        { status: 400 }
      );
    }

    // Validate totalMarks
    const totalMarksInt = parseInt(totalMarks);
    if (isNaN(totalMarksInt) || totalMarksInt <= 0) {
      return NextResponse.json(
        { 
          error: "Total marks must be a positive integer",
          code: "INVALID_TOTAL_MARKS" 
        },
        { status: 400 }
      );
    }

    // Validate year
    const yearInt = parseInt(year);
    if (isNaN(yearInt) || yearInt < 1 || yearInt > 4) {
      return NextResponse.json(
        { 
          error: "Year must be between 1 and 4",
          code: "INVALID_YEAR" 
        },
        { status: 400 }
      );
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

    const newAssignment = await db.insert(assignments)
      .values(sanitizedData)
      .returning();

    return NextResponse.json(newAssignment[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        },
        { status: 400 }
      );
    }

    // Check if assignment exists
    const existing = await db.select()
      .from(assignments)
      .where(eq(assignments.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const updates: any = {};

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
        return NextResponse.json(
          { 
            error: "Total marks must be a positive integer",
            code: "INVALID_TOTAL_MARKS" 
          },
          { status: 400 }
        );
      }
      updates.totalMarks = totalMarksInt;
    }

    if (body.department !== undefined) {
      updates.department = body.department.trim();
    }

    if (body.year !== undefined) {
      const yearInt = parseInt(body.year);
      if (isNaN(yearInt) || yearInt < 1 || yearInt > 4) {
        return NextResponse.json(
          { 
            error: "Year must be between 1 and 4",
            code: "INVALID_YEAR" 
          },
          { status: 400 }
        );
      }
      updates.year = yearInt;
    }

    const updated = await db.update(assignments)
      .set(updates)
      .where(eq(assignments.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        },
        { status: 400 }
      );
    }

    // Check if assignment exists
    const existing = await db.select()
      .from(assignments)
      .where(eq(assignments.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      );
    }

    const deleted = await db.delete(assignments)
      .where(eq(assignments.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      { 
        message: 'Assignment deleted successfully',
        assignment: deleted[0]
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}