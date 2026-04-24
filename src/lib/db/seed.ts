import { db } from './index';
import { users, notes } from './schema';
import * as crypto from 'crypto';

function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function seed() {
  console.log("Seeding database...");
  
  try {
    // Check if seed user exists
    const existingUser = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, 'demo@flownotes.app')
    });

    let userId = existingUser?.id;

    if (!userId) {
        // Create demo user
        const [newUser] = await db.insert(users).values({
            name: "Demo User",
            email: "demo@flownotes.app",
            password: hashPassword("demo123"),
        }).returning();
        userId = newUser.id;
        console.log("Demo user created: demo@flownotes.app / demo123");
    } else {
        console.log("Demo user already exists");
    }

    // Check if notes exist for this user
    const existingNotes = await db.query.notes.findMany({
        where: (notes, { eq }) => eq(notes.userId, userId!)
    });

    if (existingNotes.length === 0) {
        // Create 5 example notes
        const exampleNotes = [
            {
                userId,
                title: "Welcome to flownotes",
                content: "This is your personal space to capture ideas, manage tasks, and organize your thoughts.\n\nYou can drag and drop notes to reorder them.",
                order: 0,
            },
            {
                userId,
                title: "Project Ideas",
                content: "1. AI-powered recipe generator\n2. Habit tracker with gamification\n3. Decentralized blogging platform",
                order: 1,
            },
            {
                userId,
                title: "Meeting Notes - Q3 Planning",
                content: "- Discussed new marketing strategies for Q3\n- Alice will lead the new campaign\n- Bob is preparing the budget report by Friday",
                order: 2,
            },
            {
                userId,
                title: "Books to Read",
                content: "- The Design of Everyday Things\n- Atomic Habits\n- Deep Work\n- Clean Code",
                order: 3,
            },
            {
                userId,
                title: "Grocery List",
                content: "[] Milk\n[] Eggs\n[] Bread\n[] Coffee beans\n[] Avocados",
                order: 4,
            }
        ];

        await db.insert(notes).values(exampleNotes);
        console.log("Inserted 5 example notes.");
    } else {
        console.log("Notes already exist for demo user.");
    }

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
