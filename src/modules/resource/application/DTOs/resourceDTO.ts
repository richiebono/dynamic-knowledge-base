export interface ResourceDTO {
    id: string;
    topicId: string;
    url: string;
    description: string;
    type: string;
    createdAt: Date;
    updatedAt?: Date; 
}

export interface CreateResourceDTO {
    topicId: string;
    url: string;
    description: string;
    type: string;
}

export interface UpdateResourceDTO {
    url?: string;
    description?: string;
    type?: string;
}