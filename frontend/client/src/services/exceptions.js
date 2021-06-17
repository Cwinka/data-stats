export class ApiPythonError extends Error {
    status
    errors

    constructor(status, message, errors = []){
        super(message);
        this.status = status;
        this.errors = errors;
    }
    static BadRequest(message, errors) {
        return new ApiPythonError(400, message, errors);
    }
}