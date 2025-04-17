"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resource = void 0;
class Resource {
    constructor({ id, topicId, url, description, type, createdAt, updatedAt, }) {
        this.id = id;
        this.topicId = topicId;
        this.url = url;
        this.description = description;
        this.type = type;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.Resource = Resource;
