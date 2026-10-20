# Agent Guidelines for nivarana.org

## Build, Lint, and Test Commands

### Development

```bash
npm run dev          # Start Next.js dev server
npm run build        # Build for production
npm run start        # Start production server
```

### Linting & Formatting

```bash
npm run lint         # Run ESLint on all files
npm run lint -- --fix  # Auto-fix ESLint issues
```

- ESLint config: `eslint.config.mjs` - extends Next.js + TypeScript + Prettier
- Prettier config: `.prettierrc` - uses 4-space indentation

### Testing

```bash
npm run test                    # Run all tests (Vitest)
npm run test -- src/foo.test.ts  # Run single test file
npm run test -- --run            # Run once (no watch mode)
```

- Test framework: Vitest with jsdom environment
- Test files: `*.test.ts` or `*.test.tsx` in same directory as source

### Database

For database migrations, generate the relevant SQL and ask the user to run it manually. Do not try to do migrations on your own.

## Code Style Guidelines

### TypeScript

- Strict mode enabled in tsconfig.json
- Use explicit types; avoid `any`
- Path aliases: `@/*` maps to `./src/*`

### React & Next.js

- Use React Compiler (experimental in next.config.mjs)
- Server Actions: mark with `"use server"` directive
- Client components: mark with `"use client"` directive
- Prefer `next/image` for images, `next/link` for navigation

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

### Naming Conventions

- **Files**: camelCase for utilities (`auth.ts`), PascalCase for components (`Header.tsx`)
- **Components**: PascalCase (`ArticleCard`)
- **Functions/variables**: camelCase (`getArticleByPath`)
- **Constants**: UPPER_SNAKE_CASE for config values
- **Types/Interfaces**: PascalCase (`Article`, `Author`)

### Imports

- Use absolute imports with `@/` prefix for shared code
- **Within a route, import co-located files relatively** (`./queries`, `./_components/X`). See "File Organization" below.
- Order: external → internal → relative
- Group: imports, then blank line, then types

```typescript
import { useState } from "react";
import Link from "next/link";
import { getImageURLFromFileName } from "@/utils/paths";

import { getArticleByPath } from "./queries";
import { ArticleCard } from "./_components/ArticleCard";

import type { Article } from "./queries";
```

## File Organization

The project uses a **hybrid co-location** model. Code lives next to the route that
uses it; only genuinely shared code stays in the global `src/` folders.

### Rule of thumb

> If exactly **one** route uses it, co-locate it. If **two or more** routes (or
> global code) use it, keep it in the global folder.

### Route folder layout

```
src/app/<route>/            # a route folder OR a route-group folder like (public)
├── page.tsx                # reserved Next.js names stay at the route root
├── layout.tsx              #   (also loading.tsx, error.tsx, route.ts, ...)
├── queries.ts              # this route's complete data surface
├── actions.ts              # this route's server actions
├── _components/            # components imported only by this route
│   └── ...                 # subfolders allowed, mirroring the old structure
└── _lib/                   # route-private utils, types, config, helpers
```

- Next.js ignores anything inside a folder prefixed with `_`, and ignores
  non-reserved filenames. That is what makes `_components/` and `_lib/` safe.
- Every file that `page.tsx` imports should be co-located, unless it is shared
  (see below). Co-located files may freely import from global folders.
- A route **group** is treated as one route for this purpose: components used
  only by `(public)/layout.tsx` live in `src/app/(public)/_components/`.

### Data queries: `queries.ts`

Each route owns a `queries.ts` that is **the only place the route reads data
from**. `page.tsx`, `actions.ts` and co-located components import from
`./queries` (or `../queries`), and **never** from `@/data/*` directly.

`queries.ts` has two jobs:

1. **Own** the implementation, when only this route needs it.
2. **Re-export** a global implementation, when 2+ routes need it. This keeps the
   pattern without duplicating code.

```typescript
// src/app/(admin)/admin/people/queries.ts

// 2+ consumers -> implementation stays global, route re-exports it
export { getAuthorsOverview, type Author } from "@/data/authors";

// 1 consumer -> implementation lives here
import { db } from "@/data/db";

export const addOrEditAuthor = (author: Author) => /* ... */;
```

Global code (`src/components/**`, `src/actions/**`) imports `@/data/*` directly
and must **never** import from `src/app/**`.

### What stays global

`src/components`, `src/actions`, `src/data`, `src/utils`, `src/types`,
`src/lib`, `src/config`, `src/network` hold only code used by 2+ routes.

Always global, regardless of consumer count:

