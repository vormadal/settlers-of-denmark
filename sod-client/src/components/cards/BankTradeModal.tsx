import React from 'react';
import { Player } from '../../state/Player';

interface BankTradeModalProps {
  player: Player;
  open: boolean;
  onClose: () => void;
  initialResourceType?: string;
}

const BankTradeModal: React.FC<BankTradeModalProps> = ({ player, open, onClose, initialResourceType }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Bank Trade</h2>
        <p className="text-gray-600 mb-4">Bank trading functionality will be restored in a future update.</p>
        <button
          onClick={onClose}
          className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary/90 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export { BankTradeModal };