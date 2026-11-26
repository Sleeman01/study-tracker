# Study Tracker: rules for Claude

Study Tracker is an installable PWA (phone app that runs in the browser), built with React + Vite.
The full build plan is in `PLAN.md`.

## How to work with me

- **Explain every change simply. I am learning.** Say what you changed, why, and what each new idea means, in plain words.
- **Build one feature at a time.** After each feature, stop and wait for my approval before starting the next one.
- **Do not add libraries without asking me.** Ask before any `npm install <something>`, explain what the library does, and suggest a no-library option if there is one.
- **Before each feature, check which of your skills are relevant and use them.** Tell me which skills you used.

## Workflow (agile)

1. **Each build step in `PLAN.md` is a user story**, written as "As a student, I want ... so that ...", with 2-4 acceptance criteria (simple checks that prove it works).
2. **Stories are grouped into small sprints** (1-2 stories each). Each step in `PLAN.md` has a Sprint label.
3. **`main` must always work. Never commit directly to `main`.**
4. **One branch per story**, made from `main`: `feature/<short-name>` (for example `feature/today-timer`). Fixes use `fix/<short-name>`.
5. **Small commits with clear messages**, using these prefixes: `feat:`, `fix:`, `style:`, `refactor:`, `docs:`, `test:`. Example: `feat: add start/stop timer`.
6. **When a story is done:** show me what changed, tell me how to test it on my phone and in the browser, and check it against each acceptance criterion.
7. **Only after I approve:** merge the branch into `main`, delete the branch, and mark the story as Done in `PLAN.md`.
8. **At the end of each sprint:** give a short review covering what was done, what was learned, and what is next.
9. **Explain every git command simply before running it.** I am learning git workflow too.

## Project facts

- No backend and no login. All data is saved on the device (localStorage).
- Mobile-first: design for a phone screen first (about 390px wide).
- Plain CSS with CSS variables for colors and fonts (see "Visual design" in `PLAN.md`).
- Commands: `npm run dev` (start the app), `npm run build` (build for production), `npm run lint` (check the code).

## Dev server

- **Never start your own dev server** (no `npm run dev`, `npx vite`, or `npm run preview`, on any port).
- My dev server runs in Windows PowerShell on port 5173. You run inside WSL, so you may not see it in your process list, but it is running.
- For browser tests, use `http://localhost:5173`.
- If it doesn't respond, **ask me** to start or check it. Don't start a new one.
