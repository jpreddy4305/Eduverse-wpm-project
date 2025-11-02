# Render Web Service Setup Guide

## Render Service Configuration

Your Render service is located at: https://dashboard.render.com/web/srv-d43ns2adbo4c73arbl5g

## Quick Setup Steps

### 1. Connect Repository (if not already connected)

In your Render dashboard:
- Go to your web service
- Navigate to **Settings** tab
- Under **Source**, ensure:
  - **Repository**: `jpreddy4305/Eduverse-wpm-project`
  - **Branch**: `main`
  - **Root Directory**: `eduverse-student-faculty-portal-main` ⚠️ **IMPORTANT**

### 2. Configure Build & Deploy Settings

In **Settings** → **Build & Deploy**:
- **Build Command**: `npm install --legacy-peer-deps && npm run build`
- **Start Command**: `npm start`
- **Node Version**: `18` or `20` (recommended)

### 3. Set Environment Variables

In **Environment** tab, add these variables:

#### Required:
- **MONGODB_URI**
  - Value: Your MongoDB Atlas connection string
  - Example: `mongodb+srv://username:password@cluster.mongodb.net/eduverse?retryWrites=true&w=majority`

#### Optional but Recommended:
- **NODE_ENV**: `production` (Render sets this automatically, but you can set it explicitly)

**Note**: `PORT` is automatically set by Render - don't override it.

### 4. Deploy

1. Click **"Manual Deploy"** → **"Deploy latest commit"** OR
2. Push to your `main` branch to trigger automatic deployment

### 5. Monitor Deployment

- Watch the **Logs** tab for build progress
- Check for any errors in the build logs
- Once deployed, your service will be available at your Render URL

## Troubleshooting

### Build Fails with Dependency Issues

If you see peer dependency warnings:
- The build command already includes `--legacy-peer-deps` flag
- Check logs for specific package conflicts

### MongoDB Connection Fails

1. Verify `MONGODB_URI` is set correctly in Environment variables
2. Check MongoDB Atlas:
   - Network Access: Allow `0.0.0.0/0` (all IPs) OR add Render's IP ranges
   - Database User: Has correct permissions
3. Connection string format: `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`

### Application Crashes After Deployment

1. Check **Runtime Logs** in Render dashboard
2. Verify all environment variables are set
3. Ensure MongoDB connection string is valid
4. Check if port is correctly using `process.env.PORT` (it is in server.js)

### Root Directory Error

If Render can't find `package.json`:
- Ensure **Root Directory** is set to: `eduverse-student-faculty-portal-main`
- The `render.yaml` file should be in the repository root (not in the nested folder)

## Configuration Files

- **render.yaml**: Located in repository root - defines Render service configuration
- **server.js**: Custom Express server that wraps Next.js
- **package.json**: Contains build and start scripts

## Current Configuration

- **Build Command**: `npm install --legacy-peer-deps && npm run build`
- **Start Command**: `npm start` (runs `node server.js`)
- **Root Directory**: `eduverse-student-faculty-portal-main`
- **Runtime**: Node.js
- **Port**: Auto-assigned by Render (accessed via `process.env.PORT`)

## Verification Checklist

- [ ] Repository connected to Render
- [ ] Root Directory set to `eduverse-student-faculty-portal-main`
- [ ] Build Command configured correctly
- [ ] Start Command is `npm start`
- [ ] `MONGODB_URI` environment variable set
- [ ] MongoDB Atlas network access configured
- [ ] First deployment successful
- [ ] Application accessible at Render URL

## Next Steps

1. **Initial Deploy**: Follow steps above for first deployment
2. **Auto-Deploy**: Render automatically deploys on git push to `main` branch
3. **Monitor**: Use Render dashboard to monitor logs and metrics
4. **Scale**: Upgrade plan if needed for production traffic

## Support

For issues specific to this service:
- Check Render logs: https://dashboard.render.com/web/srv-d43ns2adbo4c73arbl5g/logs
- Render Docs: https://render.com/docs
- Contact: jpreddy4305@gmail.com

