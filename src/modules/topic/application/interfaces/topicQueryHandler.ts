export interface ITopicQueryHandler {
    getTopicById(topicId: string): Promise<any>;
    getTopicTree(topicId: string): Promise<any>;
    findShortestPath(startTopicId: string, endTopicId: string): Promise<any>;
}
