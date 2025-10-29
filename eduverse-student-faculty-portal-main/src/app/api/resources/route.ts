import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { resources } from '@/db/schema';
import { eq, like, and, or, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single resource by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const resource = await db.select()
        .from(resources)
        .where(eq(resources.id, parseInt(id)))
        .limit(1);

      if (resource.length === 0) {
        return NextResponse.json({ 
          error: 'Resource not found',
          code: 'RESOURCE_NOT_FOUND'
        }, { status: 404 });
      }

      return NextResponse.json(resource[0], { status: 200 });
    }

    // List all resources with pagination, filtering, and search
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const type = searchParams.get('type');
    const subject = searchParams.get('subject');
    const department = searchParams.get('department');

    let query = db.select().from(resources);

    const conditions = [];

    // Search condition
    if (search) {
      conditions.push(
        or(
          like(resources.title, `%${search}%`),
          like(resources.subject, `%${search}%`)
        )
      );
    }

    // Filter by type
    if (type) {
      conditions.push(eq(resources.type, type));
    }

    // Filter by subject
    if (subject) {
      conditions.push(eq(resources.subject, subject));
    }

    // Filter by department
    if (department) {
      conditions.push(eq(resources.department, department));
    }

    // Apply all conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Sort by uploadDate descending (newest first) and apply pagination
    const results = await query
      .orderBy(desc(resources.uploadDate))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, type, subject, uploadedBy, uploadDate, url, department } = body;

    // Validate required fields
    if (!title || !type || !subject || !uploadedBy || !uploadDate || !url || !department) {
      return NextResponse.json({ 
        error: "All required fields must be provided: title, type, subject, uploadedBy, uploadDate, url, department",
        code: "MISSING_REQUIRED_FIELDS" 
      }, { status: 400 });
    }

    // Validate type
    const validTypes = ['pdf', 'video', 'link', 'document'];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ 
        error: `Invalid type. Must be one of: ${validTypes.join(', ')}`,
        code: "INVALID_TYPE" 
      }, { status: 400 });
    }

    // Sanitize inputs
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

    // Insert new resource
    const newResource = await db.insert(resources)
      .values(sanitizedData)
      .returning();

    return NextResponse.json(newResource[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if resource exists
    const existingResource = await db.select()
      .from(resources)
      .where(eq(resources.id, parseInt(id)))
      .limit(1);

    if (existingResource.length === 0) {
      return NextResponse.json({ 
        error: 'Resource not found',
        code: 'RESOURCE_NOT_FOUND'
      }, { status: 404 });
    }

    const body = await request.json();
    const { title, type, subject, uploadedBy, uploadDate, url, department } = body;

    // Validate type if provided
    if (type) {
      const validTypes = ['pdf', 'video', 'link', 'document'];
      if (!validTypes.includes(type)) {
        return NextResponse.json({ 
          error: `Invalid type. Must be one of: ${validTypes.join(', ')}`,
          code: "INVALID_TYPE" 
        }, { status: 400 });
      }
    }

    // Build update object with sanitized inputs
    const updates: Record<string, string> = {};
    
    if (title !== undefined) updates.title = title.trim();
    if (type !== undefined) updates.type = type.trim();
    if (subject !== undefined) updates.subject = subject.trim();
    if (uploadedBy !== undefined) updates.uploadedBy = uploadedBy.trim();
    if (uploadDate !== undefined) updates.uploadDate = uploadDate.trim();
    if (url !== undefined) updates.url = url.trim();
    if (department !== undefined) updates.department = department.trim();

    // Update resource
    const updatedResource = await db.update(resources)
      .set(updates)
      .where(eq(resources.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedResource[0], { status: 200 });

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if resource exists
    const existingResource = await db.select()
      .from(resources)
      .where(eq(resources.id, parseInt(id)))
      .limit(1);

    if (existingResource.length === 0) {
      return NextResponse.json({ 
        error: 'Resource not found',
        code: 'RESOURCE_NOT_FOUND'
      }, { status: 404 });
    }

    // Delete resource
    const deletedResource = await db.delete(resources)
      .where(eq(resources.id, parseInt(id)))
      .returning();

    return NextResponse.json({ 
      message: 'Resource deleted successfully',
      resource: deletedResource[0]
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}