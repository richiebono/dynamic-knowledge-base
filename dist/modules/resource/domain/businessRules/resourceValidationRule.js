"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceValidationRule = void 0;
class ResourceValidationRule {
    static validateResourceData(resourceData) {
        if (!resourceData.url || typeof resourceData.url !== 'string') {
            throw new Error('Invalid URL: URL is required and must be a string.');
        }
        if (!resourceData.description || typeof resourceData.description !== 'string') {
            throw new Error('Invalid Description: Description is required and must be a string.');
        }
        if (!resourceData.type || typeof resourceData.type !== 'string') {
            throw new Error('Invalid Type: Type is required and must be a string.');
        }
        // Additional validation rules can be added here
    }
}
exports.ResourceValidationRule = ResourceValidationRule;
