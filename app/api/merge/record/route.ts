import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import clientPromise from '@/lib/mongodb';
import type { Document } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { fileCount } = await req.json();
    
    const client = await clientPromise;
    const db = client.db('pdf-guide');
    const usersCollection = db.collection('users');
    const transactionsCollection = db.collection('mergeTransactions');
    
    // Find user document
    const userDoc = await usersCollection.findOne({ userId: user.id });
    
    if (!userDoc) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Record the transaction
    const transaction = {
      userId: user.id,
      timestamp: new Date(),
      fileCount,
      success: true
    };
    
    await transactionsCollection.insertOne(transaction);
    
    // Update user's merge count and free merges remaining
    const updateData: Document = {
      $inc: { mergeCount: 1 },
      $set: { updatedAt: new Date() }
    };
    
    // If user is not premium and has free merges remaining, decrement the count
    if (!userDoc.isPremium && userDoc.freeMergesRemaining > 0) {
      updateData.$inc.freeMergesRemaining = -1;
    }
    
    await usersCollection.updateOne(
      { userId: user.id },
      updateData
    );
    
    // Get updated user data
    const updatedUser = await usersCollection.findOne({ userId: user.id });
    
    return NextResponse.json({
      success: true,
      freeMergesRemaining: updatedUser?.freeMergesRemaining || 0,
      mergeCount: updatedUser?.mergeCount || 0
    });
  } catch (error) {
    console.error('Error recording merge transaction:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}