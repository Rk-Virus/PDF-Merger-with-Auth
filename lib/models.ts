export interface User {
  userId: string; // Clerk user ID
  email: string;
  mergeCount: number; // Number of merges performed
  freeMergesRemaining: number; // Number of free merges remaining
  isPremium: boolean; // Whether the user has a premium subscription
  createdAt: Date;
  updatedAt: Date;
}

export interface MergeTransaction {
  userId: string;
  timestamp: Date;
  fileCount: number;
  success: boolean;
  paymentId?: string; // If this was a paid merge
}