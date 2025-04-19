export class TopicHierarchyRule {
    public static validateHierarchy(parentTopicId: string | null, childTopicId: string): boolean {
        // Implement logic to validate if the child topic can be a subtopic of the parent topic
        // For example, check for circular references or other business rules
        return true; // Placeholder return value
    }
}