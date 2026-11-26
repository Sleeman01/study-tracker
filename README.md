# Study Tracker

A phone app for timing study sessions. Choose a subject, start the timer, and see your weekly progress, goals and study streak. It's a **PWA** (Progressive Web App): it runs in the browser and can be installed on your home screen. You log in with an email and password, and your subjects and sessions are saved to your account in **Supabase** (an online database with logins), so they're safe on any device.

## Features

- Add subjects, each with a color and an optional weekly goal
- A study timer that keeps running even if you close the app
- Today's total, a history of past sessions, a weekly bar chart, goal progress and a study streak
- Accounts: sign up, log in, log out and reset your password. Your data follows you to any device
- Data saved on the phone before accounts can be uploaded into your account on first login

## Tech used

| Part | What it does here |
|---|---|
| **React** | Builds the screens out of reusable components |
| **Vite** | Runs the app while developing and builds the finished files |
| **Supabase** | Email + password logins and a Postgres database. **Row Level Security** makes sure each user can only read and change their own rows |
| **PWA** (Progressive Web App) | A web app manifest and a service worker, so it installs on a phone's home screen and opens offline |
| Plain CSS | Colors and fonts in CSS variables, no CSS framework |
| Node's test runner | Unit tests (`npm test`), no extra test library |

See `PLAN.md` for the user stories and design, and `CLAUDE.md` for how the project is worked on.

## Run it locally

You need **Node.js** (version 22 or newer) and a free **Supabase** account.

1. Get the code and install the libraries:
   ```bash
   git clone https://github.com/Sleeman01/study-tracker.git
   cd study-tracker
   npm install
   ```
2. Create a project at supabase.com. Then go to **SQL Editor** → New query, paste all of `supabase/schema.sql`, and press **Run**. This creates the tables and the security rules (Row Level Security).
3. In Supabase, go to **Authentication → URL Configuration** and add `http://localhost:5173` (and later your `https://` address) to **Redirect URLs**, so "Forgot password" links open the app.
4. Copy `.env.example` to a new file called `.env.local` in the project folder, and fill in your own values from Supabase → **Project Settings → API**:
   ```bash
   # .env.local  (never commit this file; git already ignores it)
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-or-publishable-key
   ```
   | Name | What goes in it |
   |---|---|
   | `VITE_SUPABASE_URL` | Your project's URL |
   | `VITE_SUPABASE_ANON_KEY` | The **anon / publishable** key. It's safe in the browser because Row Level Security protects the data. **Never** use the service_role / secret key here |
5. Start the app with `npm run dev`, and open http://localhost:5173. If you change `.env.local` later, restart `npm run dev`.

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

1. Sign in at vercel.com with GitHub and import the `study-tracker` repository. It detects Vite automatically.
2. Open the `https://...vercel.app` address on your phone, then:
   - **Android (Chrome):** menu ⋮ → **Install app**
   - **iPhone (Safari):** Share → **Add to Home Screen**

Add the `https://...vercel.app` address to Supabase's **Redirect URLs** too, and add the two `VITE_SUPABASE_...` values in Vercel → Project → Settings → **Environment Variables** (Vercel can't see your `.env.local`).

After it opens once, it opens without internet.

## How offline works

`public/sw.js` is a **service worker**, a small script the browser runs in the background. When the app is first opened, it saves the app's files on the device. Later, when there's no internet, it serves those saved files. The app then shows the copy of your data saved on the device. Changes made while offline are **not** saved to your account yet: the app tells you when that happens. When you publish a big change and want every phone to drop its old copy, change `CACHE_NAME` in that file.
