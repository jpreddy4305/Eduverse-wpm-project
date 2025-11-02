import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/db';
import { User } from '@/db/schema';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { name, email, password, role, department, year } = await request.json();

    // Validate required fields
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Name, email, password, and role are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate enrollment number or employee ID
    const enrollmentNumber = role === 'student' && department
      ? `${department.substring(0, 2).toUpperCase()}${new Date().getFullYear()}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
      : undefined;

    const employeeId = role !== 'student'
      ? `${role.toUpperCase()}${new Date().getFullYear()}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
      : undefined;

    // Create new user
    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role,
      department: department?.trim(),
      year: role === 'student' ? year : undefined,
      enrollmentNumber,
      employeeId,
      createdAt: new Date().toISOString(),
    });

    // Return user without password
    const userObj = newUser.toObject();
    const { password: _, ...userWithoutPassword } = userObj;
    
    // Ensure id is set from _id
    if (userWithoutPassword._id) {
      userWithoutPassword.id = userWithoutPassword._id.toString();
    }

    return NextResponse.json(
      { success: true, user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

