import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { notes } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { z } from 'zod';

const reorderSchema = z.object({
  orderedIds: z.array(z.string())
});

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const parsed = reorderSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }
    
    const { orderedIds } = parsed.data;

    // Process all updates in a transaction
    await db.transaction(async (tx) => {
      for (let i = 0; i < orderedIds.length; i++) {
        await tx.update(notes)
          .set({ order: i })
          .where(and(eq(notes.id, orderedIds[i]), eq(notes.userId, session.userId)));
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
