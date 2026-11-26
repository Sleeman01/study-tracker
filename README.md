# Study Tracker

A phone app for timing study sessions. Choose a subject, start the timer, and see your weekly progress, goals and study streak. It's a **PWA** (Progressive Web App): it runs in the browser and can be installed on your home screen. You log in with an email and password, and your subjects and sessions are saved to your account in **Supabase** (an online database with logins), so they're safe on any device.

Built with React + Vite. See `PLAN.md` for the user stories and design, and `CLAUDE.md` for how we work.

## First-time setup (Supabase)

1. Create a project at supabase.com.
2. **SQL Editor** → New query → paste all of `supabase/schema.sql` → **Run**. This creates the tables and the security rules (Row Level Security).
3. **Authentication → URL Configuration** → add `http://localhost:5173` (and later your `https://` address) to **Redirect URLs**, so "Forgot password" links open the app.
4. Copy `.env.example` to `.env.local` and fill in the two values from **Project Settings → API**. Use the **anon / publishable** key only, never the service_role / secret key. `.env.local` is ignored by git, so your keys are never committed.
5. Restart `npm run dev` after changing `.env.local`.

Supabase's free built-in email only sends to the addresses of your Supabase team members, and only a few emails per hour. To send "Forgot password" emails to anyone, set up your own email (SMTP) under **Authentication → Emails**.

## Commands

| Command | What it does |
|---|---|
| `npm install` | Download the libraries the project needs (first time only) |
| `npm run dev` | Start the app for development at http://localhost:5173 (updates as you edit) |
| `npm test` | Run the automatic tests (Node's built-in test runner) |
| `npm run lint` | Check the code for mistakes |
| `npm run build` | Build the finished app into the `dist/` folder |
| `npm run check:rls` | Security check: signs up two test users and proves neither can see or change the other's data |
| `npm run preview` | Run the finished app from `dist/` (offline support only works here, not in `dev`) |

## Testing in the browser

1. Run `npm run dev` and open the address it prints in Chrome or Edge.
2. Press **F12** and click the phone/tablet icon to see the phone layout.
3. To look at saved data: open your Supabase project → **Table Editor** → `subjects` / `sessions`. The device's own copy (used offline, plus the running timer) is in F12 → **Application** → **Local Storage** → `study-tracker-user-...`.

## Testing on your phone (same Wi-Fi)

1. Run `npm run dev -- --host`. It prints a "Network" address such as `http://192.168.1.20:5173`.
2. Open that address in your phone's browser.

On Windows with WSL, the phone may not reach it, because WSL has its own network. If so, use the deploy option below instead.

This lets you use the app on your phone, but **not install it**. Phones only install apps from `https://` addresses.

## Installing it on your phone

The app needs to be online at an `https://` address first. One free option is **Vercel**:

1. Push this project to GitHub.
2. Sign in at vercel.com with GitHub and import the repository. It detects Vite automatically.
3. Open the `https://...vercel.app` address on your phone, then:
   - **Android (Chrome):** menu ⋮ → **Install app**
   - **iPhone (Safari):** Share → **Add to Home Screen**

Add the `https://...vercel.app` address to Supabase's **Redirect URLs** too, and add the two `VITE_SUPABASE_...` values in Vercel → Project → Settings → **Environment Variables** (Vercel can't see your `.env.local`).

After it opens once, it opens without internet.

## How offline works

`public/sw.js` is a **service worker**, a small script the browser runs in the background. When the app is first opened, it saves the app's files on the device. Later, when there's no internet, it serves those saved files. The app then shows the copy of your data saved on the device. Changes made while offline are **not** saved to your account yet: the app tells you when that happens. When you publish a big change and want every phone to drop its old copy, change `CACHE_NAME` in that file.
