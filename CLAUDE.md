# LIKQ Music Homepage

## Package Manager

This project uses **bun** (not npm). Always use `bun` for installing dependencies and running scripts.

```bash
bun install
bun run build
bun run dev
```

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Deployed on Vercel

## Build with Vercel Environment

To build with Vercel environment variables:

```bash
vercel env pull --environment=preview --git-branch=develop
bun run build
```
