# Cue Radar

Cue Radar is a career operating system for independent contemporary dance, performance, and experimental sound artists across European, Mediterranean, and East-Asian scenes.

## Stack
- **Framework**: Next.js 15 (App Router, React 19)
- **Styling**: Tailwind CSS v4
- **Database & Auth**: Supabase PostgreSQL + `@supabase/ssr` (Google Auth)
- **Validation**: Zod
- **Sync Pipeline**: Python (`gspread` + `supabase`) via GitHub Actions

## Data Flow
```
Google Sheet (Source of Truth)
   └─► GitHub Action (python sync script every 6h)
          └─► Supabase Postgres (read-only tables + hub_feed view)
                 └─► Next.js App Router (Server Components + RLS)
```

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

3. Run development server:
   ```bash
   npm run dev
   ```
