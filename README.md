# NovaLibrary 📚✨


NovaLibrary is an **AI-powered digital library** designed to make reading, learning, and discovering knowledge more engaging and intelligent. Instead of simply storing books, NovaLibrary leverages generative AI to help readers parse contents faster, extract insights, and chat directly with uploaded books.

---

## 🤖 AI-Assisted Development Notice
This repository was developed using **AI-Assisted Development** in active pair-programming collaboration with **Antigravity**, the advanced agentic AI coding assistant designed by **Google DeepMind's Advanced Agentic Coding team**. 

The architecture, premium responsive layout animations (powered by `framer-motion`), self-healing API retries, and modular page structures were co-authored dynamically by the developer and the AI agent.

---

## 🌟 Core Features

- **🤖 AI Book Summarization:** Automatically reads and generates high-fidelity 3-sentence summaries and key learning takeaways for uploaded PDFs using Google Gemini.
- **💬 Chat with Any Book:** Features a conversational interface allowing readers to query, explain, and interact directly with the contents of uploaded PDFs.
- **⬆️ Book Ingestion & Moderation:** Secure multi-stage book upload pipeline with automated tagging, language mapping, and admin-led approval dashboards.
- **📊 Interactive Metrics:** Dynamic landing counter animations displaying live repository statistics.
- **🌐 Explore & Filter Catalog:** Advanced categorization filters, searching, and sorting with a responsive mobile-friendly sliding drawer.
- **🔑 Secure Authentication:** Full authentication workflows and role-based access control built using Better Auth and Google OAuth.

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js (App Router) & React
- **Language:** TypeScript
- **Styling:** Tailwind CSS & Vanilla CSS
- **Animations:** Framer Motion (for smooth layouts, transitions, and slider controls)
- **State Management & Queries:** TanStack React Query

### Backend
- **Framework:** Express.js (Node.js)
- **Database:** MongoDB (Native Driver implementation, Mongoose-free)
- **Object Storage:** Supabase Storage (for book covers and PDF uploads)
- **Authentication:** Better Auth

### Artificial Intelligence
- **Orchestration:** LangChain
- **LLM Engine:** Google Gemini API (gemini-3.5-flash)

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18.x or higher)
- **MongoDB Database** (Cloud Atlas URI or Local instance)
- **Google Gemini API Key**
- **Supabase Account** (Storage bucket set up)

### 2. Environment Setup
Create a `.env` file in the root of the `novalibrary` frontend and backend directories:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
BETTER_AUTH_SECRET=your_auth_secret
BETTER_AUTH_URL=http://localhost:3000
MONGODB_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Installation
Install dependencies for both frontend and backend repositories:

```bash
# In the frontend directory
npm install

# In the backend directory
npm install
```

### 4. Running the Development Servers
Start the hot-reloading development instances:

```bash
# Run the frontend (Next.js)
npm run dev

# Run the backend (Express server)
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to explore the ecosystem.

---

## 🛡️ License & Attributions
Co-authored by **Omar Faruk** & **Antigravity AI (Google DeepMind)**. All rights reserved. 
Happy Reading! 📚✨
