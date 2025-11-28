import { create } from 'zustand';

export interface Note {
  id?: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  order_index: number;
}

interface NoteStore {
  notes: Note[];
  currentNoteId: number | null;
  searchQuery: string;
  setNotes: (notes: Note[]) => void;
  setCurrentNoteId: (id: number | null) => void;
  addNote: (note: Note) => void;
  updateNote: (id: number, note: Partial<Note>) => void;
  removeNote: (id: number) => void;
  setSearchQuery: (query: string) => void;
}

export const useNoteStore = create<NoteStore>((set) => ({
  notes: [],
  currentNoteId: null,
  searchQuery: '',
  setNotes: (notes) => set({ notes }),
  setCurrentNoteId: (id) => set({ currentNoteId: id }),
  addNote: (note) => set((state) => ({ notes: [...state.notes, note] })),
  updateNote: (id, updates) =>
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id ? { ...note, ...updates } : note
      ),
    })),
  removeNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((note) => note.id !== id),
      currentNoteId: state.currentNoteId === id ? null : state.currentNoteId,
    })),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));


