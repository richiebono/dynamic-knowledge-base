export interface TopicDTO {
    subTopics: TopicDTO[];
    id: string;
    name: string;
    content: string;
    createdAt: Date;
    updatedAt?: Date;
    version: number;
    parentTopicId?: string;
}

export interface CreateTopicDTO {
    name: string;
    content: string;
    createdBy: string;
    parentTopicId: string | undefined;
}

export interface UpdateTopicDTO {
    name: string;
    content: string;
    updatedBy: string;
    parentTopicId: string | undefined;
}