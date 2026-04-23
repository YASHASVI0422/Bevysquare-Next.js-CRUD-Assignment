# User Management — Next.js CRUD

Clean, functional user management dashboard. No fluff.

## Stack
- Next.js 14 (App Router)
- TypeScript
- Axios + interceptors
- CSS Modules

## Run
```bash
npm install
npm run dev
```

## Deploy
Push to GitHub → import on [vercel.com](https://vercel.com). Zero config.

## Features
- `/users` — table view with live search, initials avatars
- `/users/[id]` — view, edit (name + email), delete
- Optimistic updates — UI updates instantly, rolls back on API failure
- Axios interceptor — logs requests, handles errors globally
