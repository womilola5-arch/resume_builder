# 🔧 Deployment Troubleshooting Guide

## Getting 404 Error? Here's How to Fix It

### Step 1: Verify File Structure

After extracting the ZIP, your folder should look **exactly** like this:

```
resume-builder/
├── index.html          ← MUST be here (in root)
├── test.html           ← Test file
├── vercel.json         ← Vercel config
├── netlify.toml        ← Netlify config
├── README.md
├── FEATURES.md
├── DEPLOYMENT.md
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── templates.js
│   ├── export.js
│   ├── ai/
│   │   ├── optimizer.js
│   │   └── ui.js
│   └── features/
│       ├── coverLetter.js
│       ├── applicationTracker.js
│       ├── versionManager.js
│       └── quickMenu.js
├── assets/             ← Empty for now
└── templates/          ← Empty for now
```

### Step 2: Platform-Specific Fixes

## 🟢 GitHub Pages

**Problem: 404 on GitHub Pages**

✅ **Solution:**

1. Make sure you pushed to the **correct branch** (main or master)
2. Go to repository Settings → Pages
3. Check Source is set to "Deploy from branch"
4. Branch should be `main` (or `master`)
5. Folder should be `/ (root)`
6. Wait 2-3 minutes after pushing
7. Access at: `https://yourusername.github.io/repository-name/`

**Command to deploy:**
```bash
cd resume-builder
git init
git add .
git commit -m "Deploy resume builder"
git branch -M main
git remote add origin https://github.com/yourusername/resume-builder.git
git push -u origin main
```

Then in GitHub:
- Go to Settings → Pages
- Source: Deploy from branch
- Branch: main → / (root) → Save

---

## 🔵 Vercel

**Problem: 404 on Vercel**

✅ **Solution:**

