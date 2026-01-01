# VisualSync Media Platform

A premium global platform for booking, managing, and delivering creative services.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔐 Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Add your credentials to `.env.local`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Create the following table in Supabase SQL Editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  role TEXT CHECK (role IN ('client', 'editor', 'admin')) DEFAULT 'client',
  company TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy: Users can update their own profile  
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

## 📁 Project Structure

```
visualsync/
├── components/       # Reusable UI components
│   ├── Hero.tsx
│   ├── Navbar.tsx
│   ├── Services.tsx
│   ├── Portfolio.tsx
│   ├── Features.tsx
│   └── Footer.tsx
├── pages/            # Route pages
│   ├── Home.tsx
│   ├── Portfolio.tsx
│   ├── About.tsx
│   ├── Contact.tsx
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── client/       # Client portal
│   │   ├── Dashboard.tsx
│   │   ├── BookService.tsx
│   │   └── Projects.tsx
│   └── editor/       # Editor portal
│       ├── Dashboard.tsx
│       └── Workspace.tsx
├── context/          # React contexts
│   └── AuthContext.tsx
├── lib/              # Utilities
│   └── supabase.ts
└── App.tsx           # Main app with routing
```

## 🎨 Features

### Public Pages
- **Home** - Premium landing page with services overview
- **Portfolio** - Work samples grid with category filters
- **About** - Company vision, stats, team
- **Contact** - Contact form and info

### Client Portal (`/dashboard`)
- Dashboard with project overview
- Multi-step booking wizard
- Project tracking with progress
- File downloads and messaging

### Editor Portal (`/editor`)
- Dashboard with assigned projects
- Claim available projects
- Workspace for file management
- Deliverable upload and messaging

## 🛠️ Tech Stack

- **React 19** + TypeScript
- **Vite** - Build tool
- **React Router** - Navigation
- **Supabase** - Auth & Database
- **Tailwind CSS** - Styling (via utility classes)
- **Lucide React** - Icons

## 📝 Core Services

1. Talking Heads (Specialty)
2. Music Videos
3. Podcasts
4. Documentaries
5. Social Edits
6. Photography

## 🏢 Client Roster

Showmax, Superpicks, Youngins, The Travel Boss, GT Gaming Lounge, The Strawhat Group, PLUC, Cash N Sport, OS Clinic, Trade House Media

---

Built with ❤️ by VisualSync Media
