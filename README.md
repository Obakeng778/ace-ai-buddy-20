# Tech for you by OB

A modern, responsive AI productivity assistant that helps you draft professional emails, summarize meeting notes, and chat with an AI companion. Built with a clean, enterprise-grade design inspired by Microsoft Copilot, Notion, and Linear.

## Project Overview

Tech for you by OB is a SaaS-style web application focused on simplicity, speed, and exceptional user experience. It provides a centralized workspace where users can generate polished emails, convert meeting notes into structured summaries, and interact with an AI assistant through a streaming chat interface. All generated content can be edited, copied, regenerated, exported, and saved locally for quick access later.

The application is wired to the Lovable AI Gateway (Gemini 3 Flash) via AI SDK for consistent, high-quality responses, with a future-ready architecture for additional AI provider integrations.

## Features Implemented

- **Smart Email Generator**
  - Generate professional emails based on purpose, recipient, tone, and key points
  - Edit, regenerate, copy, and export generated emails
  - Customizable tone settings (formal, casual, persuasive, friendly, etc.)
  - Save generated emails to local history

- **Meeting Notes Summarizer**
  - Paste meeting notes or transcripts and receive structured summaries
  - Multiple summary formats: Executive, Detailed, and Bullets
  - Action items extraction with assignee and deadline detection
  - Editable, copyable, and exportable outputs

- **AI Chat Assistant**
  - Streaming chat interface with Markdown rendering
  - Persistent conversation history in the browser
  - Clear, distraction-free messaging UI

- **History & Persistence**
  - LocalStorage-based history for emails, summaries, and chat sessions
  - Quick access to previously generated content

- **User Experience**
  - Responsive sidebar layout with smooth navigation
  - Light and dark mode support
  - Polished shadcn/ui components with Tailwind CSS
  - AI-generated content disclaimer for safe usage

- **Settings**
  - Theme customization
  - Centralized preferences for a consistent experience

## Technologies and Tools Used

- **Framework**: TanStack Start v1 (React 19, full-stack, SSR/SSG, Vite 7)
- **Routing**: TanStack Router (file-based routing)
- **Styling**: Tailwind CSS v4, Geist fonts, shadcn/ui components
- **State Management**: React hooks, TanStack Query, localStorage
- **AI Integration**: Vercel AI SDK (`ai` / `@ai-sdk/google`), Lovable AI Gateway (Gemini 3 Flash)
- **Server Logic**: TanStack server functions (`createServerFn`)
- **API Route**: Server route for streaming chat (`/api/chat`)
- **Utilities**: TypeScript, Zod (validation), React Markdown, `lucide-react`

## Setup Instructions

### Prerequisites

- [Bun](https://bun.sh/) installed on your machine
- A Lovable AI API key set as `LOVABLE_API_KEY`

### Install dependencies

```bash
bun install
```

### Environment variables

Create a `.env` file in the project root and add:

```env
LOVABLE_API_KEY=your_lovable_api_key_here
```

> The `LOVABLE_API_KEY` is used by the Lovable AI Gateway for AI completions and chat responses.

### Run the development server

```bash
bun dev
```

The application will be available at `http://localhost:8080`.

### Build for production

```bash
bun run build
```

### Type check

```bash
bun run typecheck
```

### Lint

```bash
bun run lint
```

## Disclaimer

AI-generated content should be reviewed before professional use. Do not enter confidential, sensitive, or personally identifiable information into the AI tools.
