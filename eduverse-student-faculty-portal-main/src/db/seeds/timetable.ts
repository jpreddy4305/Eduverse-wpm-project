import connectDB from '@/db';
import { Timetable } from '@/db/schema';

async function main() {
    await connectDB();
    const sampleTimetable = [
        // Monday - 4 entries
        {
            day: 'Monday',
            time: '9:00 AM - 10:00 AM',
            subject: 'Data Structures',
            faculty: 'Dr. Sarah Johnson',
            room: 'CS-101',
            type: 'lecture',
            createdAt: new Date().toISOString(),
        },
        {
            day: 'Monday',
            time: '10:00 AM - 11:00 AM',
            subject: 'DBMS',
            faculty: 'Dr. Michael Chen',
            room: 'CS-102',
            type: 'lecture',
            createdAt: new Date().toISOString(),
        },
        {
            day: 'Monday',
            time: '11:00 AM - 12:00 PM',
            subject: 'Computer Networks',
            faculty: 'Prof. Robert Williams',
            room: 'CS-103',
            type: 'tutorial',
            createdAt: new Date().toISOString(),
        },
        {
            day: 'Monday',
            time: '2:00 PM - 5:00 PM',
            subject: 'Web Development',
            faculty: 'Dr. Emily Davis',
            room: 'CS-Lab-1',
            type: 'lab',
            createdAt: new Date().toISOString(),
        },

        // Tuesday - 4 entries
        {
            day: 'Tuesday',
            time: '9:00 AM - 10:00 AM',
            subject: 'Operating Systems',
            faculty: 'Prof. James Miller',
            room: 'CS-101',
            type: 'lecture',
            createdAt: new Date().toISOString(),
        },
        {
            day: 'Tuesday',
            time: '10:00 AM - 11:00 AM',
            subject: 'Software Engineering',
            faculty: 'Dr. Sarah Johnson',
            room: 'CS-102',
            type: 'lecture',
            createdAt: new Date().toISOString(),
        },
        {
            day: 'Tuesday',
            time: '11:00 AM - 12:00 PM',
            subject: 'Data Structures',
            faculty: 'Dr. Sarah Johnson',
            room: 'CS-103',
            type: 'tutorial',
            createdAt: new Date().toISOString(),
        },
        {
            day: 'Tuesday',
            time: '2:00 PM - 5:00 PM',
            subject: 'DBMS',
            faculty: 'Dr. Michael Chen',
            room: 'CS-Lab-2',
            type: 'lab',
            createdAt: new Date().toISOString(),
        },

        // Wednesday - 3 entries
        {
            day: 'Wednesday',
            time: '9:00 AM - 10:00 AM',
            subject: 'Computer Networks',
            faculty: 'Prof. Robert Williams',
            room: 'CS-101',
            type: 'lecture',
            createdAt: new Date().toISOString(),
        },
        {
            day: 'Wednesday',
            time: '10:00 AM - 11:00 AM',
            subject: 'Web Development',
            faculty: 'Dr. Emily Davis',
            room: 'CS-102',
            type: 'lecture',
            createdAt: new Date().toISOString(),
        },
        {
            day: 'Wednesday',
            time: '2:00 PM - 5:00 PM',
            subject: 'Operating Systems',
            faculty: 'Prof. James Miller',
            room: 'CS-Lab-1',
            type: 'lab',
            createdAt: new Date().toISOString(),
        },

        // Thursday - 3 entries
        {
            day: 'Thursday',
            time: '9:00 AM - 10:00 AM',
            subject: 'Data Structures',
            faculty: 'Dr. Sarah Johnson',
            room: 'CS-101',
            type: 'lecture',
            createdAt: new Date().toISOString(),
        },
        {
            day: 'Thursday',
            time: '11:00 AM - 12:00 PM',
            subject: 'DBMS',
            faculty: 'Dr. Michael Chen',
            room: 'CS-103',
            type: 'tutorial',
            createdAt: new Date().toISOString(),
        },
        {
            day: 'Thursday',
            time: '2:00 PM - 5:00 PM',
            subject: 'Computer Networks',
            faculty: 'Prof. Robert Williams',
            room: 'CS-Lab-2',
            type: 'lab',
            createdAt: new Date().toISOString(),
        },

        // Friday - 4 entries
        {
            day: 'Friday',
            time: '9:00 AM - 10:00 AM',
            subject: 'Software Engineering',
            faculty: 'Dr. Sarah Johnson',
            room: 'CS-101',
            type: 'lecture',
            createdAt: new Date().toISOString(),
        },
        {
            day: 'Friday',
            time: '10:00 AM - 11:00 AM',
            subject: 'Operating Systems',
            faculty: 'Prof. James Miller',
            room: 'CS-102',
            type: 'lecture',
            createdAt: new Date().toISOString(),
        },
        {
            day: 'Friday',
            time: '11:00 AM - 12:00 PM',
            subject: 'Web Development',
            faculty: 'Dr. Emily Davis',
            room: 'CS-103',
            type: 'tutorial',
            createdAt: new Date().toISOString(),
        },
        {
            day: 'Friday',
            time: '2:00 PM - 5:00 PM',
            subject: 'Data Structures',
            faculty: 'Dr. Sarah Johnson',
            room: 'CS-Lab-1',
            type: 'lab',
            createdAt: new Date().toISOString(),
        },

        // Saturday - 2 entries
        {
            day: 'Saturday',
            time: '9:00 AM - 10:00 AM',
            subject: 'Computer Networks',
            faculty: 'Prof. Robert Williams',
            room: 'CS-101',
            type: 'lecture',
            createdAt: new Date().toISOString(),
        },
        {
            day: 'Saturday',
            time: '10:00 AM - 11:00 AM',
            subject: 'Software Engineering',
            faculty: 'Dr. Sarah Johnson',
            room: 'CS-102',
            type: 'lecture',
            createdAt: new Date().toISOString(),
        },
    ];

    await Timetable.insertMany(sampleTimetable);
    
    console.log('✅ Timetable seeder completed successfully');
    process.exit(0);
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
    process.exit(1);
});
