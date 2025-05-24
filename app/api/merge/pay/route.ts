import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import clientPromise from '@/lib/mongodb';

// This is a simplified pay-per-merge endpoint
// In a real application, you would integrate with a payment provider like Stripe
export async function POST() {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // In a real application, you would process a single merge payment here
    // For this example, we'll just add a transaction and grant a single merge
    
    const client = await clientPromise;
    const db = client.db('pdf-guide');
    const usersCollection = db.collection('users');
    const transactionsCollection = db.collection('mergeTransactions');
    
    // Record the payment transaction
    const paymentTransaction = {
      userId: user.id,
      timestamp: new Date(),
      type: 'payment',
      amount: 1.99, // Example price per merge
      description: 'Single PDF merge purchase'
    };
    
    const result = await transactionsCollection.insertOne(paymentTransaction);
    
    // Grant a single paid merge by adding a special flag
    await usersCollection.updateOne(
      { userId: user.id },
      { 
        $set: { 
          hasPaidMerge: true,
          updatedAt: new Date() 
        } 
      }
    );
    
    return NextResponse.json({
      success: true,
      message: 'Payment successful',
      transactionId: result.insertedId
    });
  } catch (error) {
    console.error('Error processing merge payment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}