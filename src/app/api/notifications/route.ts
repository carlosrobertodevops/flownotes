import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { notifications } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { z } from 'zod';

const notificationSchema = z.object({
  id: z.union([z.string(), z.number()]).optional()
});

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userNotifications = await db.query.notifications.findMany({
      where: eq(notifications.userId, session.userId),
      orderBy: [desc(notifications.createdAt)],
      limit: 20,
    });

    return NextResponse.json({ notifications: userNotifications });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const parsed = notificationSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }
    
    const { id } = parsed.data;

    if (!id) {
        // mark all as read
        await db.update(notifications)
        .set({ read: 1 })
        .where(eq(notifications.userId, session.userId));
        return NextResponse.json({ success: true });
    }

    await db.update(notifications)
      .set({ read: 1 })
      .where(eq(notifications.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
