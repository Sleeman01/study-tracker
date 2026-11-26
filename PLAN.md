# Study Tracker: Version 1 plan

An installable phone app (PWA) for timing study sessions. It has 4 screens and a bottom tab bar, and saves all data on the device.

---

## How we work

Each step below is a **user story**: who wants something, what they want, and why. The **acceptance criteria** are simple checks that prove the story works. Stories are grouped into small **sprints** (1-2 stories each). Each story gets its own `feature/...` branch, and it's merged into `main` only after you approve it. The full rules are in `CLAUDE.md` → Workflow.

**Status key:** To do · In progress · Waiting for approval · Done

| Sprint | Stories | Goal |
|---|---|---|
| Sprint 1 | 1, 2 | The app opens, has tabs, and can save data |
| Sprint 2 | 3, 4 | Add subjects and time a study session |
| Sprint 3 | 5, 6 | See today's total and past sessions |
| Sprint 4 | 7, 8 | See weekly progress, goals, and streak |
| Sprint 5 | 9, 10 | Install it on your phone and polish it |

---

## User stories

### Story 1: App shell with tab bar
**Sprint 1** · Branch: `feature/app-shell` · Status: **Done**

> As a student, I want a bottom tab bar with Today, Subjects, Stats and History, so that I can reach every part of the app with my thumb.

Acceptance criteria:
- [x] The Vite demo page is gone. The app shows the "Today" screen when it opens.
- [x] Tapping each of the 4 tabs shows that screen, and the selected tab is visibly highlighted.
- [x] On a phone-sized screen, the tab bar stays at the bottom and doesn't cover any content.
- [x] Titles use the Recursive font, and the colors match the design direction below.

Skills: `frontend-design`, `react-best-practices`, `web-design-guidelines`

### Story 2: Save data on the device
**Sprint 1** · Branch: `feature/data-storage` · Status: **Done**

> As a student, I want my subjects and sessions saved on my phone, so that nothing is lost when I close the app.

Acceptance criteria:
- [x] Data saved by the app is still there after reloading the page. You can see it in browser DevTools → Application → Local Storage → `study-tracker-v1`.
- [x] If there's no saved data yet, the app starts with empty lists instead of crashing.
- [x] If the saved data is broken (not valid JSON), the app still opens with empty lists.

Skills: `react-best-practices`, `superpowers:test-driven-development` (only if you approve Vitest)

### Story 3: Manage subjects
**Sprint 2** · Branch: `feature/subjects` · Status: **Done**

> As a student, I want to add, edit and delete my subjects, each with a color and a weekly goal, so that I can organise my studying the way my classes are set up.

Acceptance criteria:
- [x] I can add a subject with a name, one of the 8 colors, and a weekly goal in hours. It appears in the list.
- [x] I can edit a subject, and the change shows right away and is still there after a reload.
- [x] Deleting asks "Are you sure?" first, and says how many sessions will also be removed.
- [x] With no subjects, the screen explains what to do and shows an "Add subject" button.

Skills: `frontend-design`, `web-design-guidelines`

### Story 4: Study timer
**Sprint 2** · Branch: `feature/today-timer` · Status: **Done**

> As a student, I want to choose a subject and start and stop a timer, so that I know exactly how long I studied.

Acceptance criteria:
- [x] I can't start the timer until a subject is chosen.
- [x] After pressing Start, the timer counts up every second, and the subject's color highlights the digits.
- [x] If I close and reopen the app while the timer is running, it still shows the correct time.
- [x] Pressing Stop saves a session (subject, start time, end time) and resets the timer.

Skills: `frontend-design`, `react-best-practices`

### Story 5: Today's total
**Sprint 3** · Branch: `feature/today-total` · Status: **Done**

> As a student, I want to see how long I've studied today, so that I can tell whether I've done enough.

Acceptance criteria:
- [x] The Today screen shows the total time studied today (for example "1 h 25 min").
- [x] A list under the timer shows today's sessions: subject, start time, and duration.
- [x] The total updates right after a session is stopped.

Skills: `frontend-design`

### Story 6: Session history
**Sprint 3** · Branch: `feature/history` · Status: **Done**

> As a student, I want a list of my past sessions that I can delete from, so that I can review my studying and remove mistakes.

Acceptance criteria:
- [x] Sessions are grouped by date, newest first, and each shows its subject, start time and duration.
- [x] Deleting a session asks for confirmation, then removes it from History, Today and Stats.
- [x] With no sessions yet, the screen says how to record one.

