import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { notes, noteReads } from '@/lib/db/schema';
import { eq, desc, and, inArray } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { z } from 'zod';

const createNoteSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().optional()
});

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userNotes = await db.query.notes.findMany({
      where: eq(notes.userId, session.userId),
      orderBy: [notes.order, desc(notes.createdAt)],
    });

    if (userNotes.length === 0) {
      return NextResponse.json({ notes: [] });
    }

    const noteIds = userNotes.map((note) => note.id);
    const readRows = await db.query.noteReads.findMany({
      where: and(
        eq(noteReads.userId, session.userId),
        inArray(noteReads.noteId, noteIds),
      ),
    });

    const readByNoteId = new Map(readRows.map((row) => [row.noteId, row.read === 1]));
    const notesWithReadStatus = userNotes.map((note) => ({
      ...note,
      read: readByNoteId.get(note.id) ?? false,
    }));

    return NextResponse.json({ notes: notesWithReadStatus });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const parsed = createNoteSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }
    
    const { title, content } = parsed.data;

    const userNotes = await db.query.notes.findMany({
      where: eq(notes.userId, session.userId),
      orderBy: [notes.order],
    });

    const newOrder = userNotes.length > 0 ? userNotes[userNotes.length - 1].order + 1 : 0;

    const [newNote] = await db.insert(notes).values({
      userId: session.userId,
      title,
      content: content || '',
      order: newOrder,
    }).returning();

    return NextResponse.json({ note: newNote });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
