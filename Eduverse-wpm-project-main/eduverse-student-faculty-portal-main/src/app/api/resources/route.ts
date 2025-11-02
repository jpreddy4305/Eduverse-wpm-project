import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/db';
import { Resource } from '@/db/schema';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single resource by ID
    if (id) {
      if (!id) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const resource = await Resource.findById(id);

      if (!resource) {
        return NextResponse.json({ 
          error: 'Resource not found',
          code: 'RESOURCE_NOT_FOUND'
        }, { status: 404 });
      }

      return NextResponse.json(resource, { status: 200 });
    }

    // List all resources with pagination, filtering, and search
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const type = searchParams.get('type');
    const subject = searchParams.get('subject');
    const department = searchParams.get('department');

    // Build filter query
    const filter: any = {};

    // Search condition
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by type
    if (type) {
      filter.type = type;
    }

    // Filter by subject
    if (subject) {
      filter.subject = subject;
    }

    // Filter by department
    if (department) {
      filter.department = department;
    }

    // Sort by uploadDate descending (newest first) and apply pagination
    const results = await Resource.find(filter)
      .sort({ uploadDate: -1 })
      .limit(limit)
      .skip(offset)
      .lean();

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
    await connectDB();
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
    const newResource = await Resource.create(sanitizedData);

    return NextResponse.json(newResource, { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID
    if (!id) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if resource exists
    const existingResource = await Resource.findById(id);

    if (!existingResource) {
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
    const updatedResource = await Resource.findByIdAndUpdate(id, updates, { new: true });

    return NextResponse.json(updatedResource, { status: 200 });

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID
    if (!id) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if resource exists
    const existingResource = await Resource.findById(id);

    if (!existingResource) {
      return NextResponse.json({ 
        error: 'Resource not found',
        code: 'RESOURCE_NOT_FOUND'
      }, { status: 404 });
    }

    // Delete resource
    const deletedResource = await Resource.findByIdAndDelete(id);

    return NextResponse.json({ 
      message: 'Resource deleted successfully',
      resource: deletedResource
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}
