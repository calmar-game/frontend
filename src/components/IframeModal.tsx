import React from 'react';
import { X } from 'lucide-react';

interface IframeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

export function IframeModal({ isOpen, onClose, url }: IframeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="relative w-full max-w-4xl h-[80vh] glass-effect pixel-corners">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 w-8 h-8 z-100 flex items-center justify-center
                   bg-[#00ff00] text-black rounded-full hover:bg-[#00ff00]/80 transition-colors"
        >
          <X size={20} />
        </button>
        
        <iframe
          src={url}
          className="w-full h-full pixel-corners"
          sandbox="allow-scripts allow-same-origin allow-popups"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
}