import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { notices } from '@/db/schema';
import { eq, like, and, or, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single notice by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const notice = await db
        .select()
        .from(notices)
        .where(eq(notices.id, parseInt(id)))
        .limit(1);

      if (notice.length === 0) {
        return NextResponse.json(
          { error: 'Notice not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(notice[0], { status: 200 });
    }

    // List notices with filters and pagination
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const priority = searchParams.get('priority');
    const department = searchParams.get('department');
    const authorRole = searchParams.get('authorRole');

    let query = db.select().from(notices);

    // Build conditions array
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(notices.title, `%${search}%`),
          like(notices.content, `%${search}%`)
        )
      );
    }

    if (priority) {
      conditions.push(eq(notices.priority, priority));
    }

    if (department) {
      conditions.push(eq(notices.department, department));
    }

    if (authorRole) {
      conditions.push(eq(notices.authorRole, authorRole));
    }

    // Apply all conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting, pagination
    const results = await query
      .orderBy(desc(notices.createdAt))
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
    const { title, content, author, authorRole, department, priority } = body;

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required', code: 'MISSING_TITLE' },
        { status: 400 }
      );
    }

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required', code: 'MISSING_CONTENT' },
        { status: 400 }
      );
    }

    if (!author) {
      return NextResponse.json(
        { error: 'Author is required', code: 'MISSING_AUTHOR' },
        { status: 400 }
      );
    }

    if (!authorRole) {
      return NextResponse.json(
        { error: 'Author role is required', code: 'MISSING_AUTHOR_ROLE' },
        { status: 400 }
      );
    }

    if (!department) {
      return NextResponse.json(
        { error: 'Department is required', code: 'MISSING_DEPARTMENT' },
        { status: 400 }
      );
    }

    if (!priority) {
      return NextResponse.json(
        { error: 'Priority is required', code: 'MISSING_PRIORITY' },
        { status: 400 }
      );
    }

    // Validate authorRole
    if (!['faculty', 'admin'].includes(authorRole)) {
      return NextResponse.json(
        {
          error: 'Author role must be "faculty" or "admin"',
          code: 'INVALID_AUTHOR_ROLE',
        },
        { status: 400 }
      );
    }

    // Validate priority
    if (!['low', 'medium', 'high'].includes(priority)) {
      return NextResponse.json(
        {
          error: 'Priority must be "low", "medium", or "high"',
          code: 'INVALID_PRIORITY',
        },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedData = {
      title: title.trim(),
      content: content.trim(),
      author: author.trim(),
      authorRole: authorRole.trim(),
      department: department.trim(),
      priority: priority.trim(),
      createdAt: new Date().toISOString(),
    };

    const newNotice = await db
      .insert(notices)
      .values(sanitizedData)
      .returning();

    return NextResponse.json(newNotice[0], { status: 201 });
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
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if notice exists
    const existing = await db
      .select()
      .from(notices)
      .where(eq(notices.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Notice not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { title, content, author, authorRole, department, priority } = body;

    // Validate authorRole if provided
    if (authorRole && !['faculty', 'admin'].includes(authorRole)) {
      return NextResponse.json(
        {
          error: 'Author role must be "faculty" or "admin"',
          code: 'INVALID_AUTHOR_ROLE',
        },
        { status: 400 }
      );
    }

    // Validate priority if provided
    if (priority && !['low', 'medium', 'high'].includes(priority)) {
      return NextResponse.json(
        {
          error: 'Priority must be "low", "medium", or "high"',
          code: 'INVALID_PRIORITY',
        },
        { status: 400 }
      );
    }

    // Build update object with only provided fields
    const updates: Record<string, string> = {};

    if (title !== undefined) {
      updates.title = title.trim();
    }

    if (content !== undefined) {
      updates.content = content.trim();
    }

    if (author !== undefined) {
      updates.author = author.trim();
    }

    if (authorRole !== undefined) {
      updates.authorRole = authorRole.trim();
    }

    if (department !== undefined) {
      updates.department = department.trim();
    }

    if (priority !== undefined) {
      updates.priority = priority.trim();
    }

    const updated = await db
      .update(notices)
      .set(updates)
      .where(eq(notices.id, parseInt(id)))
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
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if notice exists
    const existing = await db
      .select()
      .from(notices)
      .where(eq(notices.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Notice not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(notices)
      .where(eq(notices.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Notice deleted successfully',
        notice: deleted[0],
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