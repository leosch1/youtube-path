class ProcessingError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ProcessingError';
    }
}

export default ProcessingError;
