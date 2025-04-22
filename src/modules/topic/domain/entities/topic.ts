export class Topic {
    
    id: string;
    name: string;
    content: string;
    createdAt: Date;
    updatedAt?: Date;
    version: number;
    parentTopicId?: string;

    constructor({
        id,
        name,
        content,
        createdAt,
        updatedAt,
        version,
        parentTopicId,
    }: {
        id: string;
        name: string;
        content: string;
        createdAt: Date;
        updatedAt?: Date;
        version: number;
        parentTopicId?: string;
    }) {
        this.id = id;
        this.name = name;
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.version = version;
        this.parentTopicId = parentTopicId;
    }

    update({
        name,
        content,
        parentTopicId,
    }: {
        name: string;
        content: string;
        parentTopicId?: string;
    }) {
        this.content = content;
        this.name = name;
        this.parentTopicId = parentTopicId;
        this.updatedAt = new Date();
        this.version += 1;
    }

    static create(id: string, name: string, content: string, parentTopicId?: string): Topic {
        return new Topic({
            id,
            name,
            content,
            createdAt: new Date(),
            updatedAt: new Date(),
            version: 1,
            parentTopicId,
        });
    }
}