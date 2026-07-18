# AGENTS.md

# NovaLibrary

This is a production-ready Full Stack AI-powered Digital Library.

## Tech Stack

Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- TanStack Query
- React Hook Form
- shadcn/ui

Backend
- Express.js
- TypeScript
- MongoDB Native Driver (Do NOT use Mongoose)

Storage
- Supabase Storage

AI
- LangChain
- Google Gemini API

---

## Architecture Rules

- Keep code modular.
- Follow the existing folder structure.
- Never rewrite unrelated files.
- Modify only the files required for the current task.
- Prefer reusable components.
- Prefer reusable utility functions.
- Separate business logic from UI.

---

## TypeScript Rules

- Always use TypeScript.
- Never use `any` unless absolutely necessary.
- Use proper interfaces and types.
- Keep strict typing.

---

## Backend Rules

- Use MongoDB Native Driver.
- Do NOT use Mongoose.
- Separate routes, controllers, services, and middleware.
- Validate all incoming requests.
- Return consistent JSON responses.
- Use async/await.

---

## Frontend Rules

- Use App Router.
- Keep components small and reusable.
- Use TanStack Query for server state.
- Use React Hook Form for forms.
- Use Tailwind CSS only.
- Keep UI fully responsive.

---

## AI Rules

- Use LangChain with Gemini.
- Keep prompts reusable.
- Keep AI logic inside dedicated services.
- Never hardcode prompts inside routes.

---

## UI Rules

- Dark mode only.
- Maximum 3 primary colors.
- Consistent spacing.
- Consistent card design.
- Mobile-first responsive design.

---

## Code Quality

- Write clean, readable code.
- Avoid duplicate logic.
- Do not create unnecessary files.
- Explain major architectural decisions when needed.