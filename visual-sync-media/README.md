# Universal Media Co - Platform

A modern, role-based media management platform built with Next.js 15, Tailwind CSS 4, and Radix UI. This application serves as a central hub for Clients, Editors, and Admins to collaborate on media projects.

## 🚀 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org) (App Router)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com) & [Radix UI](https://www.radix-ui.com)
- **Language:** TypeScript
- **Icons:** [Lucide React](https://lucide.dev)
- **Forms:** React Hook Form + Zod
- **Theming:** `next-themes` (Dark/Light mode)

## 📂 Project Structure & Features

The application is structured around three primary roles, each with a dedicated workspace:

### 1. 👑 Admin Dashboard (`/admin`)
The command center for platform administrators.
- **Dashboard Overview**: High-level metrics, active projects, and system status.
- **User Management**: Manage accounts, roles, and permissions.
- **Project Oversight**: Monitor all active projects across the platform.

### 2. 🏢 Client Portal (`/client`)
Interface for clients to request services and track their projects.
- **Service Requests**: Streamlined forms to request new media services.
- **Project Tracking**: Real-time status updates on ongoing projects.
- **Asset Review**: (Planned) Interface to review and approve deliverables.

### 3. 🎬 Editor Workspace (`/editor`)
Dedicated area for creative professionals.
- **Task Management**: Kanban-style or list view of assigned tasks.
- **Asset Management**: Upload and organize raw footage and project files.
- **Collaborative Tools**: (Planned) Integrated feedback and revision loops.

### 4. 🎛️ Shared Dashboard (`/dashboard`)
Common utilities available to authenticated users.
- **Settings**:
  - **Profile**: Manage personal information.
  - **Account**: Security settings and preferences.
  - **Appearance**: Toggle Dark/Light themes.
- **Chat**: Real-time communication between roles.
- **Team**: View team members and roles.

## 🛠️ Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🎨 Design System

The UI is built using a custom design system based on **Shadcn/UI** components, featuring:
- **Responsive Layouts**: Mobile-first design.
- **Accessible Components**: Detailed attention to ARIA attributes and keyboard navigation.
- **Dynamic Theming**: Seamless dark/light mode switching.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
