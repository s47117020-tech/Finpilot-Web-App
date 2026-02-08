import { ReactNode } from 'react';

interface WrappedCardProps {
  children: ReactNode;
  isActive: boolean;
  direction: 'enter-left' | 'enter-right' | 'active' | 'exit-left' | 'exit-right';
  gradient?: string;
}

export function WrappedCard({ children, isActive, direction, gradient }: WrappedCardProps) {
  const getTransformClass = () => {
    switch (direction) {
      case 'enter-right':
        return 'translate-x-full opacity-0 scale-95';
      case 'enter-left':
        return '-translate-x-full opacity-0 scale-95';
      case 'exit-left':
        return '-translate-x-full opacity-0 scale-95';
      case 'exit-right':
        return 'translate-x-full opacity-0 scale-95';
      case 'active':
      default:
        return 'translate-x-0 opacity-100 scale-100';
    }
  };

  return (
    <div
      className={`
        absolute inset-0 flex items-center justify-center p-4 md:p-8
        transition-all duration-700 ease-out
        ${getTransformClass()}
      `}
      style={{ willChange: 'transform, opacity' }}
    >
      <div
        className={`
          w-full max-w-lg mx-auto rounded-3xl p-8 md:p-12
          shadow-2xl backdrop-blur-xl border border-white/10
          flex flex-col items-center justify-center text-center
          min-h-[60vh] max-h-[85vh] relative overflow-hidden
          ${gradient || 'bg-gradient-to-br from-[#1a2e14] via-[#2e4f21] to-[#1a3a1a]'}
        `}
      >
        {/* Decorative glow orbs */}
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-[#a0f1bd]/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-[#2e4f21]/20 blur-3xl" />
        
        <div className="relative z-10 w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
