# Quick Deploy to Render - Service: srv-d43ns2adbo4c73arbl5g

## ✅ Files Ready for Deployment

1. ✅ `render.yaml` - Render configuration file
2. ✅ `package.json` - Updated with correct start script
3. ✅ `server.js` - Fixed MongoDB connection handling

## 🚀 Deployment Steps

### Option 1: Using render.yaml (Automatic Configuration)

1. Go to: https://dashboard.render.com/web/srv-d43ns2adbo4c73arbl5g
2. If service is new, connect GitHub repo:
   - Repository: `jpreddy4305/Eduverse-wpm-project`
   - Branch: `main`
3. Render will auto-detect `render.yaml` and configure settings
4. **IMPORTANT**: Set Root Directory to: `eduverse-student-faculty-portal-main`
5. Add environment variable: `MONGODB_URI` with your MongoDB connection string
6. Click "Save Changes" or "Deploy"

### Option 2: Manual Configuration

If render.yaml isn't detected, manually set:

**Settings Tab:**
- **Root Directory**: `eduverse-student-faculty-portal-main`
- **Node Version**: `18` or `20`

**Build & Deploy Tab:**
- **Build Command**: `npm install --legacy-peer-deps && npm run build`
- **Start Command**: `npm start`

**Environment Tab:**
- Add: `MONGODB_URI` = `your-mongodb-connection-string`
- Optional: `NODE_ENV` = `production`

## 📝 Required Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | ✅ Yes | MongoDB Atlas connection string |
| `NODE_ENV` | ❌ No | Auto-set by Render |
| `PORT` | ❌ No | Auto-set by Render |

## 🔍 Verify Deployment

1. Check build logs for successful build
2. Check runtime logs for "✅ MongoDB Connected Successfully"
3. Visit your Render URL (e.g., https://eduverse-wpm-project.onrender.com)

## 🐛 Common Issues

**Issue**: "Cannot find package.json"
- **Fix**: Set Root Directory to `eduverse-student-faculty-portal-main`

**Issue**: "MongoDB Connection Error"
- **Fix**: Verify `MONGODB_URI` is set correctly
- **Fix**: Check MongoDB Atlas Network Access allows all IPs (0.0.0.0/0)

**Issue**: Build fails
- **Fix**: Ensure using `--legacy-peer-deps` flag in build command

## 📞 Support

- Render Dashboard: https://dashboard.render.com/web/srv-d43ns2adbo4c73arbl5g
- Email: jpreddy4305@gmail.com

