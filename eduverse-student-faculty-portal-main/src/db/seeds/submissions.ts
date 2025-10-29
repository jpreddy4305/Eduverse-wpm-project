import { db } from '@/db';
import { submissions } from '@/db/schema';

async function main() {
    const sampleSubmissions = [
        {
            assignmentId: 1,
            studentId: 'STU001',
            studentName: 'Rahul Sharma',
            submittedDate: new Date('2024-01-18T14:30:00').toISOString(),
            fileUrl: '/uploads/assignments/rahul_dbms_assignment.pdf',
            grade: 85,
            feedback: 'Good work, well-structured database design. Your ER diagrams are clear and normalization is properly explained. Consider adding more examples for BCNF.',
            status: 'graded',
            createdAt: new Date('2024-01-18T14:30:00').toISOString(),
        },
        {
            assignmentId: 2,
            studentId: 'STU002',
            studentName: 'Priya Patel',
            submittedDate: new Date('2024-01-19T10:15:00').toISOString(),
            fileUrl: '/uploads/assignments/priya_dsa_project.zip',
            grade: null,
            feedback: null,
            status: 'submitted',
            createdAt: new Date('2024-01-19T10:15:00').toISOString(),
        },
        {
            assignmentId: 3,
            studentName: 'Arjun Reddy',
            studentId: 'STU003',
            submittedDate: new Date('2024-01-21T09:45:00').toISOString(),
            fileUrl: '/uploads/assignments/arjun_web_dev_assignment.pdf',
            grade: null,
            feedback: null,
            status: 'submitted',
            createdAt: new Date('2024-01-21T09:45:00').toISOString(),
        },
        {
            assignmentId: 1,
            studentId: 'STU004',
            studentName: 'Sneha Gupta',
            submittedDate: new Date('2024-01-20T16:20:00').toISOString(),
            fileUrl: '/uploads/assignments/sneha_dbms_late_submission.pdf',
            grade: null,
            feedback: null,
            status: 'late',
            createdAt: new Date('2024-01-20T16:20:00').toISOString(),
        },
    ];

    await db.insert(submissions).values(sampleSubmissions);
    
    console.log('✅ Submissions seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});