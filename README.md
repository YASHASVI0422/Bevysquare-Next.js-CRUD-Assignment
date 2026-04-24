# User Management Dashboard

A full CRUD web app built with Next.js 14 (App Router) as part of a frontend internship assignment. Manages users via the [JSONPlaceholder](https://jsonplaceholder.typicode.com) REST API.

🔗 **Live Demo:** https://bevysquarecrudassignment.netlify.app/ &nbsp;|&nbsp; 📁 **Repo:** [github.com/your-username/user-management-dashboard](https://github.com/your-username/user-management-dashboard)

---

## Features

- **List users** — searchable table filtered by name, email, or company
- **View profile** — full user detail including contact, address, and company info
- **Edit user** — inline form with optimistic UI update and rollback on failure
- **Delete user** — confirmation modal with optimistic redirect
- **Axios interceptors** — logs every request, handles errors globally

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| HTTP Client | Axios |
| Styling | CSS Modules |
| Deployment | Vercel |

## Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/your-username/user-management-dashboard.git
cd user-management-dashboard

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/users` automatically.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Redirects → /users
│   └── users/
│       ├── page.tsx            # GET /users — list with search
│       └── [id]/
│           └── page.tsx        # GET, PUT, DELETE /users/:id
├── lib/
│   └── api.ts                  # Axios instance + interceptors
└── types/
    └── index.ts                # User type definitions
```

## How Optimistic Updates Work

1. User hits **Save** → UI updates instantly with new data
2. `PUT /users/:id` fires in the background
3. ✅ If it succeeds → done, toast confirms
4. ❌ If it fails → state rolls back to previous values automatically

Same pattern applies to delete — navigates away immediately, API call happens in background.

## Notes

JSONPlaceholder is a read-only mock API — `PUT` and `DELETE` return `200` but don't persist data server-side. This is expected and documented in the assignment.