**Method 1: CLI (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to folder
cd resume-builder

# Deploy
vercel

# When prompted:
# - Set up and deploy? Y
# - Which scope? [Your account]
# - Link to existing project? N
# - Project name? resume-builder
# - Directory? ./ (just press enter)
# - Override settings? N

# For production deployment
vercel --prod
```

**Method 2: Import from GitHub**
1. Push code to GitHub first
2. Go to vercel.com
3. Click "Add New" → "Project"
4. Import from GitHub
5. Select repository
6. Leave all settings as default
7. Click "Deploy"

**Method 3: Drag & Drop**
1. Go to vercel.com dashboard
2. Drag the `resume-builder` folder
3. Wait for deployment

---

## 🟣 Netlify

**Problem: 404 on Netlify**

✅ **Solution:**

**Method 1: Drag & Drop (Easiest)**
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the entire `resume-builder` folder
3. Wait for deployment
4. Done!

**Method 2: CLI**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to folder
cd resume-builder

# Login
netlify login

# Deploy
netlify deploy

# When prompted for publish directory, enter: .

# For production
netlify deploy --prod
```

**Method 3: From GitHub**
1. Push to GitHub
2. Go to netlify.com
3. "Add new site" → "Import from Git"
4. Select repository
5. Build command: (leave empty)
6. Publish directory: .
7. Click "Deploy"

---

## 🟠 Cloudflare Pages

**Problem: 404 on Cloudflare**

✅ **Solution:**

1. Go to Cloudflare Pages dashboard
2. "Create a project"
3. Connect to GitHub
4. Select repository
5. Build settings:
   - Framework preset: None
   - Build command: (leave empty)
   - Build output directory: /
6. Click "Save and Deploy"

---

## Common Issues & Fixes

### Issue 1: "index.html not found"

**Cause:** index.html is inside a subfolder

**Fix:**
```bash
# Check your structure
ls -la

# You should see index.html directly
# If you see another folder, you need to go into it
cd resume-builder  # if needed
ls -la             # now you should see index.html
```

**For deployment:** Make sure you're deploying from the folder that CONTAINS index.html, not its parent.

---

### Issue 2: Blank page after deployment

**Cause:** JavaScript files not loading

**Fix:**

1. Open browser console (F12)
2. Look for errors
3. Common fixes:
   - Clear browser cache (Ctrl+Shift+R)
   - Check that js/ folder uploaded
   - Check that all subfolders (js/ai/, js/features/) uploaded
   - Verify file paths are relative (no leading /)

---

### Issue 3: Styles not loading

**Cause:** CSS file path incorrect

**Fix:**

1. Check that css/style.css exists
2. In index.html, verify path is:
   ```html
   <link rel="stylesheet" href="css/style.css">
   ```
   NOT:
   ```html
   <link rel="stylesheet" href="/css/style.css">  ❌
   ```

---

### Issue 4: "Failed to load resources"

**Cause:** CDN links blocked or wrong paths

**Fix:**

1. Check internet connection
2. Verify CDN links in index.html:
   - Font Awesome
   - jsPDF
   - html2canvas
3. If CDN is blocked, you'll need to download libraries locally

---

### Issue 5: Works locally but not on hosting

**Cause:** Case-sensitive file paths

**Fix:**

- Hosting platforms are case-sensitive!
- Make sure:
  - `style.css` not `Style.css`
  - `app.js` not `App.js`
  - Folder names match exactly

---

## Testing Your Deployment

### Test 1: Basic Access
```
https://yoursite.com/test.html
```
Can you see the test page? If YES → deployment works!
If NO → check file upload

### Test 2: Main App
```
https://yoursite.com/
or
https://yoursite.com/index.html
```
Can you see the resume builder? If YES → you're good!
If NO → check console for errors

### Test 3: Check Console
1. Press F12 (or right-click → Inspect)
2. Go to Console tab
3. Look for red errors
4. Common errors:
   - "404" = file not found
   - "CORS" = blocked resource
   - "Uncaught" = JavaScript error

---

## Quick Deploy: Copy-Paste Commands

### For GitHub Pages:
```bash
cd path/to/resume-builder
git init
git add .
git commit -m "Initial deployment"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### For Vercel:
```bash
cd path/to/resume-builder
npx vercel
# Answer prompts, then:
npx vercel --prod
```

### For Netlify:
```bash
cd path/to/resume-builder
npx netlify-cli deploy --prod --dir .
```

---

## Still Not Working?

### Last Resort Checklist:

1. ✅ Extract ZIP completely
2. ✅ See `index.html` in root folder
3. ✅ See `css/`, `js/` folders
4. ✅ Upload entire folder, not individual files
5. ✅ Wait 2-3 minutes after deployment
6. ✅ Clear browser cache
7. ✅ Try different browser
8. ✅ Check browser console (F12) for errors
9. ✅ Try test.html first
10. ✅ Verify internet connection

### Get Help:

1. Open browser console (F12)
2. Screenshot any red errors
3. Note which platform you're using
4. Share the error message

---

## Alternative: Test Locally First

Before deploying, test locally:

```bash
# Using Python
cd resume-builder
python -m http.server 8000
# Open: http://localhost:8000

# Using Node.js
npx serve
# Open: http://localhost:3000

# Or just open index.html in browser
# (Some features may not work without a server)
```

If it works locally but not deployed, the issue is with deployment setup, not the code.

---

## Pro Tips

1. **Always test test.html first** - If test.html works, deployment is fine
2. **Use relative paths** - Never use `/css/style.css`, use `css/style.css`
3. **Check file names** - Case matters on hosting platforms
4. **Clear cache often** - Old files can cause confusion
5. **One platform at a time** - Don't try multiple platforms simultaneously

---

## Success Indicators

You'll know it's working when:
- ✅ You can access the site
- ✅ You see the blue gradient header
- ✅ "Start Building" button is visible
- ✅ No errors in browser console
- ✅ You can fill out forms
- ✅ Preview updates as you type

---

**Still stuck?** The most common issue is deploying the wrong folder. Make sure you're deploying the folder that CONTAINS index.html directly!
