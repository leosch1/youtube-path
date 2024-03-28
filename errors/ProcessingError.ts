class ProcessingError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export default ProcessingError;
