"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
class ErrorHandler {
    handle(err, req, res, next) {
        const statusCode = err.statusCode || 500;
        const message = err.message || 'Internal Server Error';
        res.status(statusCode).json({
            status: 'error',
            statusCode,
            message,
        });
        next();
    }
}
exports.ErrorHandler = ErrorHandler;
