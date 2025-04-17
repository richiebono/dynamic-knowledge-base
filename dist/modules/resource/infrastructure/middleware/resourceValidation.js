"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resourceValidation = void 0;
const resourceType_1 = require("../../domain/valueObjects/resourceType");
const resourceValidation = (req, res, next) => {
    const resourceData = req.body;
    if (!resourceData.url || typeof resourceData.url !== 'string') {
        return res.status(400).json({ error: 'Invalid or missing URL' });
    }
    if (!resourceData.description || typeof resourceData.description !== 'string') {
        return res.status(400).json({ error: 'Invalid or missing description' });
    }
    if (!resourceData.type || typeof resourceData.type !== 'string') {
        return res.status(400).json({ error: 'Invalid or missing type' });
    }
    if (!Object.values(resourceType_1.ResourceType).includes(resourceData.type)) {
        return res.status(400).json({ error: 'Invalid resource type' });
    }
    if (!resourceData.topicId || typeof resourceData.topicId !== 'number') {
        return res.status(400).json({ error: 'Invalid or missing topic ID' });
    }
    next();
};
exports.resourceValidation = resourceValidation;
