import ProcessingError from './ProcessingError';

class CalculationError extends ProcessingError {
    data: any;

    constructor(message: string, data: any) {
        super(message);
        this.name = 'CalculationError';
        this.data = data;
    }
}

export default CalculationError;
