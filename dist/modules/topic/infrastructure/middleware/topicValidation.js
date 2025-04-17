"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.topicValidationRules = void 0;
const express_validator_1 = require("express-validator");
const topicValidationRules = () => {
    return [
        (0, express_validator_1.body)('name').isString().notEmpty().withMessage('Name is required and must be a string.'),
        (0, express_validator_1.body)('content').isString().notEmpty().withMessage('Content is required and must be a string.'),
        (0, express_validator_1.body)('parentTopicId').optional().isInt().withMessage('Parent Topic ID must be an integer.'),
    ];
};
exports.topicValidationRules = topicValidationRules;
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
exports.validate = validate;
