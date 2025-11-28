import { useEffect } from 'react';
import { useNoteStore } from '../store/useNoteStore';
import { getNotes, deleteNote, createNote } from '../lib/db';
import { Trash2, Search, Plus } from 'lucide-react';

export function Sidebar() {
  const {
    notes,
    currentNoteId,
    searchQuery,
    setNotes,
    setCurrentNoteId,
    removeNote,
    setSearchQuery,
  } = useNoteStore();

  useEffect(() => {
    loadNotes();
  }, []);

  async function loadNotes() {
    const loadedNotes = await getNotes();
    setNotes(loadedNotes);
    // Select first note if none selected
    if (loadedNotes.length > 0 && !currentNoteId) {
      setCurrentNoteId(loadedNotes[0].id!);
    }
  }

  async function handleDeleteNote(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this note?')) {
      await deleteNote(id);
      removeNote(id);
    }
  }

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-screen">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            MDNotes
          </h1>
        </div>
        <button
          onClick={async () => {
            try {
              console.log('Creating new note...');
              const id = await createNote('Untitled Note', '');
              console.log('Note created with id:', id);
              await loadNotes();
              setCurrentNoteId(id);
            } catch (error) {
              console.error('Error creating note:', error);
              alert('Failed to create note: ' + (error instanceof Error ? error.message : String(error)));
            }
          }}
          className="w-full flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus size={18} />
          New Note
        </button>
        <div className="relative mt-3">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredNotes.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
            {searchQuery ? 'No notes found' : 'No notes yet'}
          </div>
        ) : (
          <div className="p-2">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => setCurrentNoteId(note.id!)}
                className={`group p-3 mb-2 rounded-lg cursor-pointer transition-colors ${
                  currentNoteId === note.id
                    ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700'
                    : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate mb-1">
                      {note.title || 'Untitled'}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                      {note.content.substring(0, 60)}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {new Date(note.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDeleteNote(note.id!, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-opacity"
                  >
                    <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


