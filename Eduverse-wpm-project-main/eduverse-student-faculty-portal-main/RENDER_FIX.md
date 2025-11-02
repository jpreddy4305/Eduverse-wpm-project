# Fix for Render Deployment Error: ENOENT package.json

## Problem
Render is looking for `package.json` in the wrong location: `/opt/render/project/src/package.json`

## Solution

You have TWO options depending on your GitHub repository structure:

### Option 1: If GitHub repo root contains `eduverse-student-faculty-portal-main/` folder

**In Render Dashboard** (https://dashboard.render.com/web/srv-d43ns2adbo4c73arbl5g):

1. Go to **Settings** tab
2. Under **Source**:
   - **Root Directory**: Set to `eduverse-student-faculty-portal-main`
3. Under **Build & Deploy**:
   - **Build Command**: `npm install --legacy-peer-deps && npm run build`
   - **Start Command**: `npm start`
4. Save and redeploy

### Option 2: If GitHub repo root IS the app folder (package.json is at root)

**In Render Dashboard**:

1. Go to **Settings** tab
2. Under **Source**:
   - **Root Directory**: Leave EMPTY or set to `.` (root)
3. Under **Build & Deploy**:
   - **Build Command**: `npm install --legacy-peer-deps && npm run build`
   - **Start Command**: `npm start`
4. Save and redeploy

## Quick Fix (Recommended)

**Go to Render Dashboard → Settings → Source**

Set **Root Directory** to match where `package.json` is located:

- If `package.json` is in: `eduverse-student-faculty-portal-main/package.json`
  → Root Directory: `eduverse-student-faculty-portal-main`
  
- If `package.json` is at repo root: `package.json`
  → Root Directory: `.` (or leave empty)

## Verify Repository Structure

Check your GitHub repo: https://github.com/jpreddy4305/Eduverse-wpm-project

Look for where `package.json` is located:
- If it's directly in root → Use Option 2
- If it's in `eduverse-student-faculty-portal-main/` folder → Use Option 1

## Alternative: Move render.yaml

If your GitHub repo structure is different, you may need to:

1. Move `render.yaml` to the actual repository root
2. Update `rootDir` in render.yaml to point to where `package.json` is

## After Fixing

1. Click **Manual Deploy** → **Deploy latest commit**
2. Watch the build logs
3. Should see: "Installing dependencies..." instead of "ENOENT" error

