<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:flownotes-context -->
# Flownotes Context

## PRD
- Personal notes app (dark mode, blur, grid bg).
- JWT Auth (`jose`).
- Create/edit/delete/share notes. Drag & drop reorder.
- Profiles & Notifications.

## SDD
- Next.js 15 App Router, React 19, Tailwind v4, Shadcn, `@dnd-kit`.
- Drizzle ORM + PostgreSQL 15. Bun runtime.
- Docker + Docker Compose.

## SPEC
- Schema: `users`, `notes` (order col), `shared_notes`, `notifications`.
- Flow: HttpOnly cookies. DND local swap → `/api/notes/reorder` mass update.
<!-- END:flownotes-context -->
