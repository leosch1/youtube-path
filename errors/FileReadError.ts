import ProcessingError from './ProcessingError';

class FileReadError extends ProcessingError {
    constructor(message: string) {
        super(message);
        this.name = 'FileReadError';
    }
}

export default FileReadError;
