import { createContext } from 'react';
import ProcessingError from '../errors/ProcessingError';

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
