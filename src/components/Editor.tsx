import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useNoteStore } from '../store/useNoteStore';
import { updateNote } from '../lib/db';
import { Moon, Sun } from 'lucide-react';

export function Editor() {
  const { notes, currentNoteId, updateNote: updateNoteInStore } = useNoteStore();
  const currentNote = notes.find((n) => n.id === currentNoteId);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' ||
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [currentNote]);

  useEffect(() => {
    // Apply dark mode class
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Auto-save after 2 seconds of inactivity
    if (currentNoteId && (title !== currentNote?.title || content !== currentNote?.content)) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(async () => {
        if (currentNoteId) {
          await updateNote(currentNoteId, title, content);
          updateNoteInStore(currentNoteId, { title, content });
        }
      }, 2000);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [title, content, currentNoteId, currentNote, updateNoteInStore]);

  if (!currentNote) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {notes.length === 0 ? 'Create your first note to get started' : 'Select a note to edit'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-950 h-screen">
      <div className="border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title..."
          className="flex-1 text-2xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400"
        />
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          {isDarkMode ? (
            <Sun size={20} className="text-gray-700 dark:text-gray-300" />
          ) : (
            <Moon size={20} className="text-gray-700 dark:text-gray-300" />
          )}
        </button>
      </div>
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 border-r border-gray-200 dark:border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Editor</h2>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your markdown note..."
            className="flex-1 p-6 bg-transparent border-none outline-none resize-none font-mono text-sm text-gray-900 dark:text-white placeholder-gray-400"
          />
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Preview</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-6 prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {content || '*Start writing to see preview...*'}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}

