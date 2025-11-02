import connectDB from '@/db';
import { Notice } from '@/db/schema';

async function main() {
    await connectDB();
    const sampleNotices = [
        {
            title: 'Mid-Term Examination Schedule - Fall 2024',
            content: 'The mid-term examinations for Fall 2024 semester will commence from March 15, 2024. All students are required to check their respective department notice boards for detailed examination schedules. Students must carry their valid ID cards and admit cards to the examination hall. Mobile phones and electronic devices are strictly prohibited during examinations. Please ensure you reach the examination center at least 30 minutes before the scheduled time.',
            author: 'Admin Office',
            authorRole: 'admin',
            department: 'Admin',
            priority: 'high',
            createdAt: new Date('2024-03-01T09:00:00.000Z').toISOString(),
        },
        {
            title: 'Workshop on Artificial Intelligence and Machine Learning',
            content: 'The Computer Science Department is organizing a two-day workshop on AI/ML fundamentals and applications. The workshop will be conducted on March 20-21, 2024, from 10:00 AM to 4:00 PM in the Computer Lab. Industry experts from leading tech companies will be sharing their insights and conducting hands-on sessions. Students interested in participating should register by March 12, 2024, through the department portal. Limited seats available.',
            author: 'Dr. Sarah Johnson',
            authorRole: 'faculty',
            department: 'Computer Science',
            priority: 'medium',
            createdAt: new Date('2024-03-03T10:30:00.000Z').toISOString(),
        },
        {
            title: 'Holiday Notice - Holi Festival',
            content: 'The institute will remain closed on March 25, 2024, on account of Holi festival. All classes, laboratory sessions, and administrative offices will be non-operational on this day. Regular academic activities will resume from March 26, 2024. Students are advised to plan their assignments and project work accordingly. We wish everyone a safe and colorful celebration.',
            author: 'Admin Office',
            authorRole: 'admin',
            department: 'Admin',
            priority: 'medium',
            createdAt: new Date('2024-03-05T11:15:00.000Z').toISOString(),
        },
        {
            title: 'Project Submission Deadline Extended',
            content: 'Due to multiple requests from students, the deadline for final year project submissions has been extended to March 30, 2024. This is the final extension and no further requests will be entertained. Students must submit their complete project reports along with working prototypes and documentation. Late submissions will not be accepted under any circumstances. For any queries, contact the respective project supervisors.',
            author: 'Dr. Rajesh Kumar',
            authorRole: 'faculty',
            department: 'Electronics',
            priority: 'high',
            createdAt: new Date('2024-03-07T14:00:00.000Z').toISOString(),
        },
        {
            title: 'Guest Lecture on Sustainable Engineering Practices',
            content: 'The Mechanical Engineering Department cordially invites all students and faculty members to attend a guest lecture on Sustainable Engineering and Green Technologies. The session will be conducted by Prof. Michael Brown from MIT on March 18, 2024, at 2:00 PM in the Main Auditorium. The lecture will cover topics including renewable energy systems, sustainable design principles, and environmental impact assessment. Attendance certificates will be provided.',
            author: 'Prof. Anita Sharma',
            authorRole: 'faculty',
            department: 'Mechanical',
            priority: 'medium',
            createdAt: new Date('2024-03-08T16:45:00.000Z').toISOString(),
        },
        {
            title: 'Library Timing Modification',
            content: 'Please note that the Central Library timing has been modified effective from March 10, 2024. The new timings are as follows: Weekdays - 8:00 AM to 10:00 PM, Saturdays - 9:00 AM to 7:00 PM, Sundays - 10:00 AM to 6:00 PM. The reading room will remain open 24/7 for students during examination period. Book return deadline has been extended by one week for all current borrowers.',
            author: 'Library Administration',
            authorRole: 'admin',
            department: 'Admin',
            priority: 'low',
            createdAt: new Date('2024-03-09T09:30:00.000Z').toISOString(),
        },
    ];

    await Notice.insertMany(sampleNotices);
    
    console.log('✅ Notices seeder completed successfully');
    process.exit(0);
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
    process.exit(1);
});
