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

### Naming Conventions

- **Files**: camelCase for utilities (`auth.ts`), PascalCase for components (`Header.tsx`)
- **Components**: PascalCase (`ArticleCard`)
- **Functions/variables**: camelCase (`getArticleByPath`)
- **Constants**: UPPER_SNAKE_CASE for config values
- **Types/Interfaces**: PascalCase (`Article`, `Author`)

### Imports

- Use absolute imports with `@/` prefix
- Order: external → internal → relative
- Group: imports, then blank line, then types

```typescript
import { useState } from "react";
import Link from "next/link";
import { getArticleByPath } from "@/data/ContentRepository";
import type { Article } from "@/types/nivarana";
```

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
- Styling:  Tailwind CSS

### Database

- ORM: Kysely (type-safe SQL query builder) + knex + objection.js
- Models: Objection.js for model definitions
- Auth: better-auth for authentication

### Testing Guidelines

- Place tests alongside source files: `foo.ts` → `foo.test.ts`
- Use `expect` from vitest
- Mock external dependencies (database, APIs)

### Project Structure

```
src/
├── actions/          # Server Actions
├── app/              # Next.js App Router pages
│   ├── (admin)/      # Admin routes (grouped with parentheses)
│   └── api/          # API routes
├── components/       # React components
│   ├── admin/        # Admin dashboard components
│   ├── article/      # Article display components
│   ├── blocks/       # Reusable block components
│   ├── header/       # Header/navigation components
│   ├── sidebar/      # Sidebar components
│   └── ...
├── data/             # Data layer (CMS, DB, models)
│   ├── models/       # Objection.js models
│   └── *.ts          # Data access utilities
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
