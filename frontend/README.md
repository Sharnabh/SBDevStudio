# Frontend (React)

Public marketing site plus admin dashboard for SB Dev Studio. Built with React 18, CRACO, Tailwind, Radix UI, and React Router.

## Features
- Public pages: hero, projects, tech stack, testimonials, contact form.
- Admin area: login, dashboard metrics, CRUD for projects/testimonials, contact inbox.
- Axios client with JWT bearer token support and configurable API base.

## Quick start
1) `cd frontend`
2) Install deps: `yarn install`
3) Set `REACT_APP_API_BASE` (defaults to `http://localhost:8000/api`).
4) Run dev server: `yarn start` (http://localhost:3000)

## Scripts
- `yarn start` – run dev server via CRACO
- `yarn build` – production build
- `yarn test` – CRA test runner

## Notes
- Auth token is stored by `useAuth` and injected via axios interceptor in `src/lib/api.js`.
- File uploads use `FormData` and hit `/admin/upload` on the API.
