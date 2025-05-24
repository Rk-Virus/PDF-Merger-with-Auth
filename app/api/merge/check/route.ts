import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server'; // ✅ Correct import
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('pdf-guide');
    const usersCollection = db.collection('users');

    // Try to find existing user
    let userDoc = await usersCollection.findOne({ userId });

    // If user doesn't exist, create new one
    if (!userDoc) {
      const newUser = {
        _id: new ObjectId(),
        userId,
        email: '',
        mergeCount: 0,
        freeMergesRemaining: 2,
        isPremium: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await usersCollection.insertOne(newUser);
      userDoc = newUser; // reassign to safely use below
    }

    const canMergeForFree = userDoc.freeMergesRemaining > 0;
    const isPremium = userDoc.isPremium;

    return NextResponse.json({
      canMergeForFree,
      isPremium,
      freeMergesRemaining: userDoc.freeMergesRemaining,
      mergeCount: userDoc.mergeCount,
    });
  } catch (error) {
    console.error('Error checking merge eligibility:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
