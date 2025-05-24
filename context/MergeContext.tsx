'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from '@clerk/nextjs';

interface MergeContextType {
  isLoading: boolean;
  error: string | null;
  recordMerge: (fileCount: number) => Promise<boolean>;
}

const MergeContext = createContext<MergeContextType | undefined>(undefined);

export function MergeProvider({ children }: { children: ReactNode }) {
  const { isSignedIn } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);





  const recordMerge = async (fileCount: number): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/merge/record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileCount }),
      });

      if (!response.ok) {
        throw new Error('Failed to record merge');
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <MergeContext.Provider
      value={{
        isLoading,
        error,
        recordMerge
      }}
    >
      {children}
    </MergeContext.Provider>
  );
}

export function useMerge() {
  const context = useContext(MergeContext);
  if (context === undefined) {
    throw new Error('useMerge must be used within a MergeProvider');
  }
  return context;
}