import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createInstance } from 'fhevmjs';
import type { FhevmInstance } from 'fhevmjs';

interface FHEContextType {
  instance: FhevmInstance | null;
  isInitialized: boolean;
}

const FHEContext = createContext<FHEContextType | undefined>(undefined);

export function FHEProvider({ children }: { children: ReactNode }) {
  const [instance, setInstance] = useState<FhevmInstance | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // FHE initialization will be done when needed
    // For now, mark as initialized to allow the app to load
    setIsInitialized(true);
  }, []);

  return (
    <FHEContext.Provider value={{ instance, isInitialized }}>
      {children}
    </FHEContext.Provider>
  );
}

export function useFHE() {
  const context = useContext(FHEContext);
  if (context === undefined) {
    throw new Error('useFHE must be used within a FHEProvider');
  }
  return context;
}