Skills: `frontend-design`, `web-design-guidelines`

### Story 7: Weekly bar chart
**Sprint 4** · Branch: `feature/week-chart` · Status: **Done**

> As a student, I want a bar chart of hours studied each day this week, so that I can spot which days I'm skipping.

Acceptance criteria:
- [x] The chart shows 7 bars, Monday to Sunday, for the current week, and today's bar stands out.
- [x] Tapping a bar shows the exact time for that day.
- [x] Days with no studying show an empty bar (zero), not a gap or an error.
- [x] The same numbers are also available as text, for screen readers.

Skills: `dataviz`, `frontend-design`

### Story 8: Weekly goals and streak
**Sprint 4** · Branch: `feature/goals-streak` · Status: **Done**

> As a student, I want to see my progress toward each subject's weekly goal and my study streak, so that I stay motivated to keep going.

Acceptance criteria:
- [x] Each subject shows a progress bar in its color with text like "3 h 20 min of 5 h".
- [x] A goal that's reached shows as complete, and the bar doesn't overflow past 100%.
- [x] The streak counts days in a row with at least one session. It doesn't reset if I haven't studied yet *today*.

Skills: `dataviz`, `frontend-design`

### Story 9: Install on my phone
**Sprint 5** · Branch: `feature/pwa-install` · Status: **Done** (phone install still to try after deploying)

> As a student, I want to install the app on my phone's home screen and use it offline, so that it feels like a real app and works without internet.

