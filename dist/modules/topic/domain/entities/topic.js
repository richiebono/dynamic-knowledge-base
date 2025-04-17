"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Topic = void 0;
class Topic {
    constructor(id, name, content, version, parentTopicId) {
        this.id = id;
        this.name = name;
        this.content = content;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.version = version;
        this.parentTopicId = parentTopicId;
    }
    updateContent(newContent) {
        this.content = newContent;
        this.updatedAt = new Date();
        this.version += 1;
    }
    static create(id, name, content, parentTopicId) {
        return new Topic(id, name, content, 1, parentTopicId);
    }
}
exports.Topic = Topic;
