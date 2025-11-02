import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/db';
import { Notice } from '@/db/schema';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single notice by ID
    if (id) {
      if (!id) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const notice = await Notice.findById(id);

      if (!notice) {
        return NextResponse.json(
          { error: 'Notice not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(notice, { status: 200 });
    }

    // List notices with filters and pagination
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const priority = searchParams.get('priority');
    const department = searchParams.get('department');
    const authorRole = searchParams.get('authorRole');

    // Build filter query
    const filter: any = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    if (priority) {
      filter.priority = priority;
    }

    if (department) {
      filter.department = department;
    }

    if (authorRole) {
      filter.authorRole = authorRole;
    }

    const results = await Notice.find(filter)
      .sort({ createdAt: -1 })
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

    const newNotice = await Notice.create(sanitizedData);

    return NextResponse.json(newNotice, { status: 201 });
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
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if notice exists
    const existing = await Notice.findById(id);

    if (!existing) {
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

    const updated = await Notice.findByIdAndUpdate(id, updates, { new: true });

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
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if notice exists
    const existing = await Notice.findById(id);

    if (!existing) {
      return NextResponse.json(
        { error: 'Notice not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await Notice.findByIdAndDelete(id);

    return NextResponse.json(
      {
        message: 'Notice deleted successfully',
        notice: deleted,
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
