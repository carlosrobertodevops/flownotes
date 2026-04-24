import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { notes, sharedNotes, noteReads } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { z } from 'zod';

const readSchema = z.object({
  read: z.boolean(),
});

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    const body = await request.json();
    const parsed = readSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const note = await db.query.notes.findFirst({
      where: eq(notes.id, id),
    });

    if (!note) return NextResponse.json({ error: 'Note not found' }, { status: 404 });

    const isOwner = note.userId === session.userId;
    let isShared = false;

    if (!isOwner) {
      const shared = await db.query.sharedNotes.findFirst({
        where: and(
          eq(sharedNotes.noteId, id),
          eq(sharedNotes.sharedWithUserId, session.userId),
        ),
      });
      if (shared) isShared = true;
    }

    if (!isOwner && !isShared) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [readStatus] = await db.insert(noteReads)
      .values({
        noteId: id,
        userId: session.userId,
        read: parsed.data.read ? 1 : 0,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [noteReads.noteId, noteReads.userId],
        set: {
          read: parsed.data.read ? 1 : 0,
          updatedAt: new Date(),
        },
      })
      .returning();

    return NextResponse.json({
      noteId: id,
      read: readStatus.read === 1,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
