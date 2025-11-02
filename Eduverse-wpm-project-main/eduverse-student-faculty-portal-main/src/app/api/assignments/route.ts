import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/db';
import { Assignment } from '@/db/schema';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single assignment fetch
    if (id) {
      if (!id) {
        return NextResponse.json(
          { 
            error: "Valid ID is required",
            code: "INVALID_ID" 
          },
          { status: 400 }
        );
      }

      const assignment = await Assignment.findById(id);

      if (!assignment) {
        return NextResponse.json(
          { error: 'Assignment not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(assignment, { status: 200 });
    }

    // List assignments with filters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const subject = searchParams.get('subject');
    const department = searchParams.get('department');
    const year = searchParams.get('year');

    // Build filter query
    const filter: any = {};

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
      .limit(limit)
      .skip(offset)
      .lean();

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
    await connectDB();
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

    const newAssignment = await Assignment.create(sanitizedData);

    return NextResponse.json(newAssignment, { status: 201 });
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
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        },
        { status: 400 }
      );
    }

    // Check if assignment exists
    const existing = await Assignment.findById(id);

    if (!existing) {
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

    const updated = await Assignment.findByIdAndUpdate(id, updates, { new: true });

    return NextResponse.json(updated, { status: 200 });
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
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        },
        { status: 400 }
      );
    }

    // Check if assignment exists
    const existing = await Assignment.findById(id);

    if (!existing) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      );
    }

    const deleted = await Assignment.findByIdAndDelete(id);

    return NextResponse.json(
      { 
        message: 'Assignment deleted successfully',
        assignment: deleted
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