Acceptance criteria:
- [x] The app has its own name and icon (no more Vite logo).
- [ ] On the phone, "Add to Home Screen" / "Install app" works, and the app opens full-screen. *(Chrome reports it installable with no errors; trying it on a real phone needs an https:// deploy, see README.)*
- [x] With internet turned off, the installed app still opens and the timer works.

Skills: `react-best-practices`, `deploy-to-vercel` (phones need HTTPS before they will install a PWA)

### Story 10: Final phone check
**Sprint 5** · Branch: `feature/phone-check` · Status: **Done**

> As a student, I want the app to be easy and comfortable to use on my phone, so that tracking my study never feels like a chore.

Acceptance criteria:
- [x] Every screen looks right on a small phone (360px wide) and a large one (430px wide).
- [x] Every button is easy to tap (at least 44px) and every one has a label screen readers can read.
- [x] The accessibility review finds no serious problems.

Skills: `web-design-guidelines`, `playwright-cli`, `superpowers:verification-before-completion`

**In every story:**
- `audit-verify-explain-grade-5` explains changes simply.
- `superpowers:verification-before-completion` checks the acceptance criteria.
- `superpowers:systematic-debugging` is used when something breaks.

---

## Version 2: user accounts (Supabase)

Your data moves from "only on this phone" to "in your own account", so it's safe if you lose your phone and you can use it on more than one device. Supabase gives us a database and logins, so we don't have to write our own server.

| Sprint | Stories | Goal |
|---|---|---|
| Sprint 6 | 11, 12 | Connect to Supabase and create safe tables |
| Sprint 7 | 13 | Sign up, log in, log out, reset password |
| Sprint 8 | 14, 15 | Save data in the cloud and bring old data along |

### Story 11: Connect to Supabase
**Sprint 6** · Branch: `feature/supabase-setup` · Status: **Done**

> As a student, I want the app connected to an online database, so that my data can be saved in my account instead of only on one phone.

Acceptance criteria:
- [x] `@supabase/supabase-js` is installed, and there is one client file (`src/data/supabase.js`) that reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from `.env.local`.
- [x] `.env.local` is listed in `.gitignore` and is never committed. `.env.example` shows which values are needed, with no real keys.
- [x] Only the public anon key is used. The service_role / secret key is never used or asked for.

Skills: `security-review`, `superpowers:verification-before-completion`

### Story 12: Database tables with Row Level Security
**Sprint 6** · Branch: `feature/database-schema` · Status: **Done**

> As a student, I want my subjects and sessions stored in tables that only I can read and change, so that nobody else can see my study data.

Acceptance criteria:
- [x] `supabase/schema.sql` creates `subjects` and `sessions`, each with a `user_id` that points to `auth.users`.
- [x] Row Level Security is on for both tables, with policies so a user can only select, insert, update and delete their own rows.
- [x] The SQL has been run in the Supabase SQL Editor (by you), and both tables show up in the Table Editor.

Skills: `security-review`

### Story 13: Sign up, log in, log out
**Sprint 7** · Branch: `feature/auth-screens` · Status: **Done** (real reset email still to try with your own address)

> As a student, I want to create an account and log in with my email and password, so that my data belongs to me.

Acceptance criteria:
- [x] When I'm not logged in, I see a login screen instead of the tabs. From there I can sign up or log in with email and password.
- [ ] "Forgot password?" sends a reset email, and the link in it lets me choose a new password. *(The email request and the "Choose a new password" screen are tested. Supabase's built-in mailer only sends to your Supabase team's addresses, so try the real email with your own address.)*
- [x] I can log out (Subjects screen → Account), and I go back to the login screen.
- [x] Mistakes show friendly messages, like "That email or password isn't right", never raw error codes.

Skills: `frontend-design`, `web-design-guidelines`, `playwright-cli`

### Story 14: Save data in my account
**Sprint 8** · Branch: `feature/cloud-data` · Status: **Done**

> As a student, I want my subjects and sessions saved to my account, so that they're still there on another device or after I log back in.

Acceptance criteria:
- [x] Adding, editing and deleting subjects and sessions saves them to Supabase for the logged-in user. The screens work exactly as before.
- [x] After logging out and back in (or on another browser), my data is still there.
- [x] One user can never see another user's data. This was tested with two test accounts.
- [x] If saving fails (for example with no internet), the app shows a friendly message instead of silently losing the change.

Skills: `react-best-practices`, `security-review`, `playwright-cli`

### Story 15: Bring my old data along
**Sprint 8** · Branch: `feature/local-migration` · Status: **Done**

> As a student who already used the app, I want to be asked whether to upload the data on my phone into my new account, so that I don't lose my study history.

Acceptance criteria:
- [x] On first login, if this device has saved subjects or sessions, the app asks whether to upload them, and says how many there are.
- [x] "Upload" copies them into my account. Afterwards they show on every screen, and I'm not asked again.
- [x] "Not now" skips the upload and leaves the data on the device. That account isn't asked again.
- [x] Uploading twice can't create duplicates.

Skills: `superpowers:verification-before-completion`, `playwright-cli`

---

## Visual design direction: "notebook and highlighter"

**Idea:** the app feels like a student's notebook. The paper is cool and blue-ruled, the text looks like navy ink, and each subject is a highlighter color. Lists look like lines on notebook paper, not stacks of identical cards.

**The one bold moment:** the **timer** on the Today screen. Its digits are big and steady. While the timer runs, a band of the subject's highlighter color sweeps in behind the digits, like highlighting a line of notes. Everything else stays calm and quiet.

### Colors

| Name | Hex | Used for |
|---|---|---|
| Paper | `#F4F7FB` | App background (cool, not cream) |
| Rule line | `#D3DEEA` | Dividers between list rows, chart grid |
| Ink | `#1A2747` | Main text, primary buttons |
| Pencil | `#5A6884` | Secondary text (dates, hints) |
| White sheet | `#FFFFFF` | Tab bar, forms, dialogs |
| Eraser red | `#C23A3A` | Delete actions only |

**Subject colors.** You pick from 8 swatches, in this fixed order. I tested them with the `dataviz` color checker, and they stay distinguishable for colorblind users:
`#2F6FDB` blue, `#E0A21B` amber, `#D9487A` pink, `#2A9BB8` teal, `#E06A2C` orange, `#7A55D6` violet, `#1F9A72` green, `#B5368F` magenta.
Each color always appears next to the subject's name, so the app never relies on color alone. That matters most for amber, which is light.

### Font

**Recursive**, one font family used in three styles:
- *Casual* style for screen titles (slightly hand-drawn, like notebook writing)
- *Linear* style for normal text
- *Mono* style for the timer and durations, so the digits don't jump around while counting

The font files are saved inside the project (`public/fonts/`), so the app works offline. No library is needed.

### Style rules

- Mobile-first, for screens about 390px wide. Content is left-aligned.
- Buttons are big enough to tap easily (at least 44px). The tab bar stays above the phone's home bar (safe area).
- Labels use normal sentence case. No ALL-CAPS labels.
- Plain wording, for example "Start studying", "Stop and save", "Add subject". Empty screens tell you what to do next.
- Motion appears only when it shows a change (the timer highlight, opening a form). Animations turn off when the phone's "reduce motion" setting is on.

---

## Folder structure

```
study-tracker/
├── public/
│   ├── fonts/            Recursive font file
│   └── icons/            App icons for the home screen
├── src/
│   ├── main.jsx          Starts React
│   ├── App.jsx           Holds the current tab and shows the right screen
│   ├── index.css         Colors, fonts, base styles (CSS variables)
│   ├── screens/
│   │   ├── TodayScreen.jsx
│   │   ├── SubjectsScreen.jsx
│   │   ├── StatsScreen.jsx
│   │   └── HistoryScreen.jsx
│   ├── components/
│   │   ├── TabBar.jsx
│   │   ├── Timer.jsx
│   │   ├── SubjectPicker.jsx
│   │   ├── SubjectForm.jsx
│   │   ├── ColorSwatches.jsx
│   │   ├── SessionRow.jsx
│   │   ├── WeekChart.jsx
│   │   ├── GoalProgress.jsx
│   │   ├── ConfirmDialog.jsx
│   │   └── EmptyState.jsx
│   ├── data/
│   │   ├── storage.js        Read/write localStorage
│   │   └── useStudyData.js   React hook + context shared by all screens
│   └── utils/
│       ├── time.js           Format durations, find start of day/week
│       └── stats.js          Weekly totals, goal progress, streak
├── CLAUDE.md
└── PLAN.md
```

## Components

| Component | What it does |
|---|---|
| `TabBar` | Bottom bar with 4 tabs: Today, Subjects, Stats, History |
| `Timer` | Big running time display + Start / Stop button |
| `SubjectPicker` | Choose which subject you're studying before starting |
| `SubjectForm` | Add or edit a subject (name, color, weekly goal) |
| `ColorSwatches` | The 8 color circles to choose from |
| `SessionRow` | One line: subject color + name, start time, duration, delete |
| `WeekChart` | SVG bar chart, hours per day this week |
| `GoalProgress` | One subject's progress bar toward its weekly goal |
| `ConfirmDialog` | "Are you sure?" before deleting anything |
| `EmptyState` | Message + button when a screen has nothing yet |

## Data model

Saved in `localStorage` as JSON (text) under one key, `study-tracker-v1`:

```js
{
  subjects: [
    { id: "a1b2", name: "Biology", color: "#2F6FDB", weeklyGoalHours: 5, createdAt: 1764150000000 }
  ],
  sessions: [
    { id: "c3d4", subjectId: "a1b2", startedAt: 1764150000000, endedAt: 1764153600000 }
  ],
  activeTimer: { subjectId: "a1b2", startedAt: 1764150000000 }  // or null when not running
}
```

- Times are stored as **timestamps** (milliseconds since 1970). Duration = `endedAt - startedAt`.
- `activeTimer` is what lets the timer survive closing the app.
- IDs come from `crypto.randomUUID()`, which is built into the browser (no library).
- **Weeks start on Monday.**
- **Streak:** the number of days in a row with at least one session, counting back from today. If you haven't studied yet today, the count starts from yesterday.
- **Deleting a subject** also deletes its sessions. The confirm dialog says how many sessions will be removed. (We can change this to keep them if you prefer.)
- A session that runs past midnight counts toward the day it started (kept simple for v1).

## Suggested libraries

React and Vite are already installed. Everything else in v1 can be built without libraries. I will **ask before installing** any of these:

| Library | Why | Needed? |
|---|---|---|
| `vite-plugin-pwa` | Creates the app manifest and the offline "service worker" for you. Writing these by hand is easy to get wrong. | Recommended for step 9 |
| `vitest` | Runs automatic tests on the math (totals, streak, week ranges), so we know they're right. It fits Vite out of the box. | Optional, step 2 |

**Not needed, and why:**
- **Chart library (e.g. Recharts):** one simple bar chart is easy to draw in SVG, and you'll learn more doing it that way.
- **Router (e.g. React Router):** 4 tabs can be one piece of state (`currentTab`).
- **Date library (e.g. date-fns):** we only need start-of-day and start-of-week, which take a few lines with the built-in `Date`.
- **State library (e.g. Redux):** one React context is enough for this app.
- **CSS framework (e.g. Tailwind):** plain CSS with variables keeps things simple to read while you're learning.
