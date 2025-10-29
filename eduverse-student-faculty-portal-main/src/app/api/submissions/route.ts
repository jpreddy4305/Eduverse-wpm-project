import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { submissions } from '@/db/schema';
import { eq, like, and, or, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single submission by ID
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

      const submission = await db.select()
        .from(submissions)
        .where(eq(submissions.id, parseInt(id)))
        .limit(1);

      if (submission.length === 0) {
        return NextResponse.json(
          { error: 'Submission not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(submission[0], { status: 200 });
    }

    // List submissions with pagination, filtering, and search
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const assignmentId = searchParams.get('assignmentId');
    const studentId = searchParams.get('studentId');
    const status = searchParams.get('status');

    let query = db.select().from(submissions);

    // Build filter conditions
    const conditions = [];

    if (assignmentId) {
      conditions.push(eq(submissions.assignmentId, parseInt(assignmentId)));
    }

    if (studentId) {
      conditions.push(eq(submissions.studentId, studentId));
    }

    if (status) {
      conditions.push(eq(submissions.status, status));
    }

    if (search) {
      conditions.push(like(submissions.studentName, `%${search}%`));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(submissions.submittedDate))
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
      assignmentId, 
      studentId, 
      studentName, 
      submittedDate, 
      fileUrl, 
      status 
    } = body;

    // Validate required fields
    if (!assignmentId) {
      return NextResponse.json(
        { 
          error: "Assignment ID is required",
          code: "MISSING_ASSIGNMENT_ID" 
        },
        { status: 400 }
      );
    }

    if (!studentId) {
      return NextResponse.json(
        { 
          error: "Student ID is required",
          code: "MISSING_STUDENT_ID" 
        },
        { status: 400 }
      );
    }

    if (!studentName) {
      return NextResponse.json(
        { 
          error: "Student name is required",
          code: "MISSING_STUDENT_NAME" 
        },
        { status: 400 }
      );
    }

    if (!submittedDate) {
      return NextResponse.json(
        { 
          error: "Submitted date is required",
          code: "MISSING_SUBMITTED_DATE" 
        },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { 
          error: "Status is required",
          code: "MISSING_STATUS" 
        },
        { status: 400 }
      );
    }

    // Validate assignmentId is positive integer
    if (isNaN(parseInt(assignmentId)) || parseInt(assignmentId) <= 0) {
      return NextResponse.json(
        { 
          error: "Assignment ID must be a positive integer",
          code: "INVALID_ASSIGNMENT_ID" 
        },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['submitted', 'graded', 'late'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { 
          error: "Status must be 'submitted', 'graded', or 'late'",
          code: "INVALID_STATUS" 
        },
        { status: 400 }
      );
    }

    // Sanitize inputs
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

    const newSubmission = await db.insert(submissions)
      .values(sanitizedData)
      .returning();

    return NextResponse.json(newSubmission[0], { status: 201 });

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

    // Check if submission exists
    const existingSubmission = await db.select()
      .from(submissions)
      .where(eq(submissions.id, parseInt(id)))
      .limit(1);

    if (existingSubmission.length === 0) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { grade, feedback, status } = body;

    // Validate grade if provided
    if (grade !== undefined && grade !== null) {
      if (isNaN(parseInt(grade)) || parseInt(grade) < 0 || parseInt(grade) > 100) {
        return NextResponse.json(
          { 
            error: "Grade must be between 0 and 100",
            code: "INVALID_GRADE" 
          },
          { status: 400 }
        );
      }
    }

    // Validate status if provided
    if (status !== undefined && status !== null) {
      const validStatuses = ['submitted', 'graded', 'late'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { 
            error: "Status must be 'submitted', 'graded', or 'late'",
            code: "INVALID_STATUS" 
          },
          { status: 400 }
        );
      }
    }

    // Build update object
    const updates: Record<string, any> = {};

    if (grade !== undefined && grade !== null) {
      updates.grade = parseInt(grade);
      // Automatically set status to 'graded' when grade is provided
      updates.status = 'graded';
    }

    if (feedback !== undefined && feedback !== null) {
      updates.feedback = feedback.trim();
    }

    // Only update status separately if grade wasn't provided
    if (status !== undefined && status !== null && updates.grade === undefined) {
      updates.status = status.trim();
    }

    const updated = await db.update(submissions)
      .set(updates)
      .where(eq(submissions.id, parseInt(id)))
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

    // Check if submission exists
    const existingSubmission = await db.select()
      .from(submissions)
      .where(eq(submissions.id, parseInt(id)))
      .limit(1);

    if (existingSubmission.length === 0) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    const deleted = await db.delete(submissions)
      .where(eq(submissions.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      { 
        message: 'Submission deleted successfully',
        submission: deleted[0]
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