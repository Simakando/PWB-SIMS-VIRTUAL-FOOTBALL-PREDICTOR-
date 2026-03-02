# ⚡ VF Signal Predictor v7.1
### BetPawa Zambia · Kiron VFL API · Signal-Driven Over 3.5 Detector

A fully client-side, mobile-first prediction tool for BetPawa Zambia's Virtual Football League (VFL). Runs entirely in the browser — no server, no backend, no login required.

---

## 🚀 Live Demo (GitHub Pages)

Once deployed, your app will be available at:
```
https://<your-username>.github.io/<your-repo-name>/
```

---

## 📦 Files

| File | Purpose |
|------|---------|
| `index.html` | Main app — open this in any browser |
| `README.md` | This file |
| `.gitignore` | Keeps repo clean |
| `_config.yml` | GitHub Pages configuration |
| `LICENSE` | MIT License |

---

## ⚙️ Features (v7.1)

### 1. 💾 Persistent Signal Database
- All signals, match history, and patterns stored in **IndexedDB** — survives phone restarts, app closes, and cache clearing
- On next load, signals are restored instantly before a new scan begins
- Signals grow smarter over time as more match data is collected

### 2. 🗑️ Auto-Pruning
- Signals tracked against real outcomes via the ML system
- Any signal with 50+ match history that drops below 40% accuracy is automatically removed from the database
- Pruning events logged in the ML tab

### 3. 🏆 Top Performer Highlighting
- Signals with **≥70% hit rate** AND **≥50 match occurrences** are highlighted in gold throughout the app
- Top performers get bonus weighting in confidence calculations
- Filterable in the Signals tab

### 4. 📅 MD+2 Matchday Mode
- Predictions shown for 2 matchdays ahead
- Example: if current play is MD 5, predictions display for MD 7

### 5. 🛡️ Under-Filter System (12 Checks)
Applied after the signal gate passes — removes matches that are likely to go **under** despite qualifying:

| Filter | What it checks |
|--------|---------------|
| F1 | Market odds — Under 3.5 heavily favoured by bookmakers |
| F2 | Dominant home favourite (odds < 1.25) |
| F3 | Marginal signal rate (avg below 58%) |
| F4 | Support-only signals — no primary Team/H2H/League signal |
| F5 | Head-to-Head avg goals below 2.8 |
| F6 | League avg goals below 2.5 |
| F7 | Close draw odds (below 2.8) — tight match expected |
| F8 | Even money trap — both teams priced 1.7–2.4 |
| F9 | Scoreline conflict — common scoreline is an under-3.5 result |
| F10 | Low signal cohesion — majority of signals below 60% |
| F11 | Confidence/rate mismatch — high confidence, weak signal rates |
| F12 | Both teams defensive — both team signals below 55% |

- **3+ filters triggered → BLOCKED** (removed from recommendations)
- **2 filters triggered → CAUTION** (shown with warning, reduced acca eligibility)
- **0–1 filters triggered → APPROVED** ✅

### 6. 🤖 Self-Learning ML Engine
- Tracks every prediction outcome
- Auto-adjusts signal thresholds and under-filter sensitivity based on accuracy
- Download full ML dataset as JSON from the ML tab

---

## 📲 How to Use on Mobile

1. Open the GitHub Pages URL in Chrome or Firefox on your phone
2. Tap the browser menu → **"Add to Home Screen"**
3. The app installs like a native app with its own icon
4. Signal data and ML history persist between sessions via IndexedDB

---

## 🛠️ How to Deploy to GitHub Pages

### Option A — GitHub Web Interface (easiest)
1. Go to [github.com](https://github.com) and create a new repository (e.g. `vf-predictor`)
2. Click **"uploading an existing file"**
3. Drag and drop all files from this folder
4. Click **Commit changes**
5. Go to **Settings → Pages → Source → Deploy from branch → main → / (root)**
6. Wait ~60 seconds → your site is live

### Option B — Git Command Line
```bash
git init
git add .
git commit -m "VF Signal Predictor v7.1"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```
Then enable GitHub Pages in repository Settings.

---

## 🔄 Updating the App

When a new version is ready:
1. Replace `index.html` with the new file
2. Commit and push — GitHub Pages auto-deploys within ~60 seconds
3. On your phone, close and reopen the app — it will reload the new version

---

## 📊 Signal Qualification Rules

For a pattern to become an active prediction signal it must pass ALL of these:
- ✅ Minimum **30 match occurrences** across all VFL leagues
- ✅ Over 3.5 hit rate **≥ 50%** (auto-adjusted by ML)
- ✅ Signal strength score **≥ 40** (composite of rate + sample size)
- 🏆 **Top Performer**: rate ≥ 70%, occurrences ≥ 50
- 🔥 Strong signal: rate ≥ 65% → triggers **OVER 3.5** bet
- 📊 Moderate signal: rate 55–65% → triggers **OVER 2.5** bet
- ❌ Weak signal: rate < 50% → flagged for auto-pruning

---

## ⚠️ Responsible Use

This tool is for **entertainment and analysis purposes only**.

Virtual football outcomes are determined by RNG (random number generators). No prediction system can guarantee consistent profits. Always gamble responsibly:
- Only use money you can afford to lose
- Never chase losses
- Set a strict entertainment budget before each session
- If gambling stops being fun, stop

**Gambling Support (Zambia):** Contact your mobile operator or visit a local financial counsellor.

---

## 📄 License

MIT License — free to use, modify, and share.

---

*Built with ❤️ · Powered by Kiron Interactive VFL API · No server required*
