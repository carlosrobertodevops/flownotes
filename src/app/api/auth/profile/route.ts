import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import * as crypto from 'crypto';
import { z } from 'zod';

const profileSchema = z.object({
  name: z.string().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, 'Password must be at least 6 characters').optional()
}).refine(data => {
  if (data.newPassword && !data.currentPassword) return false;
  return true;
}, { message: 'Current password is required to set a new password', path: ['currentPassword'] });

function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const parsed = profileSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }
    
    const { name, currentPassword, newPassword } = parsed.data;

    const user = await db.query.users.findFirst({
      where: eq(users.id, session.userId),
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const updateData: any = {};
    if (name) updateData.name = name;

    if (currentPassword && newPassword) {
      if (user.password !== hashPassword(currentPassword)) {
        return NextResponse.json({ error: 'Invalid current password' }, { status: 400 });
      }
      updateData.password = hashPassword(newPassword);
    }

    if (Object.keys(updateData).length > 0) {
      updateData.updatedAt = new Date();
      await db.update(users).set(updateData).where(eq(users.id, session.userId));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