- `data/db.ts`, `data/db.d.ts` — connection and schema
- `data/queries.ts` — shared SQL fragments (`authorsFragment`,
  `categoriesFragment`, `tagsFragment`, `articleData`)
- `data/post-relations.ts` — post relation mutations
- `data/authorization.ts` — the `asAdmin` guard
- `data/subscriptions.ts` — used by many routes and webhooks

### Promoting and demoting

- A co-located function gains a second consumer → **promote** it to the matching
  `src/data/*` (or `src/components/*`, `src/utils/*`) module and re-export it
  from the route `queries.ts`.
- A global function loses all but one consumer → **demote** it into that route's
  `queries.ts` / `_components/` / `_lib/`.

### Formatting

- Indentation: 4 spaces (per .prettierrc)
- Semicolons: required
- Quotes: double quotes for strings
- Trailing commas: in multi-line objects/arrays

### Error Handling

- Use try/catch for async operations
- Log errors with `console.error`
- Return error objects: `{ status: false, message: err }`
- Use TypeScript error types when possible

### UI Components

- Primary UI library: tailwindcss
- Styling: Tailwind CSS

### Database

- Query builder: Kysely (type-safe SQL) over `mysql2`
- Schema types: `src/data/db.d.ts`, generated with `kysely-codegen`
- Connection: `src/data/db.ts` exports the shared `db` instance; import it, do
  not create new pools
- Auth: better-auth for authentication
- Mutations that require an admin must be wrapped in `asAdmin` from
  `src/data/authorization.ts`

### Testing Guidelines

- Place tests alongside source files: `foo.ts` → `foo.test.ts`
- Use `expect` from vitest
- Mock external dependencies (database, APIs)

### Project Structure

```
src/
├── actions/          # Server Actions used by 2+ routes
├── app/              # Next.js App Router
│   ├── (admin)/      # Admin route group
│   │   ├── _components/   # components used only by this group's layout
│   │   └── admin/
│   │       ├── queries.ts # dashboard data surface
│   │       └── articles/
│   │           ├── _components/   # route-private components
│   │           ├── queries.ts     # this route's data surface
│   │           ├── actions.ts     # this route's server actions
│   │           └── page.tsx
│   ├── (public)/     # Public route group (same shape; e.g. [type]/[slug])
│   │   ├── _components/   # header, footer, banner, social, ...
│   │   ├── _lib/          # youtube.ts, ...
│   │   ├── queries.ts     # group layout's data surface
│   │   └── page.tsx
│   └── api/          # API routes
├── components/       # React components shared by 2+ routes
│   ├── admin/        # e.g. ArticleEditor, ImagePicker, loaders
│   ├── article/      # ArticlePreview
│   ├── authors/      # Authors
│   ├── loader/       # index
│   ├── search/       # search-icon
│   ├── sidebar/      # index, popular
│   └── user/         # LogOut
├── data/             # Data layer: only code with 2+ consumers
│   ├── db.ts         # Kysely instance
│   ├── db.d.ts       # generated DB schema types
│   ├── queries.ts    # shared SQL fragments
│   └── *.ts          # posts, authors, categories, tags, pages, ...
├── config/           # Shared config (images.mjs, also read by next.config.mjs)
├── network/          # External API clients
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## API Routes & Server Actions

### API Routes

- Place in `src/app/api/` directory
- Use Next.js App Router conventions
- Export named functions: `GET`, `POST`, `PUT`, `DELETE`

### Server Actions

- Mark with `"use server"` at top of file
- Handle form data with `FormData`
- Return structured responses: `{ status: boolean, message?: string, data?: T }`
- Use try/catch with error logging

```typescript
"use server";
export const myAction = async (formData: FormData) => {
    try {
        await doSomething();
        return { status: true };
    } catch (err) {
        console.error(err);
        return { status: false, message: err };
    }
};
```

## Environment Variables

- Never commit secrets to repository
- Use `.env.local` for local development
- Required variables documented elsewhere
- Access via `process.env.VARIABLE_NAME`

## Best Practices

- Use `server-only` for data-fetching utilities
- Use `revalidatePath` for Next.js caching
- Validate all user inputs; use parameterized queries
- Use semantic HTML; include alt text for images

## Running Full CI Check

Before submitting changes:

```bash
npm run lint -- --fix    # Fix linting issues
npm run build           # Verify build succeeds
npm run test -- --run   # Run all tests
```

## git preference

DO NOT EVER COMMIT OR PUSH CODE UNLESS THE USER ASKS YOU TO
