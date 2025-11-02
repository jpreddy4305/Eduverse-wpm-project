# EduVerse - Student Faculty Portal

A comprehensive MERN stack application for managing student-faculty interactions, assignments, notices, and resources.

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Express.js, Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcrypt password hashing
- **Styling**: Tailwind CSS, shadcn/ui

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

## 🔧 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd eduverse-student-faculty-portal-main
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Create `.env.local` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/eduverse
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/eduverse?retryWrites=true&w=majority
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment to Vercel

### Step 1: Push to GitHub
1. Make sure all changes are committed:
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install --legacy-peer-deps`

### Step 3: Environment Variables
Add these in Vercel Dashboard → Project Settings → Environment Variables:

- `MONGODB_URI` - Your MongoDB connection string
- `NODE_ENV` - Set to `production`

### Step 4: Deploy
Click "Deploy" and wait for the build to complete.

## 📝 Available Scripts

- `npm run dev` - Start Next.js development server
- `npm run dev:express` - Start with Express custom server (local development)
- `npm run build` - Build for production
- `npm start` - Start production server (Next.js)
- `npm run start:express` - Start production server (Express)

## 🔐 Features

- **User Authentication**: Register/Login with MongoDB storage
- **Role-based Access**: Student, Faculty, Admin roles
- **Assignments Management**: Create, view, submit assignments
- **Notices System**: Post and view department-specific notices
- **Resources Library**: Share course materials
- **Timetable Management**: View class schedules
- **Submission Tracking**: Track assignment submissions with grading

## 🌐 API Routes

All API routes are available at `/api/*`:
- `/api/auth/register` - User registration
- `/api/auth/login` - User login
- `/api/assignments` - Assignment CRUD operations
- `/api/notices` - Notice management
- `/api/resources` - Resource management
- `/api/submissions` - Submission handling
- `/api/timetable` - Timetable operations

## 📦 Project Structure

```
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── api/         # API routes
│   │   └── dashboard/   # Dashboard pages
│   ├── components/       # React components
│   ├── contexts/        # React contexts
│   └── db/              # Database schemas and connection
├── server/              # Express server files (for local dev)
│   ├── routes/          # Express route handlers
│   ├── db.js            # MongoDB connection
│   └── models.js        # Mongoose models
└── server.js            # Express custom server
```

## 🛠️ Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `MONGODB_CONNECTION_STRING` | Alternative MongoDB URI | Yes (if MONGODB_URI not set) |
| `NODE_ENV` | Environment (development/production) | No |

## 📄 License

This project is private and proprietary.

## 👥 Authors

EduVerse Development Team
