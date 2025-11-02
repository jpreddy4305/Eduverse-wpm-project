import connectDB from '@/db';
import { Resource } from '@/db/schema';

async function main() {
    await connectDB();
    const sampleResources = [
        {
            title: 'DBMS Lecture Notes - Chapter 5: Normalization',
            type: 'pdf',
            subject: 'DBMS',
            uploadedBy: 'Dr. Michael Chen',
            uploadDate: new Date('2024-12-15').toISOString(),
            url: '/resources/dbms-chapter5-normalization.pdf',
            department: 'Computer Science',
            createdAt: new Date('2024-12-15').toISOString(),
        },
        {
            title: 'Binary Search Tree Implementation Tutorial',
            type: 'video',
            subject: 'Data Structures',
            uploadedBy: 'Dr. Sarah Johnson',
            uploadDate: new Date('2024-12-18').toISOString(),
            url: 'https://youtube.com/watch?v=pYT9F8_LFTM',
            department: 'Computer Science',
            createdAt: new Date('2024-12-18').toISOString(),
        },
        {
            title: 'React.js Official Documentation - Hooks Guide',
            type: 'link',
            subject: 'Web Development',
            uploadedBy: 'Prof. Robert Williams',
            uploadDate: new Date('2024-12-20').toISOString(),
            url: 'https://react.dev/reference/react/hooks',
            department: 'Computer Science',
            createdAt: new Date('2024-12-20').toISOString(),
        },
        {
            title: 'Network Protocols Reference Sheet - TCP/IP Suite',
            type: 'pdf',
            subject: 'Computer Networks',
            uploadedBy: 'Dr. Emily Davis',
            uploadDate: new Date('2024-12-22').toISOString(),
            url: '/resources/network-protocols-tcpip.pdf',
            department: 'Computer Science',
            createdAt: new Date('2024-12-22').toISOString(),
        },
        {
            title: 'Operating Systems Lab Manual 2024 - Process Scheduling',
            type: 'document',
            subject: 'Operating Systems',
            uploadedBy: 'Dr. Sarah Johnson',
            uploadDate: new Date('2024-12-25').toISOString(),
            url: '/resources/os-lab-manual-2024.docx',
            department: 'Computer Science',
            createdAt: new Date('2024-12-25').toISOString(),
        },
    ];

    await Resource.insertMany(sampleResources);
    
    console.log('✅ Resources seeder completed successfully');
    process.exit(0);
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
    process.exit(1);
});
