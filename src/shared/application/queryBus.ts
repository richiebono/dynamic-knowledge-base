export interface IQuery {
    execute(query: any): Promise<any>;
}

export class QueryBus {
    private handlers: Map<string, IQuery>;

    constructor() {
        this.handlers = new Map();
    }

    register(queryName: string, handler: IQuery): void {
        this.handlers.set(queryName, handler);
    }

    async execute(queryName: string, query: any): Promise<any> {
        const handler = this.handlers.get(queryName);
        if (!handler) {
            throw new Error(`No handler registered for query: ${queryName}`);
        }
        return handler.execute(query);
    }
}