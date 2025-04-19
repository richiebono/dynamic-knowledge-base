export class TopicVersion {
    private readonly version: number;
    private readonly createdAt: Date;
    private readonly content: string;

    constructor(version: number, content: string) {
        this.version = version;
        this.content = content;
        this.createdAt = new Date();
    }

    public getVersion(): number {
        return this.version;
    }

    public getContent(): string {
        return this.content;
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }
}