export class TopicHistory {
    id: string;
    topicId: string;
    name: string;
    content: string;
    version: number;
    createdAt: Date;
    parentTopicId?: string;

    constructor({
        id,
        topicId,
        name,
        content,
        version,
        createdAt,
        parentTopicId,
    }: {
        id: string;
        topicId: string;
        name: string;
        content: string;
        version: number;
        createdAt: Date;
        parentTopicId?: string;
    }) {
        this.id = id;
        this.topicId = topicId;
        this.name = name;
        this.content = content;
        this.version = version;
        this.createdAt = createdAt;
        this.parentTopicId = parentTopicId;
    }

    static createFromTopic(id: string, topic: any): TopicHistory {
        return new TopicHistory({
            id,
            topicId: topic.id,
            name: topic.name,
            content: topic.content,
            version: topic.version,
            createdAt: new Date(),
            parentTopicId: topic.parentTopicId,
        });
    }
}