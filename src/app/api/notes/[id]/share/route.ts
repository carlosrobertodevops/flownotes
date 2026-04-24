import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, sharedNotes, notes, notifications } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { z } from 'zod';

const shareSchema = z.object({
  email: z.string().email('Invalid email address')
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    
    const body = await request.json();
    const parsed = shareSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }
    
    const { email } = parsed.data;

    // Ensure the current user owns the note
    const note = await db.query.notes.findFirst({
      where: and(eq(notes.id, id), eq(notes.userId, session.userId)),
    });

    if (!note) return NextResponse.json({ error: 'Note not found or unauthorized' }, { status: 404 });

    // Find the user to share with
    const userToShareWith = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!userToShareWith) return NextResponse.json({ error: 'User with this email not found' }, { status: 404 });
    if (userToShareWith.id === session.userId) return NextResponse.json({ error: 'Cannot share with yourself' }, { status: 400 });

    // Check if already shared
    const existingShare = await db.query.sharedNotes.findFirst({
      where: and(eq(sharedNotes.noteId, id), eq(sharedNotes.sharedWithUserId, userToShareWith.id)),
    });

    if (existingShare) return NextResponse.json({ error: 'Already shared with this user' }, { status: 400 });

    // Create the share
    await db.insert(sharedNotes).values({
      noteId: id,
      sharedByUserId: session.userId,
      sharedWithUserId: userToShareWith.id,
    });
    
    // Notify the user
    await db.insert(notifications).values({
      userId: userToShareWith.id,
      message: `A note "${note.title}" was shared with you.`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
