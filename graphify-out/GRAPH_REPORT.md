# Graph Report - flownotes  (2026-04-24)

## Corpus Check
- 34 files · ~17,269 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 97 nodes · 90 edges · 27 communities detected
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]

## God Nodes (most connected - your core abstractions)
1. `POST()` - 11 edges
2. `Personal Notes App` - 7 edges
3. `Technology Stack` - 7 edges
4. `getSession()` - 6 edges
5. `Context-Mode Routing Rules` - 6 edges
6. `hashPassword()` - 5 edges
7. `PUT()` - 5 edges
8. `GET()` - 4 edges
9. `Note` - 4 edges
10. `DELETE()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --calls--> `clearSession()`  [INFERRED]
  src/app/api/notifications/route.ts → src/lib/auth.ts
- `POST()` --calls--> `setSession()`  [INFERRED]
  src/app/api/notifications/route.ts → src/lib/auth.ts
- `POST()` --calls--> `getSession()`  [INFERRED]
  src/app/api/notifications/route.ts → src/lib/auth.ts
- `GET()` --calls--> `getSession()`  [INFERRED]
  src/app/api/notifications/route.ts → src/lib/auth.ts
- `ProfilePage()` --calls--> `useAuth()`  [INFERRED]
  src/app/profile/page.tsx → src/components/auth-provider.tsx

## Hyperedges (group relationships)
- **Flownotes Technology Stack** — prompt_bun, prompt_nextjs, prompt_drizzle_orm, prompt_sqlite, prompt_shadcn_ui, prompt_tailwind_css [EXTRACTED 1.00]

## Communities

### Community 0 - "Community 0"
Cohesion: 0.24
Nodes (3): GET(), hashPassword(), POST()

### Community 1 - "Community 1"
Cohesion: 0.25
Nodes (7): clearSession(), decrypt(), encrypt(), getSession(), setSession(), DELETE(), PUT()

### Community 2 - "Community 2"
Cohesion: 0.22
Nodes (9): Blocked Direct HTTP Fetching, Context-Mode Routing Rules, Protect Context Window From Flooding, Output Constraints, Raw HTTP Responses Can Flood Context, Redirected Analysis Workflow, Only Stdout Should Enter Context, Tool Selection Hierarchy (+1 more)

### Community 3 - "Community 3"
Cohesion: 0.29
Nodes (2): fetchNotes(), handleSaveNote()

### Community 4 - "Community 4"
Cohesion: 0.43
Nodes (7): Create New Note Action, Dark Mode Visual Design, Example Note Seed, Homepage Notes Card Listing, Note, Note Editing Flow, Personal Notes App

### Community 5 - "Community 5"
Cohesion: 0.29
Nodes (7): Bun, Drizzle ORM, Next.js, ShadCn/UI, SQLite, Tailwind, Technology Stack

### Community 7 - "Community 7"
Cohesion: 0.4
Nodes (2): useAuth(), ProfilePage()

### Community 9 - "Community 9"
Cohesion: 1.0
Nodes (2): colorIndexFromId(), NoteCard()

### Community 10 - "Community 10"
Cohesion: 1.0
Nodes (2): hashPassword(), seed()

### Community 26 - "Community 26"
Cohesion: 1.0
Nodes (1): flownotes

## Knowledge Gaps
- **15 isolated node(s):** `flownotes`, `Dark Mode Visual Design`, `Bun`, `Next.js`, `Drizzle ORM` (+10 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 11`** (2 nodes): `RootLayout()`, `layout.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (2 nodes): `handleSubmit()`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (2 nodes): `theme-provider.tsx`, `ThemeProvider()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (2 nodes): `Label()`, `label.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (2 nodes): `cn()`, `button.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (2 nodes): `Input()`, `input.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (2 nodes): `utils.ts`, `cn()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (1 nodes): `postcss.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (1 nodes): `drizzle.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (1 nodes): `eslint.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (1 nodes): `next.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (1 nodes): `sonner.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (1 nodes): `schema.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (1 nodes): `index.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (1 nodes): `flownotes`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `POST()` connect `Community 0` to `Community 1`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `getSession()` connect `Community 1` to `Community 0`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `Technology Stack` connect `Community 5` to `Community 4`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `POST()` (e.g. with `clearSession()` and `setSession()`) actually correct?**
  _`POST()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `getSession()` (e.g. with `PUT()` and `GET()`) actually correct?**
  _`getSession()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `flownotes`, `Dark Mode Visual Design`, `Bun` to the rest of the system?**
  _15 weakly-connected nodes found - possible documentation gaps or missing edges._