# Document RAG Frontend

A React + Vite + TypeScript frontend for the Document RAG system.

## Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Features

- **Session Management**: Automatically generates unique sessions, persists them in sessionStorage, and ensures backend cleanup on reload/reset.
- **Secure Key Handling**: Gemini API Key is stored in memory only and cleared on reload.
- **Styling**: Custom CSS (no frameworks) with a premium dark/glassmorphism design.
- **Type Safety**: Full TypeScript implementation.
- **API Integration**: Connects to `http://localhost:8000/api`.

## Tech Stack

- React
- Vite
- TypeScript
- Vanilla CSS
