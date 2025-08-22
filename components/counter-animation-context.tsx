'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface CounterAnimationContextType {
  isGloballyPaused: boolean
  pauseAllAnimations: () => void
  resumeAllAnimations: () => void
}

const CounterAnimationContext = createContext<CounterAnimationContextType | undefined>(undefined);

export function CounterAnimationProvider({ children }: { children: ReactNode }) {
  const [isGloballyPaused, setIsGloballyPaused] = useState(false);

  const pauseAllAnimations = () => {
    setIsGloballyPaused(true);
  };

  const resumeAllAnimations = () => {
    setIsGloballyPaused(false);
  };

  return (
    <CounterAnimationContext.Provider
      value={{
        isGloballyPaused,
        pauseAllAnimations,
        resumeAllAnimations
      }}
    >
      {children}
    </CounterAnimationContext.Provider>
  );
}

export function useCounterAnimation() {
  const context = useContext(CounterAnimationContext);
  if (context === undefined) {
    throw new Error('useCounterAnimation must be used within a CounterAnimationProvider');
  }
  return context;
}
