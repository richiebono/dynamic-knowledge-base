"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopicVersion = void 0;
class TopicVersion {
    constructor(version, content) {
        this.version = version;
        this.content = content;
        this.createdAt = new Date();
    }
    getVersion() {
        return this.version;
    }
    getContent() {
        return this.content;
    }
    getCreatedAt() {
        return this.createdAt;
    }
}
exports.TopicVersion = TopicVersion;
