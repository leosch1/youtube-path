import ProcessingError from './ProcessingError';

class ParseError extends ProcessingError {
    constructor(message: string) {
        super(message);
        this.name = 'ParseError';
    }
}

export default ParseError;
