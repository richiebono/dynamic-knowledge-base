export class Resource {
    id: string;
    topicId: string;
    url: string;
    description: string;
    type: string;
    createdAt: Date;
    updatedAt?: Date;

    constructor({
        id,
        topicId,
        url,
        description,
        type,
        createdAt,
        updatedAt,
    }: {
        id: string;
        topicId: string;
        url: string;
        description: string;
        type: string;
        createdAt: Date;
        updatedAt?: Date;
    }) {
        this.id = id;
        this.topicId = topicId;
        this.url = url;
        this.description = description;
        this.type = type;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}