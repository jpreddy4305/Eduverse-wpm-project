# Render Deployment Guide

This guide will help you deploy the Eduverse WPM Project to Render as a Web Service.

## Prerequisites

1. A GitHub repository with your code pushed (https://github.com/jpreddy4305/Eduverse-wpm-project)
2. A MongoDB Atlas account (or MongoDB database connection string)
3. A Render account (sign up at https://render.com)

## Deployment Steps

### Step 1: Connect GitHub Repository to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** button
3. Select **"Web Service"**
4. Connect your GitHub account if not already connected
5. Select the repository: `jpreddy4305/Eduverse-wpm-project`
6. Choose the branch: `main`

### Step 2: Configure Web Service Settings

Render should auto-detect settings from `render.yaml`, but you can also configure manually:

**Basic Settings:**
- **Name**: `eduverse-wpm-project` (or your preferred name)
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: `eduverse-student-faculty-portal-main`

**Build & Deploy:**
- **Runtime**: Node
- **Build Command**: `npm install --legacy-peer-deps && npm run build`
- **Start Command**: `npm start`
- **Plan**: Free (or choose a paid plan)

### Step 3: Set Environment Variables

In the Render dashboard, go to **Environment** tab and add:

1. **MONGODB_URI** (Required)
   - Your MongoDB Atlas connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/eduverse?retryWrites=true&w=majority`
   - Or use **MONGODB_CONNECTION_STRING** instead

2. **NODE_ENV** (Optional, but recommended)
   - Set to: `production`

3. **PORT** (Automatically set by Render)
   - Render automatically provides this variable

### Step 4: MongoDB Atlas Setup (if not already done)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster (free tier available)
3. Create a database user
4. Whitelist IP addresses:
   - Add `0.0.0.0/0` to allow all IPs (or Render's IP ranges)
5. Get your connection string and use it for `MONGODB_URI`

### Step 5: Deploy

1. Click **"Create Web Service"** or **"Save Changes"**
2. Render will start building your application
3. Monitor the build logs in the Render dashboard
4. Once deployed, your app will be available at: `https://eduverse-wpm-project.onrender.com`

## Troubleshooting

### Build Fails

- Check build logs in Render dashboard
- Ensure `package.json` has correct scripts
- Verify Node.js version compatibility (should be 18+)

### MongoDB Connection Issues

- Verify `MONGODB_URI` is correctly set in environment variables
- Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Ensure database user has correct permissions

### Port Issues

- Render automatically sets `PORT` environment variable
- Don't hardcode port in your code
- The code uses `process.env.PORT || 3000` which is correct

### Application Crashes

- Check runtime logs in Render dashboard
- Verify all environment variables are set
- Ensure MongoDB connection string is valid

## Project Structure

The project is nested in:
```
Eduverse-wpm-project-main/
  └── eduverse-student-faculty-portal-main/  ← Root directory for Render
      ├── render.yaml                        ← Render configuration
      ├── package.json
      ├── server.js                          ← Custom Express server
      └── ...
```

## Features

- ✅ Next.js 15 with React 19
- ✅ Express.js custom server
- ✅ MongoDB with Mongoose
- ✅ API routes for assignments, notices, resources, etc.
- ✅ Authentication system
- ✅ Student/Faculty portal

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [MongoDB Atlas Setup](https://docs.atlas.mongodb.com/getting-started/)

## Support

For issues, contact: jpreddy4305@gmail.com

