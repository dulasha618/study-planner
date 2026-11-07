# Study Planner (JavaScript + SQLite)

Needs Node.js v22.13 or newer (v24 is fine): https://nodejs.org

## First time
    npm install

## Run as a Windows app (own window)
Double-click `start-app.bat`
(right-click it > Send to > Desktop (create shortcut) for a desktop icon)

## Run in the browser instead
    npm start
then open http://localhost:3000

## Phone
- Same Wi-Fi: open http://<PC-IP>:3000 in Chrome > menu > Add to Home screen.
- To install it as a real app (PWA) upload the project to a host with https (e.g. Render), then Chrome shows "Install app".

Data is stored in `planner.db` (schema in schema.sql).

## Features
- Subjects with your own names and colours (tap the dot to pick a colour, tap the name to rename)
- Tasks: Part or Assignment, due date, days needed, minutes per day; edit with the pencil
- Plan: set tasks per day and start time, press Make my plan. Tasks are spread over days with time slots
- Tick a task when done; use the stopwatch button to log study time
- Progress: per-subject bars, time studied in the last 7 days, CSV export (Excel) and Print / PDF
- Reminders for tasks due soon (allow notifications when asked)
- Dark / light theme and English / Sinhala (top right buttons)
- Focus timer (▶ on a task): counts down, then logs the time to that task
- Colour themes (🎨 button), daily overview ring with streak, bottom tab bar on phones
