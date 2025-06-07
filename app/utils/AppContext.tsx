// app/context/AppContext.tsx
'use client';

import React, { createContext, useContext, useState } from 'react';

type AppState = {
  contentId: number | null;
  setContentId: (id: number | null) => void;
};

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [contentId, setContentId] = useState<number | null>(null);

  return (
    <AppContext.Provider value={{ contentId, setContentId }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
