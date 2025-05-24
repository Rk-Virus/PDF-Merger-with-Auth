'use client';

import { useState } from 'react';
import { useMerge } from '@/context/MergeContext';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UpgradeModal({ isOpen, onClose, onSuccess }: UpgradeModalProps) {
  const { upgradeToPremium, payForSingleMerge, isLoading, error } = useMerge();
  const [selectedOption, setSelectedOption] = useState<'premium' | 'single' | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    if (!selectedOption) {
      setLocalError('Please select an option');
      return;
    }

    setLocalError(null);
    let success = false;

    if (selectedOption === 'premium') {
      success = await upgradeToPremium();
    } else if (selectedOption === 'single') {
      success = await payForSingleMerge();
    }

    if (success) {
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Upgrade Your Plan</h2>
        
        {(error || localError) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error || localError}
          </div>
        )}
        
        <div className="space-y-4 mb-8">
          <div 
            className={`border rounded-xl p-4 cursor-pointer transition-all ${selectedOption === 'premium' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
            onClick={() => setSelectedOption('premium')}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg">Premium Plan</h3>
              <span className="font-bold text-xl">$9.99</span>
            </div>
            <p className="text-gray-600">Unlimited PDF merges, no restrictions</p>
          </div>
          
          <div 
            className={`border rounded-xl p-4 cursor-pointer transition-all ${selectedOption === 'single' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
            onClick={() => setSelectedOption('single')}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg">Single Merge</h3>
              <span className="font-bold text-xl">$1.99</span>
            </div>
            <p className="text-gray-600">Pay for a single PDF merge</p>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleUpgrade}
            disabled={isLoading || !selectedOption}
            className={`px-6 py-2.5 text-sm font-medium text-white rounded-xl transition-all ${isLoading || !selectedOption ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:from-blue-700 hover:to-purple-700'}`}
          >
            {isLoading ? 'Processing...' : 'Upgrade Now'}
          </button>
        </div>
      </div>
    </div>
  );
}