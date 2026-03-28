# Flourish & Faith — Build Instructions

## What's in this folder

```
flourish-and-faith/
├── src/
│   ├── App.jsx           ← REPLACE with your FlourishAndFaith.jsx content
│   ├── main.jsx          ← Entry point (leave as-is)
│   └── lib/
│       └── supabase.js   ← REPLACE with your supabase.ts content
├── public/
│   └── icons/
│       └── icon.svg      ← Replace with your real app icon later
├── index.html            ← Already configured with fonts + meta tags
├── vite.config.js        ← Already configured with PWA
├── package.json          ← All dependencies listed
├── vercel.json           ← Vercel routing configuration
├── .env.example          ← Copy to .env and fill in your keys
└── .gitignore            ← Keeps .env out of GitHub
```

---

## Step-by-Step Build

### 1. Install Node.js (if you haven't)
Download from **nodejs.org** — install the LTS version.
Verify: open Terminal and type `node --version` — should show v18 or higher.

---

### 2. Open Terminal in this folder

**Mac:** Right-click the folder → "New Terminal at Folder"
**Windows:** Open the folder, click the address bar, type `cmd`, press Enter
**VS Code:** Open the folder in VS Code → Terminal → New Terminal

---

### 3. Install dependencies

```bash
npm install
```

This downloads React, Vite, Supabase, Lucide, and all other packages.
Takes about 1–2 minutes. You'll see a `node_modules` folder appear.

---

### 4. Drop in your app file

Open `src/App.jsx` in any text editor.
Replace **all** of its contents with the contents of your `FlourishAndFaith.jsx` file.

The last line of App.jsx must be the export:
```jsx
export default function FlourishAndFaith() { ... }
```
Change it to:
```jsx
export default function App() { ... }
```
Or just add this line at the very bottom:
```jsx
export default FlourishAndFaith
```

---

### 5. Add your Supabase keys

Copy `.env.example` → rename to `.env`

Open `.env` and fill in your values:
```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...your long key here
```

Get these from: **Supabase Dashboard → Settings → API**

---

### 6. Test locally

```bash
npm run dev
```

Opens at **http://localhost:5173**

The app should load. Sign up, go through onboarding, try Sage — everything should work.

---

### 7. Build for production

```bash
npm run build
```

Creates a `dist/` folder with the final app.
No errors = ready to deploy.

---

### 8. Deploy to Vercel

**Option A — Drag and Drop (easiest)**
1. Go to vercel.com → Log in
2. Click **Add New → Project**
3. Click **"Deploy from local"** or drag your `dist/` folder
4. Add your environment variables when prompted
5. Click Deploy

**Option B — Connect GitHub (recommended for ongoing updates)**
1. `git init && git add . && git commit -m "Initial commit"`
2. Push to a new GitHub repo
3. Go to vercel.com → **Add New → Project → Import from GitHub**
4. Select your repo
5. Framework: **Vite** | Build: `npm run build` | Output: `dist`
6. Add environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY)
7. Deploy

With Option B, every time you push to GitHub, Vercel automatically redeploys.

---

## Common Issues

**`npm install` fails**
→ Make sure you're in the right folder (the one with `package.json`).
→ Try `npm install --legacy-peer-deps`

**App shows blank screen**
→ Open browser DevTools (F12) → Console tab → read the error
→ Usually a missing import or a typo in the component name

**"Cannot find module '@supabase/supabase-js'"**
→ Run `npm install` again

**Build error: "export default" not found**
→ Make sure `src/App.jsx` ends with `export default FlourishAndFaith` or rename the function to `App`

**Environment variables not working**
→ All Vite env vars must start with `VITE_`
→ Restart `npm run dev` after changing `.env`
