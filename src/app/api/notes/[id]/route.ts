import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { notes, sharedNotes, notifications } from '@/lib/db/schema';
import { eq, and, or } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { z } from 'zod';

const updateNoteSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  content: z.string().optional()
});

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    
    const body = await request.json();
    const parsed = updateNoteSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }
    
    const { title, content } = parsed.data;

    // Check if user owns the note or it is shared with them
    const note = await db.query.notes.findFirst({
      where: eq(notes.id, id),
    });

    if (!note) return NextResponse.json({ error: 'Note not found' }, { status: 404 });

    const isOwner = note.userId === session.userId;
    let isShared = false;

    if (!isOwner) {
      const shared = await db.query.sharedNotes.findFirst({
        where: and(eq(sharedNotes.noteId, id), eq(sharedNotes.sharedWithUserId, session.userId)),
      });
      if (shared) isShared = true;
    }

    if (!isOwner && !isShared) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [updatedNote] = await db.update(notes)
      .set({ title, content, updatedAt: new Date() })
      .where(eq(notes.id, id))
      .returning();

    // Send notification to owner if edited by shared user
    if (isShared && !isOwner) {
      await db.insert(notifications).values({
        userId: note.userId,
        message: `Your note "${note.title}" was edited.`,
      });
    }

    return NextResponse.json({ note: updatedNote });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    const note = await db.query.notes.findFirst({
      where: and(eq(notes.id, id), eq(notes.userId, session.userId)),
    });

    if (!note) return NextResponse.json({ error: 'Note not found or unauthorized' }, { status: 404 });

    // Delete shared references first
    await db.delete(sharedNotes).where(eq(sharedNotes.noteId, id));
    
    await db.delete(notes).where(eq(notes.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
