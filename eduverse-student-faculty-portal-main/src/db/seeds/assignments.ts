import connectDB from '@/db';
import { Assignment } from '@/db/schema';

async function main() {
    await connectDB();
    const sampleAssignments = [
        {
            title: 'Database Design Project - E-Commerce System',
            description: 'Design and implement a complete database schema for an e-commerce platform. Include ER diagrams, normalization up to 3NF, SQL scripts for table creation, and sample queries. Document all design decisions and provide a detailed report explaining the relationships, constraints, and indexing strategies used.',
            subject: 'Database Management Systems',
            facultyName: 'Dr. Sarah Johnson',
            dueDate: new Date('2024-12-30').toISOString(),
            totalMarks: 50,
            department: 'Computer Science',
            year: 3,
            createdAt: new Date('2024-12-15').toISOString(),
        },
        {
            title: 'Network Protocol Implementation - TCP/IP Stack',
            description: 'Implement a simplified version of the TCP/IP protocol stack in C/C++. Your implementation should include packet creation, checksum calculation, basic flow control, and error handling. Demonstrate the working with a client-server application. Submit source code, documentation, and a video demonstration of the working system.',
            subject: 'Computer Networks',
            facultyName: 'Prof. Robert Williams',
            dueDate: new Date('2025-01-08').toISOString(),
            totalMarks: 100,
            department: 'Computer Science',
            year: 4,
            createdAt: new Date('2024-12-16').toISOString(),
        },
        {
            title: 'Data Structures Assignment 3 - Binary Trees and AVL Trees',
            description: 'Implement and analyze binary search trees and AVL trees. Create programs for insertion, deletion, and traversal operations. Compare time complexities and provide detailed analysis with graphs. Include test cases for various scenarios including balanced and unbalanced trees. Submit code with proper comments and a comprehensive analysis report.',
            subject: 'Data Structures',
            facultyName: 'Dr. Michael Chen',
            dueDate: new Date('2024-12-27').toISOString(),
            totalMarks: 30,
            department: 'Computer Science',
            year: 2,
            createdAt: new Date('2024-12-17').toISOString(),
        },
        {
            title: 'Operating Systems Lab Report - Process Scheduling Simulation',
            description: 'Develop a process scheduling simulator implementing FCFS, SJF, Round Robin, and Priority scheduling algorithms. Compare their performance metrics including average waiting time, turnaround time, and CPU utilization. Create a detailed lab report with implementation details, test cases, performance graphs, and analysis. Include a user interface for algorithm visualization.',
            subject: 'Operating Systems',
            facultyName: 'Dr. Emily Davis',
            dueDate: new Date('2025-01-03').toISOString(),
            totalMarks: 80,
            department: 'Computer Science',
            year: 3,
            createdAt: new Date('2024-12-18').toISOString(),
        },
        {
            title: 'Full Stack Web Application Development - Student Portal',
            description: 'Build a complete student portal web application using modern web technologies (React/Next.js for frontend, Node.js/Express for backend). Features must include user authentication, profile management, course enrollment, grade viewing, and responsive design. Deploy the application and submit the source code, deployment link, API documentation, and a detailed project report explaining architecture and technology choices.',
            subject: 'Web Development',
            facultyName: 'Dr. Sarah Johnson',
            dueDate: new Date('2025-01-13').toISOString(),
            totalMarks: 100,
            department: 'Computer Science',
            year: 4,
            createdAt: new Date('2024-12-19').toISOString(),
        },
    ];

    await Assignment.insertMany(sampleAssignments);
    
    console.log('✅ Assignments seeder completed successfully');
    process.exit(0);
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
    process.exit(1);
});
