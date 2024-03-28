import ProcessingError from '../errors/ProcessingError';
import { createContext } from 'react';

interface ProcessingContextType {
  progress: number;
  error: ProcessingError | null;
  setProgress: (value: number) => void;
  setError: (error: ProcessingError | null) => void;
}

export const ProcessingContext = createContext<ProcessingContextType>({
  progress: 0,
  error: null,
  setProgress: () => {},
  setError: () => {}
});
