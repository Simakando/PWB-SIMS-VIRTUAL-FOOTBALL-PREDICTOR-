# 🚀 Deployment Guide — VF Signal Predictor v7.1

## Files to Upload to GitHub

Upload ALL of these files. Nothing else is needed.

```
index.html        ← Main app (the predictor)
README.md         ← Project documentation
_config.yml       ← GitHub Pages settings
.gitignore        ← Keeps repo tidy
LICENSE           ← MIT License
DEPLOY.md         ← This file (optional, you can skip it)
```

---

## Step-by-Step: Deploy via GitHub Website (No coding needed)

### Step 1 — Create a GitHub account
If you don't have one: https://github.com/signup (free)

### Step 2 — Create a new repository
1. Go to https://github.com/new
2. Repository name: `vf-predictor` (or any name you like)
3. Set it to **Public** (required for free GitHub Pages)
4. Do NOT tick "Add a README" — you already have one
5. Click **Create repository**

### Step 3 — Upload your files
1. On the empty repo page, click **"uploading an existing file"**
2. Drag and drop ALL the files listed above into the upload area
3. Scroll down, type a commit message like: `Add VF Signal Predictor v7.1`
4. Click **Commit changes**

### Step 4 — Enable GitHub Pages
1. Click **Settings** (top menu of your repo)
2. Scroll down the left sidebar to **Pages**
3. Under **Source**, select: `Deploy from a branch`
4. Branch: `main` | Folder: `/ (root)`
5. Click **Save**

### Step 5 — Get your URL
- Wait about 60 seconds
- Refresh the Pages settings page
- You'll see: **"Your site is live at https://YOUR-USERNAME.github.io/vf-predictor/"**
- Open that URL on your phone — it's your app!

---

## 📱 Install on Phone (Android)

1. Open the URL in **Chrome**
2. Tap the 3-dot menu (top right)
3. Tap **"Add to Home Screen"**
4. Name it "VF Predictor" → tap **Add**
5. It now appears on your home screen like a real app

---

## 📱 Install on Phone (iPhone)

1. Open the URL in **Safari** (must be Safari, not Chrome)
2. Tap the **Share button** (square with arrow)
3. Scroll down → tap **"Add to Home Screen"**
4. Name it → tap **Add**

---

## 🔄 How to Update the App Later

When you have a new version of `index.html`:

1. Go to your GitHub repository
2. Click on `index.html` in the file list
3. Click the **pencil icon** (Edit)
4. Select all the text → delete it
5. Paste the new HTML code
6. Click **Commit changes**
7. Wait ~60 seconds → the live site updates automatically

---

## 🔒 Keep Your App Private (Optional)

If you don't want others to find your predictor:

1. After creating the repo, go to **Settings → General**
2. Scroll down to **Danger Zone**
3. Click **Change repository visibility → Make private**

> ⚠️ Note: Private repos require a **GitHub Pro** account ($4/month) for GitHub Pages. Alternatively, keep it public — the app has no personal data and works fine publicly.

---

## 🛠️ Troubleshooting

**Site shows a 404 error:**
- Make sure your file is named exactly `index.html` (lowercase)
- Check that GitHub Pages is enabled in Settings → Pages
- Wait 2–3 minutes and try again

**App loads but shows "Offline - Signal mode":**
- This is normal if the BetPawa proxy API is temporarily down
- The signal engine still collects data and predictions will appear
- Tap 🔄 Refresh to retry

**Signals not saving between visits:**
- Make sure you're using the same browser (IndexedDB is per-browser)
- Don't use Incognito/Private mode — IndexedDB doesn't persist there
- On iPhone, use Safari (not Chrome) for best storage support

---

*That's it! Your predictor is now live on the internet, accessible from any device.*
