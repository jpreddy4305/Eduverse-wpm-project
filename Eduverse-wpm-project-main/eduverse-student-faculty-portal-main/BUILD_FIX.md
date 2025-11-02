# Build Fix: MongoDB URI Check at Build Time

## Problem
Build was failing with:
```
Error: Please define the MONGODB_URI or MONGODB_CONNECTION_STRING environment variable inside .env
```

This happened because Next.js was trying to analyze API routes during build time, and the MongoDB connection check was happening at module load (build time) instead of runtime.

## Solution
Moved the MongoDB URI validation check from module load time to runtime inside the `connectDB()` function.

**File Changed**: `src/db/index.ts`

**Before**: Check happened immediately when module was imported
**After**: Check only happens when `connectDB()` is actually called (at runtime)

## Next Steps

1. **Commit and push** the changes to GitHub
2. **Set Environment Variable** in Render Dashboard:
   - Go to: https://dashboard.render.com/web/srv-d43ns2adbo4c73arbl5g
   - Navigate to **Environment** tab
   - Add: `MONGODB_URI` = `your-mongodb-connection-string`
3. **Redeploy** - The build should now succeed, and the app will connect to MongoDB at runtime

## Important Note

The build will now succeed without the MongoDB URI, but the application **will need** `MONGODB_URI` set in environment variables when it runs. Make sure to add it in the Render dashboard before deploying.

