import { Note } from '../store/useNoteStore';
import Database from '@tauri-apps/plugin-sql';

let dbInstance: Database | null = null;

async function getDb(): Promise<Database> {
  if (!dbInstance) {
    dbInstance = await Database.load('sqlite:mdnotes.db');
  }
  return dbInstance;
}

export async function getNotes(): Promise<Note[]> {
  try {
    const db = await getDb();
    const result = await db.select<Note[]>(
      `SELECT id, title, content, created_at, updated_at, order_index 
       FROM notes 
       ORDER BY order_index ASC, updated_at DESC`
    );
    return result;
  } catch (error) {
    console.error('Error getting notes:', error);
    throw error;
  }
}

export async function createNote(title: string, content: string): Promise<number> {
  try {
    const db = await getDb();
    const now = new Date().toISOString();
    
    // Get max order_index
    const maxResult = await db.select<{ max_order: number }[]>(
      'SELECT COALESCE(MAX(order_index), -1) as max_order FROM notes'
    );
    const orderIndex = (maxResult[0]?.max_order ?? -1) + 1;

    const result = await db.execute(
      `INSERT INTO notes (title, content, created_at, updated_at, order_index) 
       VALUES ($1, $2, $3, $4, $5)`,
      [title, content, now, now, orderIndex]
    );
    
    if (result.lastInsertId === undefined) {
      throw new Error('Failed to get lastInsertId from database');
    }
    
    return result.lastInsertId;
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
}

export async function updateNote(
  id: number,
  title: string,
  content: string
): Promise<void> {
  const db = await getDb();
  const now = new Date().toISOString();
  
  await db.execute(
    `UPDATE notes SET title = $1, content = $2, updated_at = $3 WHERE id = $4`,
    [title, content, now, id]
  );
}

export async function deleteNote(id: number): Promise<void> {
  const db = await getDb();
  await db.execute('DELETE FROM notes WHERE id = $1', [id]);
}

export async function updateNoteOrder(id: number, orderIndex: number): Promise<void> {
  const db = await getDb();
  await db.execute('UPDATE notes SET order_index = $1 WHERE id = $2', [orderIndex, id]);
}
