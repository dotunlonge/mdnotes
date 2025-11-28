# MDNotes - Markdown Notes App

A beautiful, distraction-free desktop note-taking application built with Tauri, React, and SQLite.

## Features

- ✨ **Markdown Editor** with live preview
- 💾 **Auto-save** functionality
- 📝 **Multiple Notes** management
- 🔍 **Search & Filter** notes
- 🌙 **Dark/Light Mode** toggle
- 💾 **SQLite** persistent storage
- 🎨 **Modern UI** with Tailwind CSS

## Tech Stack

- **Tauri** - Cross-platform desktop framework
- **React** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **SQLite** - Local database
- **React Markdown** - Markdown rendering
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Rust (latest stable)
- System dependencies for Tauri (see [Tauri docs](https://tauri.app/v1/guides/getting-started/prerequisites))

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd mdnotes
```

2. Install dependencies:
```bash
npm install
```

3. Run in development mode:
```bash
npm run tauri dev
```

### Building

To build the app for production:

```bash
npm run tauri build
```

## Project Structure

```
mdnotes/
├── src/
│   ├── components/     # React components
│   ├── lib/           # Database utilities
│   ├── store/         # Zustand stores
│   └── App.tsx        # Main app component
├── src-tauri/         # Rust backend
│   └── src/
│       └── lib.rs     # Tauri commands & SQL setup
└── public/            # Static assets
```

## Development

The app is structured to allow incremental feature development:

1. **Database Setup** - SQLite with migrations
2. **UI Layout** - Sidebar + Editor
3. **CRUD Operations** - Create, read, update, delete notes
4. **Markdown Editor** - Live preview
5. **Auto-save** - Automatic note saving
6. **Theme Toggle** - Dark/light mode
7. **Search** - Filter notes by content
8. **Drag & Drop** - Reorder notes (coming soon)

## License

MIT


# mdnotes
