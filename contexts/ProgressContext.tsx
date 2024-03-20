import { createContext } from 'react';

export const ProgressContext = createContext({
    progress: 0,
    setProgress: (value: number) => {},
  });
  